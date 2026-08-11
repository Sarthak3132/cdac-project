package com.codeplatform.backend.problemExecution;

import com.codeplatform.backend.common.AppConstants;
import com.codeplatform.backend.common.SuccessResponse;
import com.codeplatform.backend.problemExecution.dto.CodeRunResponseDto;
import com.codeplatform.backend.problemExecution.dto.ProblemExecutionRequestDto;
import com.codeplatform.backend.security.UserContext;
import com.codeplatform.backend.user.UserEntity;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(AppConstants.PROBLEM)
@RequiredArgsConstructor
@Slf4j
public class ProblemExecutionController {

    private final ProblemExecutionRequestService service;

    @PostMapping("/{problemId}/run")
    public ResponseEntity<SuccessResponse<CodeRunResponseDto>> runVisible(
            @PathVariable Long problemId,
            @Valid @RequestBody ProblemExecutionRequestDto dto) {

        String sessionId = service.submitRun(problemId, dto);
        return ResponseEntity.accepted().body(
                new SuccessResponse<>("Submitted for run against visible test cases", new CodeRunResponseDto(sessionId))
        );
    }

    @PostMapping("/{problemId}/submit")
    public ResponseEntity<SuccessResponse<CodeRunResponseDto>> submit(
            @PathVariable Long problemId,
            @Valid @RequestBody ProblemExecutionRequestDto dto) {



        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        UserContext userContext = (UserContext) auth.getPrincipal();
        UserEntity currentUser = userContext.userEntity();


        String sessionId = service.submitFull(problemId, dto, currentUser);


        return ResponseEntity.accepted().body(
                new SuccessResponse<>("Submitted for judging against all test cases", new CodeRunResponseDto(sessionId))
        );
    }
}