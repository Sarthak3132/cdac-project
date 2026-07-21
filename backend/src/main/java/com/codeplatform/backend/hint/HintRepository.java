package com.codeplatform.backend.hint;


import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HintRepository extends JpaRepository<HintEntity, Long> {

    List<HintEntity> findByProblemIdOrderByDisplayOrderAsc(Long problemId);

}
