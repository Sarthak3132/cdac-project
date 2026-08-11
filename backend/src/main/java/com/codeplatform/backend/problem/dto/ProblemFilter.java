package com.codeplatform.backend.problem.dto;

import com.codeplatform.backend.problem.ProblemDifficulty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProblemFilter {

        private String search;

        private ProblemDifficulty problemDifficulty;

        private String tag;

        private Boolean solved;
}