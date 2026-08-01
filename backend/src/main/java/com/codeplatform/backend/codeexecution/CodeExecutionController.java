package com.codeplatform.backend.codeexecution;

import com.codeplatform.backend.codeexecution.dto.CodeRunRequestDto;
import com.codeplatform.backend.codeexecution.dto.CodeRunResponseDto;
import com.codeplatform.backend.common.SuccessResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/compiler")

@RequiredArgsConstructor
public class CodeExecutionController {

    private final CodeExecutionRequestService codeExecutionRequestService;

    @PostMapping("/run")
    public ResponseEntity<SuccessResponse<CodeRunResponseDto>> runCode(
            @Valid @RequestBody CodeRunRequestDto requestDto) {

        String sessionId = codeExecutionRequestService.submitRun(requestDto);

        return ResponseEntity.accepted().body(
                new SuccessResponse<>("Code submitted for execution", new CodeRunResponseDto(sessionId))
        );
    }
}