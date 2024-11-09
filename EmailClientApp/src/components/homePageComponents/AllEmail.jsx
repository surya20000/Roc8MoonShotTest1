import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchAllEmail,
  getAllUnreadEmails,
  getErrorMessage,
  getLoadingState,
} from "../../reducers/AllEmailReducer";
import { checkForAlreadyReadMails } from "../../reducers/AllEmailReducer";
import { getFilterEmailsBy } from "../../reducers/FilterEmailReducer";
import { fetchEmail, setEmailDescription } from "../../reducers/EmailReducer";
import { getAllReadEmails } from "../../reducers/ReadEmailReducer";
import { getAllFavoriteEmails } from "../../reducers/FavoriteEmailReducer";
import Loader from "../common/Loader";
import Email from "./Email";

const AllEmail = () => {
  const dispatch = useDispatch();
  const allUnreadEmails = useSelector(getAllUnreadEmails);
  const allReadEmails = useSelector(getAllReadEmails);
  const allFavoriteEmails = useSelector(getAllFavoriteEmails);
  const filterEmailsBy = useSelector(getFilterEmailsBy);
  const error = useSelector(getErrorMessage);
  const loading = useSelector(getLoadingState);
  const [showNextPageButton, setShowNextPageButton] = useState(true);
  const [showEmailComponent, setShowEmailComponent] = useState(false);
  const hasRun = useRef(false);

  const EmailDateTime = ({ date }) => {
    const formatDateTime = (timestamp) => {
      if (!timestamp) return { formattedDate: "N/A", formattedTime: "N/A" };

      const date = new Date(timestamp);
      if (isNaN(date))
        return { formattedDate: "Invalid date", formattedTime: "" };

      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();

      let hours = date.getHours();
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const ampm = hours >= 12 ? "pm" : "am";
      hours = hours % 12;
      hours = hours ? String(hours).padStart(2, "0") : "12";

      const formattedDate = `${day}/${month}/${year}`;
      const formattedTime = `${hours}:${minutes}${ampm}`;

      return { formattedDate, formattedTime };
    };

    const { formattedDate, formattedTime } = formatDateTime(date);

    return (
      <p>
        <span>{formattedDate}</span> <span>{formattedTime}</span>
      </p>
    );
  };

  const handleNextPageClick = () => {
    setShowNextPageButton(false);
    dispatch(fetchAllEmail("2"));
  };

  const handlePreviousPageClick = () => {
    setShowNextPageButton(true);
    dispatch(fetchAllEmail("1"));
  };

  const handleGetEmail = ({
    id,
    name,
    subject,
    date,
    email,
    short_description,
    read,
  }) => {
    dispatch(fetchEmail(id));
    dispatch(
      setEmailDescription({
        id,
        name,
        subject,
        date,
        email,
        short_description,
        read,
      })
    );
    setShowEmailComponent((prev) => !prev);
  };

  useEffect(() => {
    dispatch(fetchAllEmail("1"));
  }, [dispatch]);

  useEffect(() => {
    if (
      !hasRun.current &&
      allUnreadEmails.length > 0 &&
      allReadEmails.length > 0
    ) {
      dispatch(checkForAlreadyReadMails(allReadEmails));
      hasRun.current = true;
    }
  }, [allReadEmails, allUnreadEmails, dispatch]);

  return (
    <div>
      {/* //* handling the loading state */}
      {loading ? (
        <div>
          <Loader />
        </div>
      ) : (
        ""
      )}
      <div className="flex w-full">
        <div
          className={`${
            showEmailComponent
              ? "overflow-y-auto max-h-[calc(100vh-2rem)]"
              : "w-full"
          }`}
        >
          {filterEmailsBy === "Unread" && allUnreadEmails.length > 0 ? (
            allUnreadEmails.map((email) => {
              return (
                <div
                  className="flex p-4 text-sm hover:cursor-pointer bg-white rounded-lg mb-4 max-w-full shadow-sm transition-transform duration-200 transform"
                  key={email.id}
                  onClick={() =>
                    handleGetEmail({
                      id: email.id,
                      name: email.from.name,
                      subject: email.subject,
                      date: email.date,
                      email: email.from.email,
                      short_description: email.short_description,
                      read: email.read,
                    })
                  }
                >
                  <div className="flex items-start">
                    <div>
                      <p className="bg-pink-500 rounded-full w-10 h-10 flex items-center justify-center text-white font-semibold text-lg">
                        {email.from.name[0]}
                      </p>
                    </div>
                    <div className="ml-3">
                      <p className="text-gray-700 font-bold">
                        From:{" "}
                        <span className="text-gray-900 font-bold">
                          {email.from.name} &lt;{email.from.email}&gt;
                        </span>
                      </p>
                      <p className="text-gray-800 font-medium">
                        Subject:{" "}
                        <span className="text-gray-900">{email.subject}</span>
                      </p>
                      <p className="text-gray-600 p-1">
                        {email.short_description}
                      </p>
                      <EmailDateTime date={email.date} />
                    </div>
                  </div>
                </div>
              );
            })
          ) : filterEmailsBy === "Read" && allReadEmails.length > 0 ? (
            allReadEmails.map((email) => {
              const isFavorite = allFavoriteEmails.some(
                (favoriteEmail) => favoriteEmail.id === email.id
              );
              return (
                <div
                  className="flex p-4 text-sm hover:cursor-pointer bg-white rounded-lg mb-4 max-w-full shadow-sm transition-transform duration-200 transform"
                  key={email.id}
                  onClick={() =>
                    handleGetEmail({
                      id: email.id,
                      name: email.name,
                      subject: email.subject,
                      date: email.date,
                      email: email.email,
                      short_description: email.short_description,
                      read: email.read,
                    })
                  }
                >
                  <div className="flex items-start">
                    <div>
                      <p className="bg-pink-500 rounded-full w-10 h-10 flex items-center justify-center text-white font-semibold text-lg">
                        {email.name[0]}
                      </p>
                    </div>
                    <div className="ml-3">
                      <p>
                        From:{" "}
                        <span className="text-gray-700 font-medium">
                          {" "}
                          {email.name} &lt;{email.email}&gt;{" "}
                        </span>
                      </p>
                      <p>
                        Subject:
                        <span className="text-gray-900 font-medium ml-1">
                          {email.subject}
                        </span>
                      </p>
                      <p className="text-gray-600 p-1">
                        {email.short_description}
                      </p>
                      <div className="flex items-center">
                        <EmailDateTime date={email.date} />
                        <span className="ml-2">
                          {isFavorite && (
                            <span className="text-pink-500 text-base font-semibold">
                              {" "}
                              Favorite
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : filterEmailsBy === "Favorites" && allFavoriteEmails.length > 0 ? (
            allFavoriteEmails.map((email) => {
              const isFavorite = allFavoriteEmails.some(
                (favoriteEmail) => favoriteEmail.id === email.id
              );
              return (
                <div
                  className="flex p-4 text-sm hover:cursor-pointer bg-white rounded-lg mb-4 max-w-full shadow-sm transition-transform duration-200 transform"
                  key={email.id}
                  onClick={() =>
                    handleGetEmail({
                      id: email.id,
                      name: email.name,
                      subject: email.subject,
                      date: email.date,
                      email: email.email,
                      short_description: email.short_description,
                      read: email.read,
                    })
                  }
                >
                  <div className="flex items-start">
                    <div>
                      <p className="bg-pink-500 rounded-full w-10 h-10 flex items-center justify-center text-white font-semibold text-lg">
                        {email.name[0]}
                      </p>
                    </div>
                    <div className="ml-3">
                      <p>
                        From:{" "}
                        <span className="text-gray-900 font-medium">
                          {" "}
                          {email.name} &lt;{email.email}&gt;{" "}
                        </span>
                      </p>
                      <p>
                        Subject:
                        <span className="text-gray-900 font-medium ml-1">
                          {email.subject}
                        </span>
                      </p>
                      <p className="text-gray-600 p-1">
                        {email.short_description}
                      </p>
                      <div className="flex items-center">
                        <EmailDateTime date={email.date} />
                        <span className="ml-2">
                          {isFavorite && (
                            <span className="text-pink-500 text-base font-semibold">
                              {" "}
                              Favorite
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <h1 className="font-semibold text-center"> No Mails to Show!!!</h1>
          )}
          {showNextPageButton ? (
            <div className="flex justify-end p-4">
              <button
                className="bg-pink-500 text-white p-1 rounded-md"
                onClick={handleNextPageClick}
              >
                Next Page
              </button>
            </div>
          ) : (
            <div className="flex justify-start p-4">
              <button
                className="bg-pink-500 text-white p-1 rounded-md"
                onClick={handlePreviousPageClick}
              >
                Previous Page
              </button>
            </div>
          )}
        </div>

        {showEmailComponent ? (
          <div className="w-fit h-fit p-4 ml-6 rounded-lg bg-white">
            {" "}
            <Email />{" "}
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default AllEmail;
