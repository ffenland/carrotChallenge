import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Input from "@components/input";
import Button from "@components/button";
import useMutation from "@lib/useMutation";
import { useRouter } from "next/router";
import useUser from "@lib/useUser";

interface LoginForm {
  email: string;
  password: string;
  errors?: string;
}

interface MutationResult {
  ok: boolean;
  errorMSG?: string;
}

const Login: NextPage = () => {
  const { user, isLoading } = useUser();
  console.log(user, "SDFASDF", isLoading);
  const [login, { data, loading }] =
    useMutation<MutationResult>("/api/auth/login");
  const { register, handleSubmit } = useForm<LoginForm>();
  const onValid = (validForm: LoginForm) => {
    if (loading) return;
    login(validForm);
    console.log(validForm);
  };
  const router = useRouter();
  useEffect(() => {
    if (data && data?.ok) {
      router.push("/");
    }
    if (data && data.errorMSG) {
      console.log(data.errorMSG);
    }
  }, [data]);
  useEffect(() => {
    if (!isLoading && user) {
      router.push("/");
    }
  }, [user]);
  if (isLoading) {
    return <div>Now Loading</div>;
  } else if (user) {
    return <div>Already logged in! Redirect to Home.</div>;
  } else {
    return (
      <div className="mt-16 px-4">
        <h3 className="text-3xl font-bold text-center">Log in Cweeter</h3>
        <div className="mt-12">
          <div className="flex flex-col items-center">
            <h5 className="text-sm text-gray-500 font-medium">
              Welcome back! Log in.
            </h5>
          </div>
          <form
            onSubmit={handleSubmit(onValid)}
            className="flex flex-col mt-8 space-y-4"
          >
            {data?.errorMSG ? (
              <div className="flex items-center justify-center">
                <span className="text-red-500 font-bold">
                  Wrong email or password
                </span>
              </div>
            ) : null}
            <Input
              register={register("email", {
                required: true,
              })}
              name="email"
              label="Email address"
              type="email"
              required
            />
            <Input
              register={register("password", {
                required: true,
                minLength: 4,
              })}
              name="password"
              label="Password"
              type="password"
              required
              minLength={4}
            />

            <Button title={loading ? "Loading..." : "Log In"} />
          </form>
          <div className="mt-2 flex flex-col justify-center items-center space-y-2">
            <span className="text-sm text-gray-600">OR</span>
            <Button
              title="Go to create account"
              onClick={() => {
                router.push("/create-account");
              }}
            />
          </div>
        </div>
      </div>
    );
  }
};
export default Login;
