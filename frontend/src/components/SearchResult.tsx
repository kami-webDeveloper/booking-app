import { StarIcon } from "lucide-react";
import { Link } from "react-router";

type Hotel = {
  _id: string;
  name: string;
  city: string;
  country: string;
  description: string;
  type: string;
  adultCount: number;
  childCount: number;
  facilities: string[];
  pricePerNight: number;
  starRating: number;
  images: { url: string; _id: string }[];
};

type Props = {
  hotel: Hotel;
};

const SearchResult = ({ hotel }: Props) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-[2fr_3fr] border border-slate-300 rounded-lg p-6 gap-6">
      <div className="w-full h-[300px]">
        <img
          src={hotel?.images?.[0]?.url}
          className="w-full h-full object-cover object-center rounded-lg"
        />
      </div>

      <div className="flex flex-col gap-4 h-full">
        <div>
          <div className="flex items-center">
            <span className="flex">
              {Array.from({ length: hotel.starRating }).map((_, i) => (
                <StarIcon key={i} className="fill-yellow-400" width={20} />
              ))}
            </span>
            <span className="ml-1 text-sm">{hotel.type}</span>
          </div>
          <Link
            to={`/detail/${hotel._id}`}
            className="text-xl font-bold cursor-pointer"
          >
            {hotel.name}
          </Link>
        </div>

        <div className="line-clamp-4">{hotel.description}</div>

        <div className="mt-auto flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="flex flex-wrap gap-2">
            {hotel.facilities.slice(0, 3).map((facility) => (
              <span
                key={facility}
                className="bg-slate-300 px-3 py-1 rounded-lg font-bold text-xs"
              >
                {facility}
              </span>
            ))}
            {hotel.facilities.length > 3 && (
              <span className="text-sm">
                +{hotel.facilities.length - 3} more
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2 w-full xl:w-auto">
            <span className="font-bold text-right text-xl xl:text-left flex items-center gap-x-2 px-2">
              ${hotel.pricePerNight}{" "}
              <p className="text-lg font-semibold text-nowrap">Per Night</p>
            </span>
            <Link
              to={`/detail/${hotel._id}`}
              className="bg-blue-600 text-white w-full xl:w-auto text-center text-nowrap px-6 py-3 font-bold text-lg hover:bg-blue-500 transition"
            >
              View More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResult;
