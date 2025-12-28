import { useFormContext } from "react-hook-form";
import { hotelTypes } from "../../../config/hotel-options-config";
import type { HotelFormData } from "../../../shared/types";

const TypeSection = () => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<HotelFormData>();
  const typeWatch = watch("type");

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Type</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        {hotelTypes.map((type) => (
          <label
            key={type.label}
            className={`
              cursor-pointer
              text-sm
              rounded-full
              px-4
              py-2
              font-semibold
              text-center
              wrap-break-word
              ${typeWatch === type.label ? "bg-blue-300" : "bg-gray-300"}
            `}
          >
            <input
              type="radio"
              value={type.label}
              className="hidden"
              {...register("type", { required: "This field is required" })}
            />
            {type.icon} {type.label}
          </label>
        ))}
      </div>
      {errors.type && (
        <span className="text-red-500 text-sm font-bold">
          {errors.type.message}
        </span>
      )}
    </div>
  );
};

export default TypeSection;
