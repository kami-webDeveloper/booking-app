import { useForm } from "react-hook-form";
import useAuthUser from "../features/auth/authUser.mutation";
import { Link } from "react-router";

export type SignInFormData = {
  email: string;
  password: string;
};

const Signin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>();

  // Using the hook to login
  const { mutate: loginUser, isPending: isSigningIn } = useAuthUser("login");

  const onSubmit = handleSubmit((data) => loginUser(data));

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5 px-5 py-10 my-5">
      <h2 className="text-3xl font-bold">Sign In to your account</h2>
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
      <span>
        <button
          type="submit"
          disabled={isSigningIn}
          className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl cursor-pointer transition-all rounded-md"
        >
          {!isSigningIn ? "Sign In" : "Signing In..."}
        </button>
      </span>
      <p className="text-center text-gray-600 text-sm">
        Don’t have an account?{" "}
        <Link to="/register" className="text-blue-600 font-semibold underline">
          Sign Up
        </Link>
      </p>
    </form>
  );
};

export default Signin;
