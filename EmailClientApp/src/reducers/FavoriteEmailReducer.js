import { createSlice } from "@reduxjs/toolkit";

export const FavoriteEmailSlice = createSlice({
  name: "favoriteEmails",
  initialState: {
    favoriteEmails: JSON.parse(localStorage.getItem("favoriteEmails")) || [],
  },
  reducers: {
    addFavoriteEmail: (state, action) => {
      const newEmail = action.payload;
      const exists = state.favoriteEmails.some(
        (email) => email.id === newEmail.id
      );

      if (!exists) {
        state.favoriteEmails.push(newEmail);
        localStorage.setItem(
          "favoriteEmails",
          JSON.stringify(state.favoriteEmails)
        );
      }
    },
  },
});

export const getAllFavoriteEmails = (state) =>
  state.favoriteEmails.favoriteEmails;
export const { addFavoriteEmail } = FavoriteEmailSlice.actions;
export default FavoriteEmailSlice.reducer;
