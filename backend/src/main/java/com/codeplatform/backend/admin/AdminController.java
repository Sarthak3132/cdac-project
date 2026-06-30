package com.codeplatform.backend.admin;

import com.codeplatform.backend.common.SuccessResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {

    @GetMapping("/ping")
    public ResponseEntity<SuccessResponse<Void>> ping() {
        return ResponseEntity.ok(
                SuccessResponse.of("admin ping successful", null)
        );
    }
}