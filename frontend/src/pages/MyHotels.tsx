import {
  BadgeDollarSign,
  FileEdit,
  Hotel,
  HousePlusIcon,
  MapIcon,
  Star,
  Users,
} from "lucide-react";
import { Link } from "react-router";
import LoadingSpinner from "../components/LoadingSpinner";
import { hotelTypes } from "../config/hotel-options-config";
import { useUserHotels } from "../features/myhotels/getUserHotels.query";

const MyHotels = () => {
  const { data: hotelsData, isLoading } = useUserHotels();

  return (
    <div className="space-y-5 my-8">
      <span className="flex justify-between">
        <h2 className="text-3xl font-bold">My Hotels</h2>
        <Link
          to="/add-hotel"
          className="flex bg-blue-600 text-white text-xl font-bold p-2 hover:bg-blue-500 items-center gap-x-1 rounded-md"
        >
          <HousePlusIcon />
          Add Hotel
        </Link>
      </span>
      <div className="grid grid-cols-1 gap-8">
        {isLoading ? (
          <LoadingSpinner text="Loading your hotels..." size={50} />
        ) : (
          hotelsData?.map((hotel) => {
            const hotelTypeObj = hotelTypes.find(
              (hotelType) => hotelType.label === hotel.type
            );

            return (
              <div
                key={hotel._id}
                className="flex flex-col justify-between border border-slate-300 rounded-lg p-8 gap-5"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold">{hotel.name}</h3>
                  <Link
                    to={`/my-hotels/edit/${hotel._id}`}
                    className="flex bg-blue-600 text-white text-md font-semibold p-2 hover:bg-blue-500 items-center gap-x-1 rounded-md"
                  >
                    <FileEdit />
                    View Details
                  </Link>
                </div>
                <p className="whitespace-pre-line line-clamp-3">
                  {hotel.description}...
                </p>
                <div className="grid grid-cols-5 gap-2">
                  <div className="border border-slate-300 rounded-sm p-3 flex items-center font-semibold">
                    <MapIcon className="mr-1 text-sky-500" />
                    {hotel.city}, {hotel.country}
                  </div>
                  <div className="border border-slate-300 rounded-sm p-3 flex items-center font-semibold">
                    <Hotel className="mr-1 text-violet-500" />
                    {hotelTypeObj?.icon}
                    {hotel.type}
                  </div>
                  <div className="border border-slate-300 rounded-sm p-3 flex font-semibold items-center">
                    <BadgeDollarSign className="mr-1 text-green-600" />$
                    {hotel.pricePerNight} per night
                  </div>
                  <div className="border border-slate-300 rounded-sm p-3 flex font-semibold items-center text-sm">
                    <Users className="mr-1 text-orange-500" />
                    {hotel.adultCount} Adults,{" "}
                    {(hotel.childCount > 0 && hotel.childCount) || 0} Children
                  </div>
                  <div className="border border-slate-300 rounded-sm p-3 flex font-semibold items-center">
                    <Star className="mr-1 text-yellow-500" />
                    {hotel.starRating} Stars
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MyHotels;
