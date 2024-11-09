import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  errorMessage: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
    logInUser: (state, action) => {
      const { userName, userEmail, password } = action.payload;
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      if (!userInfo) {
        state.errorMessage = "User does not exist Please SignIn";
        return;
      }

      if (
        userInfo.userName === userName &&
        userInfo.userEmail === userEmail &&
        userInfo.password === password
      ) {
        state.user = userInfo;
        state.errorMessage = "";
      } else {
        state.errorMessage = "Incorrect credentials. Please try again.";
      }
    },
    logOutUser: (state) => {
      state.user = null;
      state.errorMessage = "";
      localStorage.removeItem("userInfo");
    },
  },
});

export const getErrorMessage = (state) => state.user.errorMessage;
export const getUserInfo = (state) => state.user.user;

export const { signInUser, logInUser, logOutUser } = userSlice.actions;

export default userSlice.reducer;
