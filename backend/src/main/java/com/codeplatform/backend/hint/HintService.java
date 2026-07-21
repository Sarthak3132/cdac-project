package com.codeplatform.backend.hint;

import com.codeplatform.backend.exception.ProblemNotFound;
import com.codeplatform.backend.problem.ProblemEntity;
import com.codeplatform.backend.problem.ProblemRepository;
import com.codeplatform.backend.hint.dto.CreateHintRequest;
import com.codeplatform.backend.hint.dto.HintResponse;
import com.codeplatform.backend.hint.dto.UpdateHintRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class HintService {

    private final HintRepository hintRepository;
    private final ProblemRepository problemRepository;
    private final HintMapper hintMapper;

    public HintResponse create(Long problemId, CreateHintRequest request) {

        ProblemEntity problem = problemRepository.findById(problemId)
                .orElseThrow(() ->
                        new ProblemNotFound("Problem not found with id : " + problemId));

        HintEntity hint = hintMapper.toEntity(request);
        hint.setProblem(problem);

        return hintMapper.toDto(hintRepository.save(hint));
    }

    @Transactional(readOnly = true)
    public List<HintResponse> getAll(Long problemId) {

        if (!problemRepository.existsById(problemId)) {
            throw new ProblemNotFound("Problem not found with id : " + problemId);
        }

        return hintRepository.findByProblemIdOrderByDisplayOrderAsc(problemId)
                .stream()
                .map(hintMapper::toDto)
                .toList();
    }

    public HintResponse update(Long hintId, UpdateHintRequest request) {

        HintEntity hint = hintRepository.findById(hintId)
                .orElseThrow(() -> new RuntimeException("Hint not found."));

        hint.setContent(request.getContent());
        hint.setDisplayOrder(request.getDisplayOrder());

        return hintMapper.toDto(hintRepository.save(hint));
    }

    public void delete(Long hintId) {

        HintEntity hint = hintRepository.findById(hintId)
                .orElseThrow(() -> new RuntimeException("Hint not found."));

        hintRepository.delete(hint);
    }

}