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
                        .version("17")
                        .dockerImage("openjdk:17-slim")
                        .sourceFile("Main.java")
                        .compileCommand("javac Main.java")
                        .runCommand("java Main")
                        .isCompiled(true)
                        .enabled(true)
                        .build(),
                LanguageEntity.builder()
                        .name("Python")
                        .version("3.11")
                        .dockerImage("python:3.11-slim")
                        .sourceFile("main.py")
                        .compileCommand(null)
                        .runCommand("python3 main.py")
                        .isCompiled(false)
                        .enabled(true)
                        .build(),
                LanguageEntity.builder()
                        .name("C++")
                        .version("17")
                        .dockerImage("gcc:13")
                        .sourceFile("main.cpp")
                        .compileCommand("g++ -O2 -std=c++17 -o main main.cpp")
                        .runCommand("./main")
                        .isCompiled(true)
                        .enabled(true)
                        .build(),
                LanguageEntity.builder()
                        .name("JavaScript")
                        .version("Node 20")
                        .dockerImage("node:20-slim")
                        .sourceFile("main.js")
                        .compileCommand(null)
                        .runCommand("node main.js")
                        .isCompiled(false)
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