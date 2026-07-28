package com.codeplatform.backend.user;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.awt.print.Pageable;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, Long> {

//    Pageable pageble = PageRequest.of(10, 10, Sort.by("name"))
    Optional<UserEntity> findByEmail(String email);
//    List<UserEntity> findByStartingWith(String name)
    boolean existsByEmail(String email);

    Optional<UserEntity> findByUsername(String username);

}
