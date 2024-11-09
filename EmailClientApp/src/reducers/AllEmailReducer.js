import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchAllEmail = createAsyncThunk(
  "fetch/AllEmails",
  async (pageNumber) => {
    const res = await axios.get(
      `${import.meta.env.VITE_FETCH_ALL_EMAIL_URI}${pageNumber}`
    );
    return res.data.list.map((email) => ({
      ...email,
      read: false,
    }));
  }
);

export const allEmailsSlice = createSlice({
  name: "allEmails",
  initialState: {
    allUnreadEmails: [],
    error: null,
    loading: false,
  },
  reducers: {
    markEmailAsRead: (state, action) => {
      const emailId = action.payload;
      const email = state.allUnreadEmails.find((email) => email.id === emailId);
      if (email) {
        email.read = true;
      }

      state.allUnreadEmails = state.allUnreadEmails.filter(
        (email) => !email.read
      );
    },
    checkForAlreadyReadMails: (state, action) => {
      const allReadEmailsArray = action.payload;
      state.allUnreadEmails = state.allUnreadEmails.filter(
        (unreadEmail) =>
          !allReadEmailsArray.some(
            (readEmail) => String(readEmail.id) === String(unreadEmail.id)
          )
      );

      console.log("Updated allUnreadEmails:", state.allUnreadEmails);
    },
  },
  extraReducers: (builder) => {
    //* creating cases for fetching all the emails
    builder.addCase(fetchAllEmail.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchAllEmail.fulfilled, (state, action) => {
      state.allUnreadEmails = action.payload;
      state.error = null;
      state.loading = false;
    });
    builder.addCase(fetchAllEmail.rejected, (state, action) => {
      state.error = action.error.message;
      state.loading = false;
    });
  },
});

export const { markEmailAsRead, checkForAlreadyReadMails } =
  allEmailsSlice.actions;
export const getAllUnreadEmails = (state) => state.allEmails.allUnreadEmails;
export const getLoadingState = (state) => state.allEmails.loading;
export const getErrorMessage = (state) => state.allEmails.error;

export default allEmailsSlice.reducer;
