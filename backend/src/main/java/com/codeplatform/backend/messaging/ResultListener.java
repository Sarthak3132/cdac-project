package com.codeplatform.backend.messaging;
import com.codeplatform.backend.codeexecution.dto.CodeExecutionResultMessage;
import com.codeplatform.backend.config.RabbitMQConfig;
import com.codeplatform.backend.submission.SubmissionRepository;
import com.codeplatform.backend.submission.SubmissionVerdict;
import com.codeplatform.backend.problemExecution.dto.ProblemExecutionResultMessage;
import com.codeplatform.backend.problemExecution.dto.TestCaseResultDto;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class ResultListener {

    private final SimpMessagingTemplate webSocketTemplate;
    private final SubmissionRepository submissionRepository;

    @RabbitListener(queues = RabbitMQConfig.CODE_RESULT_QUEUE)
    public void onCodeResult(CodeExecutionResultMessage result) {
        webSocketTemplate.convertAndSend("/topic/code-result/" + result.getSessionId(), result);
    }

    @RabbitListener(queues = RabbitMQConfig.PROBLEM_RESULT_QUEUE)
    public void onExampleResult(ProblemExecutionResultMessage result) {
        // RUN mode: no DB row, sessionId and websocketId are the same disposable UUID
        webSocketTemplate.convertAndSend("/topic/problem-run-result/" + result.getWebsocketId(), result);
    }

    @RabbitListener(queues = RabbitMQConfig.SUBMISSION_RESULT_QUEUE)
    @Transactional
    public void onSubmissionResult(ProblemExecutionResultMessage result) {
        Long submissionId = Long.valueOf(result.getReferenceId());
        submissionRepository.findById(submissionId).ifPresent(submission -> {
            submission.setVerdict(mapVerdict(result.getOverallStatus()));
            submission.setPassedTestcases(result.getPassedCount());
            // the worker now sends at most ONE test case: the first one that failed
            // (or null if everything passed, or null on a compile error)
            TestCaseResultDto failed = result.getFailedTestCase();
            if (failed != null) {
                if (failed.getTime() != null) {
                    submission.setCpuTimeMs((int) Math.round(failed.getTime() * 1000));
                }
                submission.setMemoryUsageKb(failed.getMemory());
                submission.setFailureInput(failed.getInputData());
                submission.setExpectedOutput(failed.getExpectedOutput());
                submission.setActualOutput(failed.getActualOutput());
                submission.setDiagnosticMessage(
                        failed.getStderr() != null ? failed.getStderr() : failed.getStatusDescription()
                );
            }
            if (result.getCompileError() != null) {
                submission.setDiagnosticMessage(result.getCompileError());
            }
            submissionRepository.save(submission);
        });

        // broadcast on the private websocket id, NOT the DB primary key
        webSocketTemplate.convertAndSend(
                "/topic/submission-result/" + result.getWebsocketId(),
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