package com.codeplatform.backend.problemexample;

import com.codeplatform.backend.exception.ProblemNotFound;
import com.codeplatform.backend.problem.ProblemEntity;
import com.codeplatform.backend.problem.ProblemRepository;
import com.codeplatform.backend.problemexample.dto.CreateProblemExampleRequest;
import com.codeplatform.backend.problemexample.dto.ProblemExampleResponse;
import com.codeplatform.backend.problemexample.dto.UpdateProblemExampleRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ProblemExampleService {

    private final ProblemRepository problemRepository;
    private final ProblemExampleRepository repository;
    private final ProblemExampleMapper mapper;

    /**
     * Create Example
     */
    public ProblemExampleResponse create(
            Long problemId,
            CreateProblemExampleRequest request
    ) {

        ProblemEntity problem = problemRepository.findById(problemId)
                .orElseThrow(() ->
                        new ProblemNotFound("Problem not found with id : " + problemId));

        ProblemExampleEntity example = mapper.toEntity(request);
        example.setProblem(problem);

        ProblemExampleEntity saved = repository.save(example);

        return mapper.toDto(saved);
    }

    /**
     * Get All Examples Of Problem
     */
    @Transactional(readOnly = true)
    public List<ProblemExampleResponse> getAll(Long problemId) {

        if (!problemRepository.existsById(problemId)) {
            throw new ProblemNotFound("Problem not found with id : " + problemId);
        }

        return repository.findByProblemIdOrderByDisplayOrderAsc(problemId)
                .stream()
                .map(mapper::toDto)
                .toList();
    }

    /**
     * Update Example
     */
    public ProblemExampleResponse update(
            Long exampleId,
            UpdateProblemExampleRequest request
    ) {

        ProblemExampleEntity example = repository.findById(exampleId)
                .orElseThrow(() ->
                        new RuntimeException("Problem example not found."));

        example.setInputData(request.getInputData());
        example.setOutputData(request.getOutputData());
        example.setExplanation(request.getExplanation());
        example.setDisplayOrder(request.getDisplayOrder());

        return mapper.toDto(repository.save(example));
    }

    /**
     * Delete Example
     */
    public void delete(Long exampleId) {

        ProblemExampleEntity example = repository.findById(exampleId)
                .orElseThrow(() ->
                        new RuntimeException("Problem example not found."));

        repository.delete(example);
    }

}