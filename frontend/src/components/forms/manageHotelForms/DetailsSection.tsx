import { useFormContext } from "react-hook-form";
import type { HotelFormData } from "../../ManageHotelForm";

const DetailsSection = () => {
  const {
    formState: { errors },
    register,
  } = useFormContext<HotelFormData>();

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-3xl font-bold mb-3">Add Hotel</h2>
      <label className="text-gray-700 text-sm font-bold flex-1">
        Name
        <input
          type="text"
          className="border rounded border-gray-300 w-full px-2 font-normal py-1 text-lg"
          {...register("name", { required: "name is required" })}
          autoFocus
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </label>
      <div className="flex flex-col md:flex-row gap-5">
        <label className="text-gray-700 text-sm font-bold flex-1">
          City
          <input
            type="text"
            className="border rounded border-gray-300 w-full px-2 font-normal py-1 text-lg"
            {...register("city", { required: "This field is required" })}
          />
          {errors.city && <p className="text-red-500">{errors.city.message}</p>}
        </label>
        <label className="text-gray-700 text-sm font-bold flex-1">
          Country
          <input
            type="text"
            className="border rounded border-gray-300 w-full px-2 font-normal py-1 text-lg"
            {...register("country", { required: "This field is required" })}
          />
          {errors.country && (
            <p className="text-red-500">{errors.country.message}</p>
          )}
        </label>
      </div>
      <label className="text-gray-700 text-sm font-bold flex-1">
        Description
        <textarea
          className="border rounded border-gray-300 w-full px-2 font-normal py-1 min-h-40 text-lg"
          {...register("description", { required: "description is required" })}
        />
        {errors.description && (
          <p className="text-red-500">{errors.description.message}</p>
        )}
      </label>
      <div className="flex flex-col md:flex-row md:items-start md:gap-8 gap-y-8">
        <label className="text-gray-700 text-sm font-bold flex-1">
          Price Per Night
          <input
            type="number"
            min={1}
            className="border rounded border-gray-300 w-full md:w-1/3 px-2 font-normal py-1 text-lg"
            {...register("pricePerNight", {
              required: "Price per night is required",
            })}
          />
          {errors.pricePerNight && (
            <p className="text-red-500 text-sm font-normal">
              {errors.pricePerNight.message}
            </p>
          )}
        </label>
        <label className="text-gray-700 text-sm font-bold flex-1">
          Star Rating
          <select
            className="border rounded border-gray-300 w-full md:w-1/3 px-2 font-normal py-1 text-lg"
            {...register("starRating", {
              required: "Star rating is required",
            })}
          >
            <option value="" className="text-sm font-bold">
              Select as Rating
            </option>
            {[1, 2, 3, 4, 5].map((star) => (
              <option
                value={star}
                className="text-sm border rounded w-full p-2 text-gray-700 font-bold"
              >
                {star} {"⭐".repeat(star)}
              </option>
            ))}
          </select>
          {errors.starRating && (
            <p className="text-red-500 text-sm font-normal">
              {errors.starRating.message}
            </p>
          )}
        </label>
      </div>
    </div>
  );
};

export default DetailsSection;
