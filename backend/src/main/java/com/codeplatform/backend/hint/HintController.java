package com.codeplatform.backend.hint;

import com.codeplatform.backend.common.SuccessResponse;
import com.codeplatform.backend.hint.dto.CreateHintRequest;
import com.codeplatform.backend.hint.dto.HintResponse;
import com.codeplatform.backend.hint.dto.UpdateHintRequest;
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
public class HintController {

    private final HintService hintService;

    @PostMapping("/{problemId}/hints")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SuccessResponse<HintResponse>> create(
            @PathVariable Long problemId,
            @Valid @RequestBody CreateHintRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(SuccessResponse.of(
                        "Hint created successfully.",
                        hintService.create(problemId, request)
                ));
    }

    @GetMapping("/{problemId}/hints")
    public ResponseEntity<SuccessResponse<List<HintResponse>>> getAll(
            @PathVariable Long problemId) {

        return ResponseEntity.ok(
                SuccessResponse.of(
                        "Hints fetched successfully.",
                        hintService.getAll(problemId)
                )
        );
    }

    @PutMapping("/hints/{hintId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SuccessResponse<HintResponse>> update(
            @PathVariable Long hintId,
            @Valid @RequestBody UpdateHintRequest request) {

        return ResponseEntity.ok(
                SuccessResponse.of(
                        "Hint updated successfully.",
                        hintService.update(hintId, request)
                )
        );
    }

    @DeleteMapping("/hints/{hintId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SuccessResponse<Void>> delete(
            @PathVariable Long hintId) {

        hintService.delete(hintId);

        return ResponseEntity.ok(
                SuccessResponse.of("Hint deleted successfully.")
        );
    }
}