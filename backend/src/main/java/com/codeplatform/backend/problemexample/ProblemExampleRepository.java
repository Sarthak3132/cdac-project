package com.codeplatform.backend.problemexample;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface ProblemExampleRepository extends JpaRepository<ProblemExampleEntity, Long> {

    List<ProblemExampleEntity> findByProblemIdOrderByDisplayOrderAsc(Long problemId);

}