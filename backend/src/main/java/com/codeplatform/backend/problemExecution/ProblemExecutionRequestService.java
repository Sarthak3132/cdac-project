package com.codeplatform.backend.problemExecution;

import com.codeplatform.backend.config.RabbitMQConfig;
import com.codeplatform.backend.exception.BadRequestException;
import com.codeplatform.backend.language.LanguageEntity;
import com.codeplatform.backend.language.LanguageRepository;
import com.codeplatform.backend.problem.ProblemEntity;
import com.codeplatform.backend.problem.ProblemRepository;
import com.codeplatform.backend.problemExecution.dto.ProblemExecutionMessage;
import com.codeplatform.backend.problemExecution.dto.ProblemExecutionRequestDto;
import com.codeplatform.backend.problemExecution.dto.TestCaseDto;
import com.codeplatform.backend.problemtemplate.ProblemTemplateRepository;
import com.codeplatform.backend.testcase.TestCaseEntity;
import com.codeplatform.backend.testcase.TestCaseRepository;
import com.codeplatform.backend.user.UserEntity;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
@Service
@RequiredArgsConstructor
@Slf4j
public class ProblemExecutionRequestService {

    private final RabbitTemplate rabbitTemplate;
    private final LanguageRepository languageRepository;
    private final TestCaseRepository testCaseRepository;
    private final ProblemRepository problemRepository;
    private final ProblemTemplateRepository problemTemplateRepository;
    private final SubmissionRepository submissionRepository;   // new

    private static final String USER_CODE_PLACEHOLDER = "{{USER_CODE}}";

    public String submitRun(Long problemId, ProblemExecutionRequestDto dto) {
        ProblemEntity problem = getProblem(problemId);
        LanguageEntity language = resolveLanguage(dto.languageId());
        String fullSourceCode = assembleSourceCode(problem, language, dto.sourceCode());

        List<TestCaseDto> visibleTestCases = testCaseRepository.findByProblemIdAndVisibleTrue(problemId)
                .stream()
                .map(this::toDto)
                .toList();

        if (visibleTestCases.isEmpty()) {
            throw new BadRequestException("No visible test cases available for this problem");
        }

        String sessionId = UUID.randomUUID().toString();

        publish(sessionId, fullSourceCode, language.getJudge0LanguageId(), visibleTestCases,
                "RUN", problem, RabbitMQConfig.EXAMPLE_RUN_QUEUE);

        return sessionId;
    }

    // Persists a row first, uses its own DB id as the sessionId — so the
    // submission worker's result can be matched straight back to the row via ID.
    @Transactional
    public String submitFull(Long problemId, ProblemExecutionRequestDto dto, UserEntity currentUser) {
        log.info("submitFull started | problemId={} userId={}", problemId, currentUser != null ? currentUser.getId() : "NULL");

        ProblemEntity problem = getProblem(problemId);
        log.info("Problem resolved | id={} title={}", problem.getId(), problem.getTitle());

        LanguageEntity language = resolveLanguage(dto.languageId());
        log.info("Language resolved | id={} judge0LanguageId={}", language.getId(), language.getJudge0LanguageId());

        String fullSourceCode = assembleSourceCode(problem, language, dto.sourceCode());
        log.info("Source assembled | length={}", fullSourceCode.length());

        List<TestCaseDto> allTestCases = testCaseRepository.findByProblemId(problemId)
                .stream()
                .map(this::toDto)
                .toList();
        log.info("Test cases fetched | count={}", allTestCases.size());

        if (allTestCases.isEmpty()) {
            throw new BadRequestException("No test cases configured for this problem");
        }

        SubmissionEntity submission = SubmissionEntity.builder()
                .user(currentUser)
                .problem(problem)
                .language(language)
                .codeBody(fullSourceCode)
                .totalTestcases(allTestCases.size())
                .build();

        submission = submissionRepository.save(submission);
        log.info("Submission row saved | id={}", submission.getId());

        String sessionId = submission.getId().toString();

        publish(sessionId, fullSourceCode, language.getJudge0LanguageId(), allTestCases,
                "SUBMIT", problem, RabbitMQConfig.SUBMISSION_QUEUE);

        log.info("Published to submission queue | sessionId={}", sessionId);

        return sessionId;
    }
    private ProblemEntity getProblem(Long problemId) {
        return problemRepository.findById(problemId)
                .orElseThrow(() -> new BadRequestException("Problem not found"));
    }

    private LanguageEntity resolveLanguage(Long languageId) {
        return languageRepository.findById(languageId)
                .filter(LanguageEntity::isEnabled)
                .orElseThrow(() -> new BadRequestException("Unsupported or disabled language"));
    }

    private String assembleSourceCode(ProblemEntity problem, LanguageEntity language, String userCode) {
        return problemTemplateRepository.findByProblem_IdAndLanguage_Id(problem.getId(), language.getId())
                .map(template -> template.getDriverCode().replace(USER_CODE_PLACEHOLDER, userCode))
                .orElse(userCode);
    }

    private TestCaseDto toDto(TestCaseEntity tc) {
        return new TestCaseDto(tc.getId().toString(), tc.getInputData(), tc.getExpectedOutput());
    }

    private void publish(String sessionId, String sourceCode, Integer judge0LanguageId,
                         List<TestCaseDto> testCases, String mode, ProblemEntity problem, String queue) {

        ProblemExecutionMessage message = new ProblemExecutionMessage(
                sessionId, sourceCode, judge0LanguageId, testCases, mode,
                problem.getTimeLimitMs(), problem.getMemoryLimitKb()
        );

        rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE, queue, message);
    }
}