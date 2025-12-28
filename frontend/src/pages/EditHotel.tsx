import { useParams } from "react-router";
import ManageHotelForm from "../components/ManageHotelForm";
import LoadingSpinner from "../components/LoadingSpinner";
import { useUserHotel } from "../features/myhotels/getUserHotels.query";

const EditHotel = () => {
  const { id: hotelId } = useParams();

  const {
    data: hotelData,
    isLoading: isLoadingHotel,
    isError,
    error,
  } = useUserHotel(hotelId!);

  if (isLoadingHotel) return <LoadingSpinner />;

  if (isError)
    return (
      <span className="text-center text-2xl text-red-500 text-bold">
        {error.message || "Failed to get hotel information"}
      </span>
    );

  if (!hotelData) {
    return (
      <span className="text-center text-2xl text-red-500 font-bold">
        Hotel not found
      </span>
    );
  }

  return <ManageHotelForm hotel={hotelData} />;
};

export default EditHotel;
