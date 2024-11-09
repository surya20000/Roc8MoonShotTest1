import { configureStore } from "@reduxjs/toolkit";
import allEmailReducer from "./reducers/AllEmailReducer.js";
import emailReducer from "./reducers/EmailReducer.js";
import favoriteEmailReducer from "./reducers/FavoriteEmailReducer.js";
import filterEmailReducer from "./reducers/FilterEmailReducer.js";
import readEmailsReducer from "./reducers/ReadEmailReducer.js";

export default configureStore({
  reducer: {
    allEmails: allEmailReducer,
    email: emailReducer,
    favoriteEmails: favoriteEmailReducer,
    filterEmails: filterEmailReducer,
    readEmails: readEmailsReducer,
  },
});
