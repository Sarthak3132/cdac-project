package com.codeplatform.backend.problem.dto;

import com.codeplatform.backend.problem.ProblemDifficulty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProblemFilter {

        private String search;

        private ProblemDifficulty problemDifficulty;

        //  Uncomment when Tag module is implemented
        // private String tag;

        // Uncomment when Submission module is implemented
        // private Boolean solved;
}