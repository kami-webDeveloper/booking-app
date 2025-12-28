import { useFormContext } from "react-hook-form";
import { hotelFacilities } from "../../../config/hotel-options-config";
import type { HotelFormData } from "../../../shared/types";

const FacilitiesSection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<HotelFormData>();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">Facilities</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {hotelFacilities.map((facility) => (
          <label key={facility} className="text-sm flex items-center gap-2">
            <input
              type="checkbox"
              value={facility}
              {...register("facilities", {
                validate: (facilities) =>
                  !facilities || !facilities.length
                    ? "At least one facility is required"
                    : true,
              })}
            />
            {facility}
          </label>
        ))}
      </div>
      {errors.facilities && (
        <span className="text-sm text text-red-500 font-bold">
          {errors.facilities.message}
        </span>
      )}
    </div>
  );
};

export default FacilitiesSection;
