package com.codeplatform.backend.problemexample;


import com.codeplatform.backend.common.SuccessResponse;
import com.codeplatform.backend.problemexample.dto.CreateProblemExampleRequest;
import com.codeplatform.backend.problemexample.dto.ProblemExampleResponse;
import com.codeplatform.backend.problemexample.dto.UpdateProblemExampleRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/problems")
@RequiredArgsConstructor
public class ProblemExampleController {

    private final ProblemExampleService service;

    /**
     * Create Example
     */
    @PostMapping("/{problemId}/examples")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SuccessResponse<ProblemExampleResponse>> create(
            @PathVariable Long problemId,
            @Valid @RequestBody CreateProblemExampleRequest request
    ) {

        ProblemExampleResponse response = service.create(problemId, request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(
                        SuccessResponse.of(
                                "Problem example created successfully.",
                                response
                        )
                );
    }

    /**
     * Get All Examples
     */
    @GetMapping("/{problemId}/examples")
    public ResponseEntity<SuccessResponse<List<ProblemExampleResponse>>> getAll(
            @PathVariable Long problemId
    ) {

        List<ProblemExampleResponse> response = service.getAll(problemId);

        return ResponseEntity.ok(
                SuccessResponse.of(
                        "Problem examples fetched successfully.",
                        response
                )
        );
    }

    /**
     * Update Example
     */
    @PutMapping("/examples/{exampleId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SuccessResponse<ProblemExampleResponse>> update(
            @PathVariable Long exampleId,
            @Valid @RequestBody UpdateProblemExampleRequest request
    ) {

        ProblemExampleResponse response = service.update(exampleId, request);

        return ResponseEntity.ok(
                SuccessResponse.of(
                        "Problem example updated successfully.",
                        response
                )
        );
    }

    /**
     * Delete Example
     */
    @DeleteMapping("/examples/{exampleId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SuccessResponse<Void>> delete(
            @PathVariable Long exampleId
    ) {

        service.delete(exampleId);

        return ResponseEntity.ok(
                SuccessResponse.of(
                        "Problem example deleted successfully."
                )
        );
    }

}