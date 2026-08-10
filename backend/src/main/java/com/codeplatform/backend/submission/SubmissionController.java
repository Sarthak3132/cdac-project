package com.codeplatform.backend.submission;

import com.codeplatform.backend.common.AppConstants;
import com.codeplatform.backend.submission.dto.SubmissionDetailDTO;
import com.codeplatform.backend.submission.dto.SubmissionListItemDTO;
import com.codeplatform.backend.user.UserEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(AppConstants.SUBMISSION)
public class SubmissionController {

    private final SubmissionService submissionService;

    @GetMapping("/problems/{problemId}")
    public List<SubmissionListItemDTO> getSubmissionsForProblem(
            @PathVariable Long problemId,
            @AuthenticationPrincipal UserEntity currentUser) {

        System.out.println("Fetching submissions for problem ID: " + problemId + " for user ID: " + currentUser.getId());
        return submissionService.getSubmissionsForProblem(currentUser.getId(), problemId);
    }

    @GetMapping("/{id}")
    public SubmissionDetailDTO getSubmissionDetail(
            @PathVariable Long id,
            @AuthenticationPrincipal UserEntity currentUser) {

        System.out.println("Fetching submission detail for submission ID: " + id + " for user ID: " + currentUser.getId());
        return submissionService.getSubmissionDetail(currentUser.getId(), id);
    }
}