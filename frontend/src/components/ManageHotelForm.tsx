import { FormProvider, useForm } from "react-hook-form";
import DetailsSection from "./forms/manageHotelForms/DetailsSection";
import TypeSection from "./forms/manageHotelForms/TypeSection";
import FacilitiesSection from "./forms/manageHotelForms/FacilitiesSection";
import GuestsSection from "./forms/manageHotelForms/GuestsSection";
import ImagesSection from "./forms/manageHotelForms/ImagesSection";
import { Upload } from "lucide-react";
import useAddHotel from "../features/myhotels/addHotel.mutation";
import { useEffect } from "react";
import { useEditHotel } from "../features/myhotels/editHotel.mutation";
import { useParams } from "react-router";
import type { HotelFormData, HotelType } from "../shared/types";

type Props = {
  hotel?: HotelType;
};

const ManageHotelForm = ({ hotel }: Props) => {
  const { id } = useParams();

  const formMethods = useForm<HotelFormData>();
  const { handleSubmit, reset } = formMethods;

  const { mutate: addHotel, isPending: isAddingHotel } = useAddHotel();
  const { mutate: editHotel, isPending: isEditingHotel } = useEditHotel(id!);

  useEffect(() => {
    reset(hotel);
  }, [hotel, reset]);

  const onSubmit = handleSubmit((formData: HotelFormData) => {
    if (hotel) editHotel(formData);
    else addHotel(formData);
  });

  const submitBtnText = () => {
    if (hotel) return isEditingHotel ? "Editing Hotel..." : "Edit";
    else return isAddingHotel ? "Saving Hotel..." : "Save";
  };

  return (
    <FormProvider {...formMethods}>
      <form className="flex flex-col gap-10 px-5 my-7 py-5" onSubmit={onSubmit}>
        <DetailsSection />
        <TypeSection />
        <FacilitiesSection />
        <GuestsSection />
        <ImagesSection />
        <span className="flex justify-end">
          <button
            type="submit"
            disabled={isAddingHotel || isEditingHotel}
            className={`flex items-center justify-center gap-x-2 bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl cursor-pointer rounded-md transition-all disabled:cursor-not-allowed disabled:bg-gray-400 disabled:hover:bg-gray-400`}
          >
            <Upload />
            {submitBtnText()}
          </button>
        </span>
      </form>
    </FormProvider>
  );
};

export default ManageHotelForm;
