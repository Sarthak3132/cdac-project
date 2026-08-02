package com.codeplatform.backend.problemExecution;

import com.codeplatform.backend.common.SuccessResponse;
import com.codeplatform.backend.problemExecution.dto.CodeRunResponseDto;
import com.codeplatform.backend.problemExecution.dto.ProblemExecutionRequestDto;
import com.codeplatform.backend.user.UserEntity;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/compiler/problem")
@RequiredArgsConstructor
public class ProblemExecutionController {

    private final ProblemExecutionRequestService service;

    @PostMapping("/{problemId}/run")
    public ResponseEntity<SuccessResponse<CodeRunResponseDto>> runVisible(
            @PathVariable Long problemId,
            @Valid @RequestBody ProblemExecutionRequestDto dto) {

        String sessionId = service.submitRun(problemId, dto);
        return ResponseEntity.accepted().body(
                new SuccessResponse<>("Submitted for run against visible test cases", new CodeRunResponseDto(sessionId) )
        );
    }

    @PostMapping("/{problemId}/submit")
    public ResponseEntity<SuccessResponse<CodeRunResponseDto>> submit(
            @PathVariable Long problemId,
            @Valid @RequestBody ProblemExecutionRequestDto dto,
            @AuthenticationPrincipal UserEntity currentUser) {

        String sessionId = service.submitFull(problemId, dto, currentUser);
        return ResponseEntity.accepted().body(
                new SuccessResponse<>("Submitted for judging against all test cases" , new CodeRunResponseDto(sessionId))
        );
    }
}