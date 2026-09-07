import { createSlice } from "@reduxjs/toolkit";

const searchSlice = createSlice({
  name: "search",
  initialState: {
    query: "",
    activeTab: "photos",
    page: 1,
    results: [],
    loading: false,
    error: null,
  },
  reducers: {
    setQuery(state, action) {
      state.query = action.payload;
      state.page = 1;
    },
    setActiveTabs(state, action) {
      state.activeTab = action.payload;
      state.page = 1;
    },
    setPage(state, action) {
      state.page = action.payload;
    },
    setResults(state, action) {
      state.results = action.payload;
      state.loading = false;
    },
    setLoading(state, action) {
      ((state.loading = true), (state.error = null));
    },
    setError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    clearResults(state) {
      state.results = [];
    },
    resetSearch(state) {
      state.query = "";
      state.activeTab = "photos";
      state.page = 1;
      state.results = [];
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setQuery,
  setActiveTabs,
  setPage,
  setError,
  setLoading,
  setResults,
  clearResults,
  resetSearch,
} = searchSlice.actions;

export default searchSlice.reducer;
