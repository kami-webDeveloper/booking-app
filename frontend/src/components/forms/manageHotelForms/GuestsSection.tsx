import { useFormContext } from "react-hook-form";
import type { HotelFormData } from "../../../shared/types";

const GuestsSection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<HotelFormData>();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">Guests</h2>
      <div className="w-full py-3 px-5 flex flex-col md:flex-row bg-gray-300 items-center md:justify-around gap-4 md:gap-x-5 rounded-md">
        <label className="text-gray-700 text-sm font-bold flex-1">
          Adults
          <input
            type="number"
            min={0}
            defaultValue={2}
            className="border rounded border-gray-300 w-full px-2 font-normal py-1 text-lg bg-gray-100"
            {...register("adultCount", {
              required: "adults number is required",
            })}
          />
          {errors.adultCount && (
            <p className="text-red-500">{errors.adultCount?.message}</p>
          )}
        </label>
        <label className="text-gray-700 text-sm font-bold flex-1">
          Children
          <input
            type="number"
            min={0}
            defaultValue={0}
            className="border rounded border-gray-300 w-full px-2 font-normal py-1 text-lg bg-gray-100"
            {...register("childCount", {
              required: "child number is required",
            })}
          />
          {errors.childCount && (
            <p className="text-red-500">{errors.childCount?.message}</p>
          )}
        </label>
      </div>
    </div>
  );
};

export default GuestsSection;
