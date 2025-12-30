import { useForm } from "react-hook-form";
import type { UserType } from "../shared/types";
import useCreatePaymentIntent from "../features/payment/createPaymentIntent.mutation";
import { useParams } from "react-router";
import { useAppContext } from "../context/AppContext";
import { useHotel } from "../features/hotels/getHotels.query";

type Props = {
  user: UserType;
  checkIn: Date;
  checkOut: Date;
  adultCount: number;
  childCount: number;
  numberOfNights: number;
};

type BookingFormData = {
  firstName: string;
  lastName: string;
  email: string;
};

const BookingForm = ({
  user,
  checkIn,
  checkOut,
  adultCount,
  childCount,
  numberOfNights,
}: Props) => {
  const { id: hotelId } = useParams();
  const { showToast } = useAppContext();

  const { register } = useForm<BookingFormData>({
    defaultValues: {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  });

  const { data: hotelData, isLoading } = useHotel(hotelId as string);

  const { mutate: createPaymentIntent, isPending: isCreatingIntent } =
    useCreatePaymentIntent(hotelId as string);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!numberOfNights || numberOfNights <= 0) {
      return showToast({
        message: "Cannot purchase a booking with incorrect number of nights!",
        type: "ERROR",
      });
    }

    createPaymentIntent({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      adultCount,
      childCount,
      checkIn,
      checkOut,
      numberOfNights,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-5 rounded-lg border border-slate-300 p-5"
    >
      <span className="text-3xl font-bold">Confirm your details</span>
      <div className="grid grid-cols-2 gap-6">
        <label className="text-gray-700 text-sm font-bold flex-1">
          First Name
          <input
            type="text"
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
            readOnly
            disabled
            {...register("firstName")}
          />
        </label>
        <label className="text-gray-700 text-sm font-bold flex-1">
          Last Name
          <input
            type="text"
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
            readOnly
            disabled
            {...register("lastName")}
          />
        </label>
        <label className="text-gray-700 text-sm font-bold flex-1">
          Email
          <input
            type="email"
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
            readOnly
            disabled
            {...register("email")}
          />
        </label>
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Your Price Summary</h2>
        <div className="bg-blue-200 p-4 rounded-md">
          <div className="font-semibold text-lg">
            Total Cost: $
            {!isLoading
              ? numberOfNights * hotelData!.pricePerNight
              : "Loading price..."}
          </div>
          <div className="text-xs">Includes taxes and charges</div>
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Payment Details</h3>
        <button
          type="submit"
          disabled={isCreatingIntent}
          className="p-2 float-right rounded-md cursor-pointer enabled:hover:bg-blue-600 bg-blue-500 text-white font-bold text-xl transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {!isCreatingIntent ? "Purchase" : "Creating Intent..."}
        </button>
      </div>
    </form>
  );
};

export default BookingForm;
