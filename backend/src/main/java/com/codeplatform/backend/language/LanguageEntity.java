package com.codeplatform.backend.language;

import jakarta.persistence.*;
import lombok.*;

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

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(nullable = false, unique = true)
    private String shortName;

    @Column(nullable = false)
    private String fileExtension;

    @Column(nullable = false, length = 50)
    private String version;

    @Column(name = "judge0_language_id", nullable = false, unique = true)
    private Integer judge0LanguageId;

    @Builder.Default
    @Column(nullable = false)
    private Boolean enabled = true;

    public boolean isEnabled() {
        return  enabled;
    }
}