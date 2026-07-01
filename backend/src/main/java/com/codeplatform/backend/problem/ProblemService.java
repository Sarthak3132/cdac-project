package com.codeplatform.backend.problem;

import com.codeplatform.backend.exception.ConflictException;
import com.codeplatform.backend.exception.ProblemNotFound;
import com.codeplatform.backend.problem.dto.CreateProblemRequest;
import com.codeplatform.backend.problem.dto.ProblemFilter;
import com.codeplatform.backend.problem.dto.ProblemInfo;
import com.codeplatform.backend.problem.dto.UpdateProblemRequest;
import com.codeplatform.backend.security.UserContext;
import com.codeplatform.backend.user.UserEntity;
import com.codeplatform.backend.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProblemService {

    private final ProblemRepository problemRepository;
    private final UserRepository userRepository;
    private final ProblemMapper problemMapper;

    /**
     * Create Problem
     */
    public ProblemInfo createProblem(CreateProblemRequest request, UserContext userContext) {

        if (problemRepository.existsBySlug(request.getSlug())) {
            throw new ConflictException("Slug already exists.");
        }

        UserEntity author = userContext.userEntity();
        ProblemEntity problem = problemMapper.toEntity(request);
        problem.setAuthor(author);
        ProblemEntity savedProblem = problemRepository.save(problem);

        return problemMapper.toDto(savedProblem);
    }

    /**
     * Get Problem By Id
     */
    public ProblemInfo getProblemById(Long id) {

        ProblemEntity problem = problemRepository.findById(id)
                .orElseThrow(() ->
                        new ProblemNotFound("Problem not found with id: " + id));

        return problemMapper.toDto(problem);
    }

    /**
     * Update Problem
     */
    public ProblemInfo updateProblem(
            Long id,
            UpdateProblemRequest request
    ) {

        ProblemEntity problem = problemRepository.findById(id)
                .orElseThrow(() ->
                        new ProblemNotFound("Problem not found with id: " + id));

        problem.setTitle(request.getTitle());
        problem.setDescription(request.getDescription());
        problem.setProblemDifficulty(request.getProblemDifficulty());
        problem.setTimeLimitMs(request.getTimeLimitMs());
        problem.setMemoryLimitKb(request.getMemoryLimitKb());

        if (request.getIsPublished() != null) {
            problem.setIsPublished(request.getIsPublished());
        }

        ProblemEntity updatedProblem = problemRepository.save(problem);

        return problemMapper.toDto(updatedProblem);
    }

    /**
     * Delete Problem
     */
    public void deleteProblem(Long id) {

        ProblemEntity problem = problemRepository.findById(id)
                .orElseThrow(() ->
                        new ProblemNotFound("Problem not found with id: " + id));

        problemRepository.delete(problem);
    }

    public Page<ProblemInfo> getProblems(
            ProblemFilter filter,
            int page,
            int size
    ) {

        Pageable pageable = PageRequest.of(page, size);

        return problemRepository.findProblems(
                filter.getSearch(),
                filter.getProblemDifficulty(),
                pageable
        ).map(problemMapper::toDto);
    }
}