package com.codeplatform.backend.problem;

import com.codeplatform.backend.common.AppConstants;
import com.codeplatform.backend.common.SuccessResponse;
import com.codeplatform.backend.problem.dto.CreateProblemRequest;
import com.codeplatform.backend.problem.dto.ProblemFilter;
import com.codeplatform.backend.problem.dto.ProblemInfo;
import com.codeplatform.backend.problem.dto.UpdateProblemRequest;
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
    public ResponseEntity<SuccessResponse<ProblemInfo>> createProblem(
            @AuthenticationPrincipal UserContext userContext,
            @Valid @RequestBody CreateProblemRequest request
    ) {
        ProblemInfo response = problemService.createProblem(request, userContext);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(SuccessResponse.of("Problem created successfully", response));
    }

    /**
     * Get Problem By Id
     */
    @GetMapping("/{id}")
    public ResponseEntity<SuccessResponse<ProblemInfo>> getProblemById(
            @PathVariable Long id
    ) {
        ProblemInfo response = problemService.getProblemById(id);

        return ResponseEntity.ok(
                SuccessResponse.of("Problem fetched successfully", response)
        );
    }

    /**
     * Get All Problems
     */
    @GetMapping
    public ResponseEntity<SuccessResponse<Page<ProblemInfo>>> getProblems(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) ProblemDifficulty difficulty,
            @RequestParam(required = false) String tag
    ) {
        ProblemFilter filter = new ProblemFilter();
        filter.setSearch(search);
        filter.setProblemDifficulty(difficulty);
        filter.setTag(tag);

        Page<ProblemInfo> response = problemService.getProblems(filter, page, size);

        return ResponseEntity.ok(
                SuccessResponse.of("Problems fetched successfully", response)
        );
    }

    /**
     * Update Problem
     * NOTE: previously missing @PreAuthorize, meaning any authenticated user
     * could update any problem. Locked down to ADMIN, matching create/delete.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SuccessResponse<ProblemInfo>> updateProblem(
            @PathVariable Long id,
            @Valid @RequestBody UpdateProblemRequest request
    ) {
        ProblemInfo response = problemService.updateProblem(id, request);

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