import {
  getParticularEmail,
  getEmailDescription,
} from "../../reducers/EmailReducer";
import { useSelector, useDispatch } from "react-redux";
import { addFavoriteEmail } from "../../reducers/FavoriteEmailReducer";
import { useEffect, useState } from "react";
import { markEmailAsRead } from "../../reducers/AllEmailReducer";
import { addEmail } from "../../reducers/ReadEmailReducer";
import { getAllFavoriteEmails } from "../../reducers/FavoriteEmailReducer";

const Email = () => {
  const dispatch = useDispatch();
  const email = useSelector(getParticularEmail);
  const emailDescription = useSelector(getEmailDescription);
  const allFavoriteEmails = useSelector(getAllFavoriteEmails);
  const [changeText, setChangeText] = useState(false);

  useEffect(() => {
    if (email) {
      dispatch(markEmailAsRead(emailDescription.id));
      dispatch(addEmail(emailDescription));
    }
  }, [dispatch, email, emailDescription, emailDescription.id]);

  useEffect(() => {
    const emailExistAsFavoriteEmail = allFavoriteEmails.some(
      (email) => email.id === emailDescription.id
    );

    if (emailExistAsFavoriteEmail) {
      setChangeText(true);
    }
  }, [allFavoriteEmails, emailDescription.id]);

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

  const handleMarkAsFavorite = (obj) => {
    try {
      dispatch(addFavoriteEmail(obj));
      setChangeText(true);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm">
        <div className="flex items-center">
          <p className="bg-pink-500 rounded-full w-14 h-14 flex items-center justify-center text-white text-2xl font-bold">
            {emailDescription.name[0]}
          </p>
          <div className="flex flex-col ml-3">
            <p className="font-semibold text-xl text-gray-800">
              {emailDescription.subject}
            </p>
            <p className="text-sm text-gray-600">
              <EmailDateTime date={emailDescription.date} />
            </p>
          </div>
        </div>
        <div>
          <button
            className="bg-pink-500 text-white rounded-lg px-4 py-2 transition duration-200 hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-300"
            onClick={
              changeText
                ? () => {}
                : () => handleMarkAsFavorite(emailDescription)
            }
          >
            {changeText ? "Marked As Favorite" : "Mark as Favorite"}
          </button>
        </div>
      </div>
      <div className="p-4 bg-white text-gray-700">
        <div dangerouslySetInnerHTML={{ __html: email.body }} />
      </div>
    </div>
  );
};

export default Email;
