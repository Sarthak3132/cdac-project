package com.codeplatform.backend.testcase;

import com.codeplatform.backend.exception.ProblemNotFound;
import com.codeplatform.backend.exception.TestCaseNotFound;
import com.codeplatform.backend.problem.ProblemEntity;
import com.codeplatform.backend.problem.ProblemRepository;
import com.codeplatform.backend.testcase.dto.CreateTestCaseRequest;
import com.codeplatform.backend.testcase.dto.TestCaseResponse;
import com.codeplatform.backend.testcase.dto.UpdateTestCaseRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class TestCaseService {

    private final TestCaseRepository testCaseRepository;
    private final ProblemRepository problemRepository;
    private final TestCaseMapper testCaseMapper;

    /**
     * Create Test Case
     */
    public TestCaseResponse create(
            Long problemId,
            CreateTestCaseRequest request
    ) {

        ProblemEntity problem = problemRepository.findById(problemId)
                .orElseThrow(() ->
                        new ProblemNotFound("Problem not found with id : " + problemId));

        TestCaseEntity testCase = testCaseMapper.toEntity(request);
        testCase.setProblem(problem);

        TestCaseEntity saved = testCaseRepository.save(testCase);

        return testCaseMapper.toDto(saved);
    }

    /**
     * Get All Test Cases Of A Problem
     */
    @Transactional(readOnly = true)
    public List<TestCaseResponse> getAll(Long problemId) {

        if (!problemRepository.existsById(problemId)) {
            throw new ProblemNotFound("Problem not found with id : " + problemId);
        }

        return testCaseRepository.findByProblemId(problemId)
                .stream()
                .map(testCaseMapper::toDto)
                .toList();
    }

    /**
     * Update Test Case
     */
    public TestCaseResponse update(
            Long testCaseId,
            UpdateTestCaseRequest request
    ) {

        TestCaseEntity testCase = testCaseRepository.findById(testCaseId)
                .orElseThrow(() ->
                        new TestCaseNotFound("Test case not found."));

        testCase.setInputData(request.getInputData());
        testCase.setExpectedOutput(request.getExpectedOutput());

        TestCaseEntity updated = testCaseRepository.save(testCase);

        return testCaseMapper.toDto(updated);
    }

    /**
     * Delete Test Case
     */
    public void delete(Long testCaseId) {

        TestCaseEntity testCase = testCaseRepository.findById(testCaseId)
                .orElseThrow(() ->
                        new RuntimeException("Test case not found."));

        testCaseRepository.delete(testCase);
    }

}
