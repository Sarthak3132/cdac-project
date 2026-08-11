package com.codeplatform.backend.language;

import com.codeplatform.backend.common.AppConstants;
import com.codeplatform.backend.common.SuccessResponse;
import com.codeplatform.backend.language.dto.CreateLanguageRequest;
import com.codeplatform.backend.language.dto.LanguageResponse;
import com.codeplatform.backend.language.dto.UpdateLanguageRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(AppConstants.LANGUAGE)
@RequiredArgsConstructor
public class LanguageController {

    private final LanguageService service;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SuccessResponse<LanguageResponse>> create(
            @Valid @RequestBody CreateLanguageRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(SuccessResponse.of(
                        "Language created successfully.",
                        service.create(request)
                ));
    }

    @GetMapping
    public ResponseEntity<SuccessResponse<List<LanguageResponse>>> getAll() {

        return ResponseEntity.ok(
                SuccessResponse.of(
                        "Languages fetched successfully.",
                        service.getAll()
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<SuccessResponse<LanguageResponse>> getById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                SuccessResponse.of(
                        "Language fetched successfully.",
                        service.getById(id)
                )
        );
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SuccessResponse<LanguageResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody UpdateLanguageRequest request) {

        return ResponseEntity.ok(
                SuccessResponse.of(
                        "Language updated successfully.",
                        service.update(id, request)
                )
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SuccessResponse<Void>> delete(
            @PathVariable Long id) {

        service.delete(id);

        return ResponseEntity.ok(
                SuccessResponse.of("Language deleted successfully.")
        );
    }
}