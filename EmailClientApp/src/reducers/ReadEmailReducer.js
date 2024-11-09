import { createSlice } from "@reduxjs/toolkit";

export const ReadEmailSlice = createSlice({
  name: "readEmails",
  initialState: {
    readEmails: JSON.parse(localStorage.getItem("readEmails")) || [],
  },
  reducers: {
    addEmail: (state, action) => {
      const newReadEmail = action.payload;
      const exists = state.readEmails.some(
        (email) => email.id === newReadEmail.id
      );
      if (!exists) {
        state.readEmails.push(action.payload);
        localStorage.setItem("readEmails", JSON.stringify(state.readEmails));
      }
    },
  },
});

export const { addEmail } = ReadEmailSlice.actions;
export const getAllReadEmails = (state) => state.readEmails.readEmails;
export default ReadEmailSlice.reducer;
