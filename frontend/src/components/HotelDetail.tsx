import { useParams } from "react-router";
import { useHotel } from "../features/hotels/getHotels.query";
import LoadingSpinner from "./LoadingSpinner";
import { StarIcon } from "lucide-react";
import GuestInfoForm from "./forms/GuestInfoForm/GuestInfoForm";

const HotelDetail = () => {
  const { id: hotelId } = useParams();

  const {
    data: hotelData,
    isLoading: isLoadingHotel,
    isError,
    error,
  } = useHotel(hotelId as string);

  if (isLoadingHotel) return <LoadingSpinner text="Loading Hotel..." />;

  if (isError)
    return (
      <span className="text-red-500 font-bold text-2xl">
        {error.message || "An error has occured while loading the hotel"}
      </span>
    );

  return (
    <div className="space-y-6 my-7">
      <div>
        <span className="flex">
          {Array.from({ length: hotelData?.starRating as number }).map(
            (_, i) => (
              <StarIcon key={i} className="fill-yellow-400" width={20} />
            )
          )}
        </span>
        <h2 className="text-3xl font-bold">{hotelData?.name}</h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {hotelData?.images.map(({ url }) => (
          <div className="h-[300px]">
            <img
              src={url}
              alt={hotelData.name}
              className="rounded-md w-full h-full object-cover object-center"
            />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
        {hotelData?.facilities.map((fac) => (
          <div className="border border-slate-300 rounded-sm p-3">{fac}</div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-x-3">
        <div className="whitespace-pre-line">{hotelData?.description}</div>
        <div className="h-fit">
          <GuestInfoForm
            hotelId={hotelData?._id as string}
            pricePerNight={hotelData?.pricePerNight as number}
          />
        </div>
      </div>
    </div>
  );
};

export default HotelDetail;
