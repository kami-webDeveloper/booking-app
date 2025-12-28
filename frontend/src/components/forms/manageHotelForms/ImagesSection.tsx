import { useFormContext } from "react-hook-form";
import { Trash2 } from "lucide-react";
import type { HotelFormData } from "../../../shared/types";

const ImagesSection = () => {
  const {
    formState: { errors },
    register,
    watch,
    setValue,
  } = useFormContext<HotelFormData>();

  const existingImages = watch("images");

  const handleDelete = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    publicId: string
  ) => {
    e.preventDefault();

    setValue(
      "images",
      (existingImages || []).filter((img) => img.publicId !== publicId)
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">Images</h2>
      <div className="border rounded p-4 flex flex-col gap-4 border-gray-200">
        {existingImages && (
          <div className="grid grid-cols-6 gap-4">
            {existingImages.map(({ url, publicId }) => (
              <div key={publicId} className="relative group">
                <img src={url} className="min-h-full object-cover " />
                <button
                  onClick={(e) => handleDelete(e, publicId)}
                  className="cursor-pointer absolute inset-0 flex items-center justify-center gap-x-1 bg-black/0 opacity-0 group-hover:opacity-100 hover:bg-black/50 text-white transition"
                >
                  <Trash2 /> Delete
                </button>
              </div>
            ))}
          </div>
        )}
        <input
          type="file"
          multiple
          accept="image/*"
          className="
    w-full
    text-gray-700
    font-normal
    file:mr-4
    file:py-2
    file:px-4
    file:rounded-md
    file:border-0
    file:text-sm
    file:font-semibold
    file:bg-blue-50
    file:text-blue-700
    hover:file:bg-blue-100
    cursor-pointer
  "
          {...register("imageFiles", {
            validate: (imageFiles) => {
              const totalLength =
                imageFiles.length + (existingImages?.length || 0);

              if (!totalLength) return "At least one image must be added";
              if (totalLength > 6)
                return "Total number of images cannot be more than 6";

              return true;
            },
          })}
        />
      </div>
      {errors.imageFiles && (
        <p className="text-red-500">{errors.imageFiles?.message}</p>
      )}
    </div>
  );
};

export default ImagesSection;
