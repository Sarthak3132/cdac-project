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
import com.codeplatform.backend.submission.SubmissionEntity;
import com.codeplatform.backend.submission.SubmissionRepository;
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

    // RUN has no DB row, so the websocket id and the reference id are the
    // same disposable UUID — nothing to look up later.
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

        String websocketId = UUID.randomUUID().toString();

        publish(websocketId, websocketId, fullSourceCode, language.getJudge0LanguageId(), visibleTestCases,
                "RUN", problem, RabbitMQConfig.PROBLEM_RUN_QUEUE);

        return websocketId;
    }

    // Persists a row first. referenceId (DB id) is how the worker matches
    // its result back to this row; it is never exposed to the client.
    // websocketId is a separate random UUID — only the caller and the
    // worker know it, and it's what the frontend subscribes to over STOMP.
    @Transactional
    public String submitFull(Long problemId, ProblemExecutionRequestDto dto, UserEntity currentUser) {

        ProblemEntity problem = getProblem(problemId);

        LanguageEntity language = resolveLanguage(dto.languageId());

        String fullSourceCode = assembleSourceCode(problem, language, dto.sourceCode());

        List<TestCaseDto> allTestCases = testCaseRepository.findByProblemId(problemId)
                .stream()
                .map(this::toDto)
                .toList();

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

        String referenceId = submission.getId().toString();
        String websocketId = UUID.randomUUID().toString();

        publish(referenceId, websocketId, fullSourceCode, language.getJudge0LanguageId(), allTestCases,
                "SUBMIT", problem, RabbitMQConfig.SUBMISSION_QUEUE);

        return websocketId;
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

    private void publish(String referenceId, String websocketId, String sourceCode, Integer judge0LanguageId,
                         List<TestCaseDto> testCases, String mode, ProblemEntity problem, String queue) {

        ProblemExecutionMessage message = new ProblemExecutionMessage(
                referenceId, websocketId, sourceCode, judge0LanguageId, testCases, mode,
                problem.getTimeLimitMs(), problem.getMemoryLimitKb()
        );

        rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE, queue, message);
    }
}