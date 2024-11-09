import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { useEffect, useRef, useState } from "react";
import LineChart from "../components/LineChart";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logOutUser } from "../reducers/userSlice";

ChartJS.register(
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale
);

const Chart = () => {
  const [sheetData, setSheetData] = useState([]);
  const [selectedFeature, setSelectedFeature] = useState("");
  const [ageFilter, setAgeFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const location = useLocation();
  const dispatch = useDispatch();

  const isInitialMount = useRef(true);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "https://docs.google.com/spreadsheets/d/1l7GstWHc69HPV0irSdvoMIyHgtufUPKsbtCiNw7IKR0/gviz/tq?tqx=out:csv"
      );
      const data = await response.text();
      const rows = data.split("\n");

      const headers = rows[0].replace(/"/g, "").split(",");
      const parsedData = rows.slice(1).map((row) => {
        const values = row.replace(/"/g, "").split(",");
        return headers.reduce((obj, header, index) => {
          obj[header] = values[index];
          return obj;
        }, {});
      });
      setSheetData(parsedData);
    };

    fetchData();
  }, []);

  const parseDate = (dateString) => {
    if (!dateString) return null;
    const [month, day, year] = dateString.split("/").map(Number);
    return new Date(year, month - 1, day);
  };

  const filterData = () => {
    return sheetData.filter((entry) => {
      const entryDate = entry.Day ? parseDate(entry.Day) : null;

      const withinAgeRange =
        ageFilter === "all" ||
        (ageFilter === "15-25" && entry.Age === "15-25") ||
        (ageFilter === ">25" && entry.Age === ">25");

      const withinGender =
        genderFilter === "all" || entry.Gender === genderFilter;

      const withinDateRange =
        (!startDate || (entryDate && entryDate >= new Date(startDate))) &&
        (!endDate || (entryDate && entryDate <= new Date(endDate)));

      return withinAgeRange && withinGender && withinDateRange;
    });
  };

  const aggregatedData = filterData().reduce((acc, entry) => {
    ["F", "E", "D", "C", "B", "A"].forEach((feature) => {
      acc[feature] = (acc[feature] || 0) + parseInt(entry[feature], 10);
    });
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(aggregatedData),
    datasets: [
      {
        label: "Total Time Spent",
        data: Object.values(aggregatedData),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
  };

  const options = {
    indexAxis: "y",
    responsive: true,
    scales: {
      x: {
        ticks: {
          callback: (value) => value / 1000,
        },
      },
    },
    plugins: {
      legend: {
        position: "right",
      },
      title: {
        display: true,
        text: "Horizontal Bar Chart",
      },
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const featureKey = chartData.labels[index];
        setSelectedFeature(featureKey);
      }
    },
  };

  const filteredData = filterData();

  useEffect(() => {
    const storedAge = localStorage.getItem("ageFilter");
    const storedGender = localStorage.getItem("genderFilter");
    const storedStartDate = localStorage.getItem("startDate");
    const storedEndDate = localStorage.getItem("endDate");

    if (storedAge) setAgeFilter(storedAge);
    if (storedGender) setGenderFilter(storedGender);
    if (storedStartDate) setStartDate(storedStartDate);
    if (storedEndDate) setEndDate(storedEndDate);
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      const params = new URLSearchParams(location.search);
      const age = params.get("age");
      const gender = params.get("gender");
      const start = params.get("start");
      const end = params.get("end");
      if (age) setAgeFilter(decodeURIComponent(age));
      if (gender) setGenderFilter(decodeURIComponent(gender));
      if (start) setStartDate(decodeURIComponent(start));
      if (end) setEndDate(decodeURIComponent(end));

      isInitialMount.current = false;
    }
  }, [location.search]);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("age", ageFilter);
    params.set("gender", genderFilter);
    params.set("start", startDate);
    params.set("end", endDate);
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${params}`
    );

    localStorage.setItem("ageFilter", ageFilter);
    localStorage.setItem("genderFilter", genderFilter);
    localStorage.setItem("startDate", startDate);
    localStorage.setItem("endDate", endDate);
  }, [ageFilter, genderFilter, startDate, endDate]);

  return (
    <>
      <div className="filters-container">
        <div className="filters">
          <label>
            Age:
            <select
              value={ageFilter}
              onChange={(e) => setAgeFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="15-25">15-25</option>
              <option value=">25">&gt;25</option>
            </select>
          </label>
          <label>
            Gender:
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </label>
          <label>
            Start Date:
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </label>
          <label>
            End Date:
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </label>
        </div>

        <div className="charts-container">
          <div className="chart">
            <Bar data={chartData} options={options} />
          </div>
          {selectedFeature && (
            <div className="chart">
              <h2>Feature Trend Line Chart</h2>
              <LineChart
                data={filteredData}
                selectedFeature={selectedFeature}
                startDate={startDate}
                endDate={endDate}
              />
            </div>
          )}
        </div>

        <div className="logout-container">
          <button className="logoutBtn" onClick={() => dispatch(logOutUser())}>
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Chart;
