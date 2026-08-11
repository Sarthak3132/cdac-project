package com.codeplatform.backend.seed;

import com.codeplatform.backend.tags.TagEntity;
import com.codeplatform.backend.tags.TagRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Profile("prod")
@Slf4j
@Order(2)
public class TagSeeder implements CommandLineRunner {

    private final TagRepository tagRepository;

    @Override
    public void run(String... args) {
        List<String> tags = List.of(
                "Array",
                "String",
                "Hash Table",
                "Dynamic Programming",
                "Math",
                "Sorting",
                "Greedy",
                "Two Pointers",
                "Binary Search",
                "Stack"
        );

        for (String tagName : tags) {
            if (tagRepository.existsByNameIgnoreCase(tagName)) {
                continue;
            }
            TagEntity tag = TagEntity.builder()
                    .name(tagName)
                    .build();
            tagRepository.save(tag);
        }

        log.info("Tags seeded successfully.");
    }
}