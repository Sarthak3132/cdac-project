package com.codeplatform.backend.problemtemplate;
import com.codeplatform.backend.common.AppConstants;
import com.codeplatform.backend.common.SuccessResponse;
import com.codeplatform.backend.problemtemplate.dto.CreateProblemTemplateRequest;
import com.codeplatform.backend.problemtemplate.dto.ProblemTemplateResponse;
import com.codeplatform.backend.problemtemplate.dto.TemplateDetailsResponse;
import com.codeplatform.backend.problemtemplate.dto.UpdateProblemTemplateRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping(AppConstants.PROBLEM_TEMPLATE)
@RequiredArgsConstructor
public class ProblemTemplateController {
    private final ProblemTemplateService problemTemplateService;
    /**
     * Create Problem Template
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SuccessResponse<ProblemTemplateResponse>> createTemplate(
            @Valid @RequestBody CreateProblemTemplateRequest request
    ) {
        ProblemTemplateResponse response = problemTemplateService.createTemplate(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(SuccessResponse.of("Template created successfully", response));
    }
    /**
     * Get Template By Id
     */
    @GetMapping("/{id}")
    public ResponseEntity<SuccessResponse<TemplateDetailsResponse>> getTemplateById(
            @PathVariable Long id
    ) {
        TemplateDetailsResponse response = problemTemplateService.getTemplateById(id);
        return ResponseEntity.ok(
                SuccessResponse.of("Template fetched successfully", response)
        );

    }
    /**
     * Get All Templates For A Problem
     */
    @GetMapping("/problem/{problemId}")
    public ResponseEntity<SuccessResponse<List<ProblemTemplateResponse>>> getTemplatesByProblem(
            @PathVariable Long problemId
    ) {
        List<ProblemTemplateResponse> response = problemTemplateService.getTemplatesByProblem(problemId);
        return ResponseEntity.ok(
                SuccessResponse.of("Teproblemmplates fetched successfully", response)
        );
    }
    /**
     * Update Template
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SuccessResponse<ProblemTemplateResponse>> updateTemplate(
            @PathVariable Long id,
            @Valid @RequestBody UpdateProblemTemplateRequest request
    ) {
        ProblemTemplateResponse response = problemTemplateService.updateTemplate(id, request);
        return ResponseEntity.ok(
                SuccessResponse.of("Template updated successfully", response)
        );
    }
    /**
     * Delete Template
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SuccessResponse<Void>> deleteTemplate(
            @PathVariable Long id
    ) {
        problemTemplateService.deleteTemplate(id);
        return ResponseEntity.ok(
                SuccessResponse.of("Template deleted successfully")
        );
    }
}