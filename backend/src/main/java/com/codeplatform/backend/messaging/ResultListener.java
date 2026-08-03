package com.codeplatform.backend.messaging;

import com.codeplatform.backend.codeexecution.dto.CodeExecutionResultMessage;
import com.codeplatform.backend.config.RabbitMQConfig;
import com.codeplatform.backend.problemExecution.SubmissionRepository;
import com.codeplatform.backend.problemExecution.SubmissionVerdict;
import com.codeplatform.backend.problemExecution.dto.ProblemExecutionResultMessage;
import com.codeplatform.backend.problemExecution.dto.TestCaseResultDto;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;

@Component
@RequiredArgsConstructor
public class ResultListener {

    private final SimpMessagingTemplate webSocketTemplate;
    private final SubmissionRepository submissionRepository;

    @RabbitListener(queues = RabbitMQConfig.CODE_RESULT_QUEUE)
    public void onCodeResult(CodeExecutionResultMessage result) {
        webSocketTemplate.convertAndSend("/topic/code-result/" + result.getSessionId(), result);
    }

    @RabbitListener(queues = RabbitMQConfig.EXAMPLE_RESULT_QUEUE)
    public void onExampleResult(ProblemExecutionResultMessage result) {
        webSocketTemplate.convertAndSend("/topic/example-result/" + result.getSessionId(), result);
    }

    @RabbitListener(queues = RabbitMQConfig.SUBMISSION_RESULT_QUEUE)
    @Transactional
    public void onSubmissionResult(ProblemExecutionResultMessage result) {

        Long submissionId = Long.valueOf(result.getSessionId());

        submissionRepository.findById(submissionId).ifPresent(submission -> {

            submission.setVerdict(mapVerdict(result.getOverallStatus()));
            submission.setPassedTestcases(result.getPassedCount());

            result.getResults().stream()
                    .map(TestCaseResultDto::getTime)
                    .filter(Objects::nonNull)
                    .max(Double::compareTo)
                    .ifPresent(t -> submission.setCpuTimeMs((int) Math.round(t * 1000)));

            result.getResults().stream()
                    .map(TestCaseResultDto::getMemory)
                    .filter(Objects::nonNull)
                    .max(Integer::compareTo)
                    .ifPresent(submission::setMemoryUsageKb);

            result.getResults().stream()
                    .filter(r -> !r.isPassed())
                    .findFirst()
                    .ifPresent(failing -> {
                        submission.setFailureInput(failing.getInputData());
                        submission.setExpectedOutput(failing.getExpectedOutput());
                        submission.setActualOutput(failing.getActualOutput());
                        submission.setDiagnosticMessage(
                                failing.getStderr() != null
                                        ? failing.getStderr()
                                        : failing.getStatusDescription()
                        );
                    });

            submissionRepository.save(submission);
        });

        webSocketTemplate.convertAndSend(
                "/topic/submission-result/" + result.getSessionId(),
                result
        );
    }

    private SubmissionVerdict mapVerdict(String overallStatus) {
        return switch (overallStatus) {
            case "Accepted" -> SubmissionVerdict.ACCEPTED;
            case "Wrong Answer" -> SubmissionVerdict.WRONG_ANSWER;
            case "Compilation Error" -> SubmissionVerdict.COMPILATION_ERROR;
            case "Time Limit Exceeded" -> SubmissionVerdict.TIME_LIMIT_EXCEEDED;
            case "Runtime Error" -> SubmissionVerdict.RUNTIME_ERROR;
            default -> SubmissionVerdict.RUNTIME_ERROR;
        };
    }
}