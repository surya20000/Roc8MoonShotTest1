import { createSlice } from "@reduxjs/toolkit";

export const FilterEmailSlice = createSlice({
  name: "filterEmails",
  initialState: {
    filterBy: "Unread",
  },
  reducers: {
    setFilterEmailBy: (state, action) => {
      state.filterBy = action.payload;
    },
  },
});

export const { setFilterEmailBy } = FilterEmailSlice.actions;
export const getFilterEmailsBy = (state) => state.filterEmails.filterBy;
export default FilterEmailSlice.reducer;
