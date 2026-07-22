package com.codeplatform.backend.language;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Entity
@Table(name = "languages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LanguageEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private String version;

    @Column(name = "docker_image", nullable = false)
    private String dockerImage;

    @Column(name = "source_file", nullable = false)
    private String sourceFile;

    @Column(name = "compile_command", columnDefinition = "TEXT")
    private String compileCommand;

    @Column(name = "run_command", nullable = false, columnDefinition = "TEXT")
    private String runCommand;

    @Builder.Default
    @Column(name = "is_compiled", nullable = false)
    private Boolean isCompiled = true;

    @Builder.Default
    @Column(name = "enabled", nullable = false)
    private Boolean enabled = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}
