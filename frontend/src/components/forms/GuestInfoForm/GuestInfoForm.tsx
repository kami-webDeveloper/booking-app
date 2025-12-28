/* eslint-disable react-hooks/incompatible-library */
import DatePicker from "react-datepicker";
import { useForm } from "react-hook-form";
import { useSearchContext } from "../../../context/SearchContext";
import { useAppContext } from "../../../context/AppContext";
import { useLocation, useNavigate } from "react-router";

type Props = {
  hotelId: string;
  pricePerNight: number;
};

type GuestInfoFormData = {
  checkIn: Date;
  checkOut: Date;
  adultsCount: number;
  childCount: number;
};

const GuestInfoForm = ({ hotelId, pricePerNight }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const search = useSearchContext();
  const { isLoggedIn } = useAppContext();

  const {
    watch,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<GuestInfoFormData>({
    defaultValues: {
      checkIn: search.checkIn,
      checkOut: search.checkOut,
      adultsCount: search.adultCount,
      childCount: search.childCount,
    },
  });

  const checkIn = watch("checkIn");
  const checkOut = watch("checkOut");
  const adultCount = watch("adultsCount");
  const childCount = watch("childCount");

  const minDate = new Date();
  const maxDate = new Date();

  maxDate.setFullYear(maxDate.getFullYear() + 1);

  const onSignInClick = (data: GuestInfoFormData) => {
    search.saveSearchValues(
      "",
      data.checkIn,
      data.checkOut,
      data.adultsCount,
      data.childCount
    );

    navigate("/sign-in", { state: { from: location.pathname } });
  };

  const onSubmit = (data: GuestInfoFormData) => {
    search.saveSearchValues(
      "",
      data.checkIn,
      data.checkOut,
      data.adultsCount,
      data.childCount
    );

    navigate(`/hotel/${hotelId}/booking`);
  };

  return (
    <div className="flex flex-col p-4 bg-blue-200 gap-4">
      <h3 className="text-md font-bold">${pricePerNight}</h3>
      <form
        onSubmit={
          isLoggedIn ? handleSubmit(onSubmit) : handleSubmit(onSignInClick)
        }
      >
        <div className="grid grid-cols-1 gap-4 items-center">
          <div>
            <DatePicker
              required
              selected={checkIn}
              onChange={(date: Date | null) => setValue("checkIn", date!)}
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
              required
              selected={checkOut}
              onChange={(date: Date | null) => setValue("checkOut", date!)}
              startDate={checkIn}
              endDate={checkOut}
              minDate={minDate}
              maxDate={maxDate}
              selectsStart
              placeholderText="Check-out Date"
              className="min-w-full bg-white p-2 focus:outline-none cursor-pointer"
              wrapperClassName="min-w-full"
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
                {...register("adultsCount", {
                  required: "This field is required",
                  min: {
                    value: 1,
                    message: "There must be at least 1 adult",
                  },
                  valueAsNumber: true,
                })}
              />
            </label>
            <label className="flex items-center">
              Children:
              <input
                type="number"
                min={0}
                max={20}
                className="w-full p-1 focus:outline-none font-bold bg-white"
                value={childCount}
                {...register("childCount", { valueAsNumber: true })}
              />
            </label>
            {errors.adultsCount && (
              <span className="text-red-500 font-semibold text-sm">
                {errors.adultsCount.message}
              </span>
            )}
          </div>
          {isLoggedIn ? (
            <button
              type="submit"
              className="bg-blue-600 text-white h-full p-2 font-bold hover:bg-blue-500 text-xl"
            >
              Book Now
            </button>
          ) : (
            <button
              type="submit"
              className="bg-blue-600 text-white h-full p-2 font-bold hover:bg-blue-500 text-xl"
            >
              Sign in to Book
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default GuestInfoForm;
