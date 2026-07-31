package com.codeplatform.backend.testcase;
import com.codeplatform.backend.common.SuccessResponse;
import com.codeplatform.backend.testcase.dto.CreateTestCaseRequest;
import com.codeplatform.backend.testcase.dto.TestCaseResponse;
import com.codeplatform.backend.testcase.dto.UpdateTestCaseRequest;
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
public class TestCaseController {

    private final TestCaseService testCaseService;

    /**
     * Create Test Case
     */
    @PostMapping("/{problemId}/testcases")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SuccessResponse<TestCaseResponse>> create(
            @PathVariable Long problemId,
            @Valid @RequestBody CreateTestCaseRequest request
    ) {

        TestCaseResponse response = testCaseService.create(problemId, request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(
                        SuccessResponse.of(
                                "Test case created successfully.",
                                response
                        )
                );
    }
    /**
     * Get All Test Cases (Admin only — includes hidden)
     */
    @GetMapping("/{problemId}/testcases")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SuccessResponse<List<TestCaseResponse>>> getAll(
            @PathVariable Long problemId
    ) {
        List<TestCaseResponse> response = testCaseService.getAll(problemId);
        return ResponseEntity.ok(
                SuccessResponse.of(
                        "Test cases fetched successfully.",
                        response
                )
        );
    }

    /**
     * Get Visible Test Cases (User-facing)
     */

    @GetMapping("/{problemId}/testcases/visible")
    public ResponseEntity<SuccessResponse<List<TestCaseResponse>>> getVisible(
            @PathVariable Long problemId
    ) {
        List<TestCaseResponse> response = testCaseService.getVisible(problemId);
        return ResponseEntity.ok(
                SuccessResponse.of(
                        "Visible test cases fetched successfully.",
                        response
                )
        );
    }

    /**
     * Update Test Case
     */
    @PutMapping("/testcases/{testCaseId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SuccessResponse<TestCaseResponse>> update(
            @PathVariable Long testCaseId,
            @Valid @RequestBody UpdateTestCaseRequest request
    ) {

        TestCaseResponse response =
                testCaseService.update(testCaseId, request);

        return ResponseEntity.ok(
                SuccessResponse.of(
                        "Test case updated successfully.",
                        response
                )
        );
    }

    /**
     * Delete Test Case
     */
    @DeleteMapping("/testcases/{testCaseId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SuccessResponse<Void>> delete(
            @PathVariable Long testCaseId
    ) {

        testCaseService.delete(testCaseId);

        return ResponseEntity.ok(
                SuccessResponse.of(
                        "Test case deleted successfully."
                )
        );
    }

}