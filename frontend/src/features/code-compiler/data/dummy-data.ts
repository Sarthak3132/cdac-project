import type { Language } from "@/types/code-compiler";

export const LANGUAGES: Language[] = [
  {
    id: "cpp",
    label: "C++",
    monacoId: "cpp",
    defaultCode: `#include <iostream>\n\nint main() {\n    std::cout << "Start small. Ship something.";\n    return 0;\n}`,
  },
  {
    id: "js",
    label: "JS",
    monacoId: "javascript",
    defaultCode: `console.log("Start small. Ship something.");`,
  },
  {
    id: "ts",
    label: "TS",
    monacoId: "typescript",
    defaultCode: `const msg: string = "Start small. Ship something.";\nconsole.log(msg);`,
  },
  {
    id: "python",
    label: "PY",
    monacoId: "python",
    defaultCode: `print("Start small. Ship something.")`,
  },
];
