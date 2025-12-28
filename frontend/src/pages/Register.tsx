import { useForm } from "react-hook-form";
import useAuthUser from "../features/auth/authUser.mutation";
import { Link } from "react-router";

export type RegisterFormData = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  confirmPassword: string;
};

const Register = () => {
  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();

  // Using the hook to register
  const { mutate: registerUser, isPending: isRegistering } =
    useAuthUser("register");

  const onSubmit = handleSubmit((data) => registerUser(data));

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5 px-5 my-5 py-10">
      <h2 className="text-3xl font-bold">Create an account</h2>
      <div className="flex flex-col md:flex-row gap-5">
        <label className="text-gray-700 text-sm font-bold flex-1">
          First Name
          <input
            type="text"
            className="border rounded border-gray-300 w-full px-2 font-normal py-1 text-lg"
            {...register("firstName", { required: "This field is required" })}
          />
          {errors.firstName && (
            <p className="text-red-500">{errors.firstName.message}</p>
          )}
        </label>
        <label className="text-gray-700 text-sm font-bold flex-1">
          Last Name
          <input
            type="text"
            className="border rounded border-gray-300 w-full px-2 font-normal py-1 text-lg"
            {...register("lastName", { required: "This field is required" })}
          />
          {errors.lastName && (
            <p className="text-red-500">{errors.lastName.message}</p>
          )}
        </label>
      </div>
      <label className="text-gray-700 text-sm font-bold flex-1">
        Email
        <input
          type="email"
          className="border rounded border-gray-300 w-full px-2 font-normal py-1 text-lg"
          {...register("email", { required: "Email is required" })}
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      </label>
      <label className="text-gray-700 text-sm font-bold flex-1">
        Password
        <input
          type="password"
          className="border rounded border-gray-300 w-full px-2 font-normal py-1 text-lg"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
        />
        {errors.password && (
          <p className="text-red-500">{errors.password.message}</p>
        )}
      </label>
      <label className="text-gray-700 text-sm font-bold flex-1">
        Password Confirm
        <input
          type="password"
          className="border rounded border-gray-300 w-full px-2 font-normal py-1 text-lg"
          {...register("confirmPassword", {
            validate: (val) => {
              if (!val) return "Password confirmation is required";
              else if (getValues("password") !== val)
                return "Password confirm do not match";
            },
          })}
        />
        {errors.confirmPassword && (
          <p className="text-red-500">{errors.confirmPassword.message}</p>
        )}
      </label>
      <span>
        <button
          type="submit"
          disabled={isRegistering}
          className="
    bg-blue-600
    text-white
    p-2
    font-bold
    text-xl
    rounded-md
    transition-all
    cursor-pointer
    enabled:hover:bg-blue-500
    disabled:bg-gray-400
    disabled:cursor-not-allowed
  "
        >
          {!isRegistering ? "Create Account" : "Creating Account..."}
        </button>
      </span>
      <p className="text-center text-gray-600 text-sm">
        Already have an account?{" "}
        <Link to="/sign-in" className="text-blue-600 font-semibold underline">
          Sign In
        </Link>
      </p>
    </form>
  );
};

export default Register;
