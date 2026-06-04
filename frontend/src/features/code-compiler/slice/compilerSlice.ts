import { type CompilerState } from "@/types/code-compiler";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
const initialState: CompilerState = {
  selectedLanguage: "javascript",
  codeByLanguage: {},
};

const compilerSlice = createSlice({
  name: "compiler",
  initialState,
  reducers: {
    setSelectedLanguage: (state, action: PayloadAction<string>) => {
      state.selectedLanguage = action.payload;
    },
    updateCode: (
      state,
      action: PayloadAction<{
        languageId: string;
        code: string;
      }>,
    ) => {
      state.codeByLanguage[action.payload.languageId] = action.payload.code;
    },
  },
});

export const { setSelectedLanguage, updateCode } = compilerSlice.actions;
export default compilerSlice.reducer;
