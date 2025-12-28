import { useState, type FormEvent } from "react";
import { useSearchContext } from "../context/SearchContext";
import { Earth, Search } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router";

const SearchBar = () => {
  const navigate = useNavigate();
  const search = useSearchContext();

  const [destination, setDestination] = useState<string>(search.destination);
  const [checkIn, setCheckIn] = useState<Date>(search.checkIn);
  const [checkOut, setCheckOut] = useState<Date>(search.checkOut);
  const [adultCount, setAdultCount] = useState<number>(search.adultCount);
  const [childCount, setChildCount] = useState<number>(search.childCount);

  const minDate = new Date();
  const maxDate = new Date();

  maxDate.setFullYear(maxDate.getFullYear() + 1);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    search.saveSearchValues(
      destination,
      checkIn,
      checkOut,
      adultCount,
      childCount
    );

    navigate("/search");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="-mt-8 p-3 bg-orange-400 rounded shadow-md grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 items-center gap-4"
    >
      <div className="flex flex-row items-center flex-1 bg-white p-2">
        <Earth size={25} className="mr-2" />
        <input
          type="text"
          placeholder="Where are you going"
          className="text-md w-full focus:outline-none"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
      </div>
      <div className="flex bg-white px-2 py-1 gap-2">
        <label className="flex items-center">
          Adults:
          <input
            type="number"
            min={1}
            max={20}
            className="w-full p-1 focus:outline-none font-bold"
            value={adultCount}
            onChange={(e) => setAdultCount(parseInt(e.target.value))}
          />
        </label>
        <label className="flex items-center">
          Children:
          <input
            type="number"
            min={0}
            max={20}
            className="w-full p-1 focus:outline-none font-bold"
            value={childCount}
            onChange={(e) => setChildCount(parseInt(e.target.value))}
          />
        </label>
      </div>
      <div>
        <DatePicker
          selected={checkIn}
          onChange={(date: Date | null) => setCheckIn(date!)}
          startDate={checkIn}
          endDate={checkOut}
          minDate={minDate}
          maxDate={maxDate}
          selectsStart
          placeholderText="Check-in Date"
          className="min-w-full bg-white p-2 focus:outline-none cursor-pointer"
          wrapperClassName="min-w-full"
        />
      </div>
      <div>
        <DatePicker
          selected={checkOut}
          onChange={(date: Date | null) => setCheckOut(date!)}
          startDate={checkIn}
          endDate={checkOut}
          minDate={minDate}
          maxDate={maxDate}
          selectsStart
          placeholderText="Check-Out Date"
          className="min-w-full bg-white p-2 focus:outline-none cursor-pointer"
          wrapperClassName="min-w-full"
        />
      </div>
      <div className="flex gap-2">
        <button className="flex items-center justify-center gap-x-1 w-2/3 bg-blue-600 text-white h-full p-2 font-bold text-xl hover:bg-blue-500 cursor-pointer">
          <Search width={24} />
          Search
        </button>
        <button className="flex items-center justify-center gap-x-1 w-1/3 bg-red-600 text-white h-full p-2 font-bold text-xl hover:bg-red-500 cursor-pointer">
          Clear
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
