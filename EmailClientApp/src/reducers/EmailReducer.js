import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchEmail = createAsyncThunk("fetch/Email", async (id) => {
  const res = await axios.get(`${import.meta.env.VITE_EMAIL_URI}${id}`);
  return res.data;
});

export const EmailSlice = createSlice({
  name: "email",
  initialState: {
    email: "",
    emailDescription: {
      id: "",
      date: "",
      email: "",
      name: "",
      short_description: "",
      subject: "",
      read: "",
    },
  },
  reducers: {
    setEmailDescription: (state, action) => {
      const { id, name, subject, date, short_description, email } =
        action.payload;
      state.emailDescription.id = id;
      state.emailDescription.date = date;
      state.emailDescription.name = name;
      state.emailDescription.subject = subject;
      state.emailDescription.email = email;
      state.emailDescription.short_description = short_description;
      state.emailDescription.read = true;
    },
  },
  extraReducers: (builder) => {
    //* creating cases for fetching a particular email
    builder.addCase(fetchEmail.fulfilled, (state, action) => {
      state.email = action.payload;
      state.loading = false;
    });
  },
});

export const getParticularEmail = (state) => state.email.email;
export const getEmailDescription = (state) => state.email.emailDescription;

export const { setEmailDescription } = EmailSlice.actions;
export default EmailSlice.reducer;
