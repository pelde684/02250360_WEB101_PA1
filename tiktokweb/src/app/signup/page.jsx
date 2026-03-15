"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";

export default function SignupPage() {

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = (data) => {
    setIsLoading(true);
    console.log(data);

    setTimeout(() => {
      setIsLoading(false);
      alert("Signup successful (demo only)");
    }, 1500);
  };

  const password = watch("password");

  return (
    <div className="flex justify-center items-center min-h-screen">

      <div className="border p-8 rounded-lg shadow-md w-96">

        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >

          <input
            type="text"
            placeholder="Full Name"
            className="border p-2 rounded"
            {...register("name", { required: "Name is required" })}
          />

          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}

          <input
            type="email"
            placeholder="Email"
            className="border p-2 rounded"
            {...register("email", { required: "Email is required" })}
          />

          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}

          <input
            type="password"
            placeholder="Password"
            className="border p-2 rounded"
            {...register("password", { required: "Password is required" })}
          />

          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}

          <input
            type="password"
            placeholder="Confirm Password"
            className="border p-2 rounded"
            {...register("confirmPassword", {
              required: "Confirm password is required",
              validate: (value) =>
                value === password || "Passwords do not match"
            })}
          />

          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">
              {errors.confirmPassword.message}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
          >
            {isLoading ? "Signing up..." : "Sign Up"}
          </button>

        </form>

      </div>

    </div>
  );
}