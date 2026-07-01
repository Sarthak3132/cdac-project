package com.codeplatform.backend.problem;

import com.codeplatform.backend.problem.dto.ProblemFilter;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

public final class ProblemSpecification {

    private ProblemSpecification() {
    }

    public static Specification<ProblemEntity> withFilters(
            ProblemFilter filter
    ) {

        return Specification.allOf(

                search(filter.getSearch()),

                difficulty(filter.getProblemDifficulty())

                // tag(filter.getTag()),

                // solved(filter.getSolved(), userId)

        );
    }

    private static Specification<ProblemEntity> search(
            String search
    ) {

        return (root, query, cb) -> {

            if (!StringUtils.hasText(search)) {
                return cb.conjunction();
            }

            String keyword = "%" + search.trim().toLowerCase() + "%";

            return cb.or(

                    cb.like(
                            cb.lower(root.get("title")),
                            keyword
                    ),

                    cb.like(
                            cb.lower(root.get("slug")),
                            keyword
                    )
            );
        };
    }

    private static Specification<ProblemEntity> difficulty(
            ProblemDifficulty difficulty
    ) {

        return (root, query, cb) -> {

            if (difficulty == null) {
                return cb.conjunction();
            }

            return cb.equal(
                    root.get("problemDifficulty"),
                    difficulty
            );
        };
    }

    /*
    private static Specification<ProblemEntity> tag(String tag) {

        return (root, query, cb) -> {

            if (!StringUtils.hasText(tag)) {
                return cb.conjunction();
            }

            Join<ProblemEntity, TagEntity> tagJoin = root.join("tags");

            return cb.equal(tagJoin.get("name"), tag);
        };
    }
    */

    /*
    private static Specification<ProblemEntity> solved(
            Boolean solved,
            Long userId
    ) {

        return (root, query, cb) -> {

            if (solved == null) {
                return cb.conjunction();
            }

            Subquery<Long> subQuery = query.subquery(Long.class);

            Root<SubmissionEntity> submission =
                    subQuery.from(SubmissionEntity.class);

            subQuery.select(submission.get("id"));

            subQuery.where(

                    cb.equal(
                            submission.get("problem"),
                            root
                    ),

                    cb.equal(
                            submission.get("user").get("id"),
                            userId
                    ),

                    cb.equal(
                            submission.get("status"),
                            SubmissionStatus.ACCEPTED
                    )
            );

            return solved
                    ? cb.exists(subQuery)
                    : cb.not(cb.exists(subQuery));
        };
    }
    */
}