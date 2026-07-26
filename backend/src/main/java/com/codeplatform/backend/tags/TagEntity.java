package com.codeplatform.backend.tags;


import com.codeplatform.backend.problem.ProblemEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "tags")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TagEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false,unique=true)
    private String name;

    @ManyToMany(mappedBy = "tags")
    private Set<ProblemEntity> problems = new HashSet<>();

}