package com.codeplatform.backend.problem;

import com.codeplatform.backend.common.AppConstants;
import com.codeplatform.backend.common.SuccessResponse;
import com.codeplatform.backend.problem.dto.*;
import com.codeplatform.backend.security.UserContext;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(AppConstants.PROBLEM)
@RequiredArgsConstructor
public class ProblemController {

    private final ProblemService problemService;

    /**
     * Create Problem
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SuccessResponse<ProblemSummary>> createProblem(
            @AuthenticationPrincipal UserContext userContext,
            @Valid @RequestBody CreateProblemRequest request
    ) {
        ProblemSummary response = problemService.createProblem(request, userContext);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(SuccessResponse.of("Problem created successfully", response));
    }

    /**
     * Get Problem By Id
     */
    @GetMapping("/{id}")
    public ResponseEntity<SuccessResponse<ProblemDetails>> getProblemById(
            @PathVariable Long id
    ) {
        ProblemDetails response = problemService.getProblemById(id);

        return ResponseEntity.ok(
                SuccessResponse.of("Problem fetched successfully", response)
        );
    }

    @GetMapping
    public ResponseEntity<SuccessResponse<Page<ProblemSummary>>> getProblems(

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "10")
            int size,

            @RequestParam(required = false)
            String search,

            @RequestParam(required = false)
            ProblemDifficulty difficulty,

            @RequestParam(required = false)
            String tag,

            @RequestParam(required = false)
            Boolean solved

    ) {

        ProblemFilter filter = new ProblemFilter();

        filter.setSearch(search);
        filter.setProblemDifficulty(difficulty);

        filter.setTag(tag);

        filter.setSolved(solved);

        Page<ProblemSummary> response =
                problemService.getProblems(
                        filter,
                        page,
                        size
                );

        return ResponseEntity.ok(
                SuccessResponse.of(
                        "Problems fetched successfully",
                        response
                )
        );
    }

    /**
     * Update Problem
     * NOTE: previously missing @PreAuthorize, meaning any authenticated user
     * could update any problem. Locked down to ADMIN, matching create/delete.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SuccessResponse<ProblemSummary>> updateProblem(
            @PathVariable Long id,
            @Valid @RequestBody UpdateProblemRequest request
    ) {
        ProblemSummary response = problemService.updateProblem(id, request);

        return ResponseEntity.ok(
                SuccessResponse.of("Problem updated successfully", response)
        );
    }

    /**
     * Delete Problem
     * NOTE: previously missing @PreAuthorize - same issue as update above.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SuccessResponse<Void>> deleteProblem(
            @PathVariable Long id
    ) {
        problemService.deleteProblem(id);

        return ResponseEntity.ok(
                SuccessResponse.of("Problem deleted successfully")
        );
    }
}