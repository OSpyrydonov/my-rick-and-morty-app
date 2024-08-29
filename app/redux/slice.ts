import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface Character {
  id: number;
  name: string;
  image: string;
}

interface PageInfo {
  next?: string;
  prev?: string;
  current?: string;
}

interface CharactersState {
  results: Character[];
  pageInfo: PageInfo;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: CharactersState = {
  results: [],
  pageInfo: {
    next: "https://rickandmortyapi.com/api/character",
  },
  status: "idle",
  error: null,
};

export const fetchCharacters = createAsyncThunk(
  "characters/fetchCharacters",
  async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    return response.json();
  }
);

const charactersSlice = createSlice({
  name: "characters",
  initialState,
  reducers: {
    appendResults(state, action: PayloadAction<Character[]>) {
      state.results = [...state.results, ...action.payload];
    },
    setPageInfo(state, action: PayloadAction<PageInfo>) {
      state.pageInfo = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCharacters.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCharacters.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.results = [...state.results, ...action.payload.results];
        state.pageInfo.next = action.payload.info.next;
        state.pageInfo.prev = action.payload.info.prev;
      })
      .addCase(fetchCharacters.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export const { setPageInfo, appendResults } = charactersSlice.actions;
export default charactersSlice.reducer;
