package com.codeplatform.backend.submission;

import com.codeplatform.backend.submission.dto.LeaderboardEntryDTO;
import com.codeplatform.backend.submission.dto.SubmissionDetailDTO;
import com.codeplatform.backend.submission.dto.SubmissionListItemDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final SubmissionMapper submissionMapper;

    public List<SubmissionListItemDTO> getSubmissionsForProblem(Long userId, Long problemId) {
        return submissionRepository
                .findByUser_IdAndProblem_IdOrderBySubmittedAtDesc(userId, problemId)
                .stream()
                .map(submissionMapper::toListItem)
                .toList();
    }

    public SubmissionDetailDTO getSubmissionDetail(Long userId, Long submissionId) {
        SubmissionEntity submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new NoSuchElementException("Submission not found: " + submissionId));

        if (!submission.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("You do not have access to this submission");
        }

        return submissionMapper.toDetail(submission);
    }

    public List<LeaderboardEntryDTO> getLeaderboard(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        List<SubmissionRepository.LeaderboardProjection> rows = submissionRepository.findLeaderboard(pageable);

        List<LeaderboardEntryDTO> leaderboard = new ArrayList<>();
        int rank = 1;
        for (SubmissionRepository.LeaderboardProjection row : rows) {
            leaderboard.add(new LeaderboardEntryDTO(
                    rank,
                    row.getUserId(),
                    row.getUsername(),
                    row.getSolvedCount()
            ));
            rank++;
        }
        return leaderboard;
    }
}