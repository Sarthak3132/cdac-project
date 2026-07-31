package com.codeplatform.backend.codeexecution.dto;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

// CodeExecutionResultMessage.java — what the worker publishes back
@Getter
@Setter
public class CodeExecutionResultMessage implements Serializable{
        String sessionId;
        String stdout;
        String stderr;
        String compileOutput;
        String statusDescription;   // e.g. "Accepted", "Compilation Error", "Runtime Error"
        Double time;
        Integer memory;
}