package com.codeplatform.backend.language;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LanguageRepository extends JpaRepository<LanguageEntity, Long> {

    boolean existsByNameIgnoreCase(String name);

    Optional<LanguageEntity> findByNameIgnoreCase(String name);

}