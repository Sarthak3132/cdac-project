package com.codeplatform.backend.problem;

import com.codeplatform.backend.exception.ConflictException;
import com.codeplatform.backend.exception.ProblemNotFound;
import com.codeplatform.backend.problem.dto.*;
import com.codeplatform.backend.security.UserContext;
import com.codeplatform.backend.tags.TagEntity;
import com.codeplatform.backend.tags.TagRepository;
import com.codeplatform.backend.user.UserEntity;
import com.codeplatform.backend.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProblemService {

    private final ProblemRepository problemRepository;
    private final ProblemMapper problemMapper;
    private final TagRepository tagRepository;

    /**
     * Create Problem
     */
    public ProblemSummary createProblem(CreateProblemRequest request, UserContext userContext) {

        if (problemRepository.existsBySlug(request.getSlug())) {
            throw new ConflictException("Slug already exists.");
        }

        UserEntity author = userContext.userEntity();
        ProblemEntity problem = problemMapper.toEntity(request);

        Set<TagEntity> tags = new HashSet<>(
                tagRepository.findAllById(request.getTagIds())
        );

        if (tags.size() != request.getTagIds().size()) {
            throw new ProblemNotFound("One or more tags not found.");
        }

        problem.setTags(tags);
        problem.setAuthor(author);
        ProblemEntity savedProblem = problemRepository.save(problem);




        return problemMapper.toDto(savedProblem);
    }

    /**
     * Get Problem By Id
     */
    public ProblemDetails getProblemById(Long id) {

        ProblemEntity problem = problemRepository.findById(id)
                .orElseThrow(() ->
                        new ProblemNotFound("Problem not found with id: " + id));

        return problemMapper.toDetailsDto(problem);
    }

    /**
     * Update Problem
     */
    public ProblemSummary updateProblem(
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

        if (request.getTagIds() != null) {

            Set<TagEntity> tags = new HashSet<>(
                    tagRepository.findAllById(request.getTagIds())
            );

            if (tags.size() != request.getTagIds().size()) {
                throw new ProblemNotFound("One or more tags not found.");
            }
            problem.setTags(tags);
        }

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

    public Page<ProblemSummary> getProblems(
            ProblemFilter filter,
            int page,
            int size
    ) {

        Pageable pageable = PageRequest.of(page, size);

        return problemRepository
                .findAll(
                        ProblemSpecification.withFilters(filter),
                        pageable
                )
                .map(problemMapper::toDto);
    }
}