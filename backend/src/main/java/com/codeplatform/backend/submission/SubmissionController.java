package com.codeplatform.backend.submission;
import com.codeplatform.backend.common.AppConstants;
import com.codeplatform.backend.submission.dto.LeaderboardEntryDTO;
import com.codeplatform.backend.submission.dto.SubmissionDetailDTO;
import com.codeplatform.backend.submission.dto.SubmissionListItemDTO;
import com.codeplatform.backend.user.UserEntity;
import com.codeplatform.backend.security.UserContext;
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
            @AuthenticationPrincipal UserContext user) {
        System.out.println("Fetching submissions for problem ID: " + problemId + " for user ID: " + user.getId());
        return submissionService.getSubmissionsForProblem(user.getId(), problemId);
    }
    @GetMapping("/{id}")
    public SubmissionDetailDTO getSubmissionDetail(
            @PathVariable Long id,
            @AuthenticationPrincipal UserContext user) {
        System.out.println("Fetching submission detail for submission ID: " + id + " for user ID: " + user.getId());
        return submissionService.getSubmissionDetail(user.getId(), id);
    }
    @GetMapping("/leaderboard")
    public List<LeaderboardEntryDTO> getLeaderboard(
            @RequestParam(defaultValue = "50") int limit) {
        return submissionService.getLeaderboard(limit);
    }
}