import { useParams } from "react-router";
import BookingForm from "../components/BookingForm";
import { useAppContext } from "../context/AppContext";
import { useSearchContext } from "../context/SearchContext";
import { useHotel } from "../features/hotels/getHotels.query";
import LoadingSpinner from "../components/LoadingSpinner";
import BookingDetailSummary from "../components/BookingDetailSummary";

const Booking = () => {
  const { id: hotelId } = useParams();
  const { userData } = useAppContext();
  const search = useSearchContext();

  const numberOfNights =
    search.checkIn && search.checkOut
      ? Math.ceil(
          Math.abs(search.checkOut.getTime() - search.checkIn.getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

  const { data: hotel, isLoading } = useHotel(hotelId as string);

  if (!hotel) return <></>;

  return (
    <div className="grid md:grid-cols-[1fr_2fr] my-8 gap-5">
      {!isLoading ? (
        <BookingDetailSummary
          checkIn={search.checkIn}
          checkOut={search.checkOut}
          adultCount={search.adultCount}
          childCount={search.childCount}
          numberOfNights={numberOfNights}
          hotel={hotel}
        />
      ) : (
        <div className="flex items-center justify-center">
          <LoadingSpinner text="Loading Hotel Information" size={40} />
        </div>
      )}
      {userData ? (
        <BookingForm user={userData} />
      ) : (
        <span className="text-xl text-center mx-auto text-red-500">
          User data is not found. Please try again booking this hotel.
        </span>
      )}
    </div>
  );
};

export default Booking;
