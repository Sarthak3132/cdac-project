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
                        .shortName("java")
                        .fileExtension(".java")
                        .version("OpenJDK 21")
                        .judge0LanguageId(91)
                        .enabled(true)
                        .build(),

                LanguageEntity.builder()
                        .name("Python")
                        .shortName("py")
                        .fileExtension(".py")
                        .version("3.12.0")
                        .judge0LanguageId(102)
                        .enabled(true)
                        .build(),

                LanguageEntity.builder()
                        .name("Cpp")
                        .shortName("cpp")
                        .fileExtension(".cpp")
                        .version("GCC 14.1.0")
                        .judge0LanguageId(105)
                        .enabled(true)
                        .build(),

                LanguageEntity.builder()
                        .name("JavaScript")
                        .shortName("js")
                        .fileExtension(".js")
                        .version("Node.js 22.8.0")
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