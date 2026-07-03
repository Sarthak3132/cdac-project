package com.codeplatform.backend.tags;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TagRepository extends JpaRepository<TagEntity, Long> {

    boolean existsByNameIgnoreCase(String name);

    List<TagEntity> findAllByOrderByNameAsc();
}
