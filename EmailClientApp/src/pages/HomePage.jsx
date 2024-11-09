import AllEmail from "../components/homePageComponents/AllEmail";
import FilterBar from "../components/homePageComponents/FilterBar";

const HomePage = () => {
  return (
    <div className="bg-gray-200 p-2">
      <FilterBar />
      <AllEmail />
    </div>
  );
};

export default HomePage;
