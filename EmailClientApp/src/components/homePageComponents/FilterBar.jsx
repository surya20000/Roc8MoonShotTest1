import { useState } from "react";
import { useDispatch } from "react-redux";
import { setFilterEmailBy } from "../../reducers/FilterEmailReducer";

const FilterBar = () => {
  const [unreadButtonActive, setUnreadButtonActive] = useState(true);
  const [readButtonActive, setReadButtonActive] = useState(false);
  const [favoriteButtonActive, setFavoriteButtonActive] = useState(false);
  const dispatch = useDispatch();

  return (
    <navbar className="flex justify-between items-center max-w-96 py-2">
      <div className="font-semibold text-lg">Filter By:</div>
      <div className="flex space-x-4">
        <button
          onClick={() => {
            setUnreadButtonActive((prev) => !prev);
            dispatch(setFilterEmailBy("Unread"));
            setFavoriteButtonActive(false);
            setReadButtonActive(false);
          }}
          className={`${
            unreadButtonActive
              ? "bg-gray-300 text-gray-800"
              : "bg-white text-gray-600"
          } p-2 rounded-xl transition duration-200 ease-in-out transform hover:shadow-lg`}
        >
          Unread
        </button>
        <button
          onClick={() => {
            setReadButtonActive((prev) => !prev);
            dispatch(setFilterEmailBy("Read"));
            setUnreadButtonActive(false);
            setFavoriteButtonActive(false);
          }}
          className={`${
            readButtonActive
              ? "bg-gray-300 text-gray-800"
              : "bg-white text-gray-600"
          } p-2 rounded-xl transition duration-200 ease-in-out transform hover:shadow-lg`}
        >
          Read
        </button>
        <button
          onClick={() => {
            setFavoriteButtonActive((prev) => !prev);
            dispatch(setFilterEmailBy("Favorites"));
            setUnreadButtonActive(false);
            setReadButtonActive(false);
          }}
          className={`${
            favoriteButtonActive
              ? "bg-gray-300 text-gray-800"
              : "bg-white text-gray-600"
          } p-2 rounded-xl transition duration-200 ease-in-out transform hover:shadow-lg`}
        >
          Favorites
        </button>
      </div>
    </navbar>
  );
};

export default FilterBar;
