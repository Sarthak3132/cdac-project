package com.codeplatform.backend.seed;

import com.codeplatform.backend.language.LanguageEntity;
import com.codeplatform.backend.language.LanguageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Profile("dev")
@Slf4j
@Order(6)
public class LanguageSeeder implements CommandLineRunner {

    private final LanguageRepository languageRepository;

    @Override
    public void run(String... args) {

        List<LanguageEntity> languages = List.of(

                LanguageEntity.builder()
                        .name("Java")
                        .version("OpenJDK 21")
                        .judge0LanguageId(91)
                        .enabled(true)
                        .build(),

                LanguageEntity.builder()
                        .name("Python")
                        .version("3.12.0")
                        .judge0LanguageId(102)
                        .enabled(true)
                        .build(),

                LanguageEntity.builder()
                        .name("C++")
                        .version("GCC 14.1.0")
                        .judge0LanguageId(105)
                        .enabled(true)
                        .build(),

                LanguageEntity.builder()
                        .name("JavaScript")
                        .version("Node.js 22.08.0")
                        .judge0LanguageId(93)
                        .enabled(true)
                        .build()
        );

        for (LanguageEntity language : languages) {

            if (languageRepository.existsByNameIgnoreCase(language.getName())) {
                continue;
            }

            languageRepository.save(language);
        }

        log.info("Languages seeded successfully.");
    }
}