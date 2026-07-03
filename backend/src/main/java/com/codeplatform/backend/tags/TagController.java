package com.codeplatform.backend.tags;

import com.codeplatform.backend.common.AppConstants;
import com.codeplatform.backend.common.SuccessResponse;
import com.codeplatform.backend.tags.dto.CreateTagRequest;
import com.codeplatform.backend.tags.dto.TagResponse;
import com.codeplatform.backend.tags.dto.UpdateTagRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(AppConstants.TAG)
@RequiredArgsConstructor
public class TagController {

    private final TagService service;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SuccessResponse<TagResponse>> create(
            @Valid @RequestBody CreateTagRequest request) {

        TagResponse response = service.create(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(SuccessResponse.of("Tag created successfully.", response));
    }

    @GetMapping
    public ResponseEntity<SuccessResponse<List<TagResponse>>> getAll() {

        List<TagResponse> response = service.getAll();

        return ResponseEntity.ok(
                SuccessResponse.of("Tags fetched successfully.", response)
        );
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SuccessResponse<TagResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTagRequest request) {

        TagResponse response = service.update(id, request);

        return ResponseEntity.ok(
                SuccessResponse.of("Tag updated successfully.", response)
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SuccessResponse<Void>> delete(
            @PathVariable Long id) {

        service.delete(id);

        return ResponseEntity.ok(
                SuccessResponse.of("Tag deleted successfully.")
        );
    }
}