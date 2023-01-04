import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Input from "@components/input";
import Button from "@components/button";
import useMutation from "@lib/useMutation";
import { useRouter } from "next/router";
import useUser from "@lib/useUser";

interface EnterForm {
  email: string;
  nickname: string;
  password: string;
  errors?: string;
}

interface TokenForm {
  token: string;
}

interface MutationResult {
  ok: boolean;
  payload?: string;
}

const Enter: NextPage = () => {
  const { user, isLoading } = useUser();
  const [enter, { data, loading }] =
    useMutation<MutationResult>("/api/auth/signup");
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setError,
    formState: { errors },
  } = useForm<EnterForm>();
  const [confirmToken, { data: tokenData, loading: tokenLoading }] =
    useMutation<MutationResult>("/api/auth/confirm");
  const { register: tokenRegister, handleSubmit: tokenSubmit } =
    useForm<TokenForm>();
  const onValid = (validForm: EnterForm) => {
    if (loading) return;
    enter(validForm);
  };
  const onTokenValid = (validForm: TokenForm) => {
    if (tokenLoading) return;
    const inputValues = getValues();
    confirmToken({ ...validForm, ...inputValues });
  };
  const router = useRouter();
  useEffect(() => {
    if (data && !data?.ok) {
      setError("errors", { message: "Email or Nickname already used." });
    }
  }, [data]);
  useEffect(() => {
    if (tokenData?.ok) {
      router.push("/");
    }
  }, [tokenData, router]);
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
        <h3 className="text-3xl font-bold text-center">Enter to Cweeter</h3>
        <div className="mt-12">
          {data?.ok ? (
            <form
              onSubmit={tokenSubmit(onTokenValid)}
              className="flex flex-col mt-8 space-y-4"
            >
              <div className="border border-gray-300 rounded-md shadow-sm py-2 px-4 text-gray-600">
                <div>
                  <span>Token was NOT sended to </span>
                  <span className="font-bold text-black text-lg">
                    {getValues("email")}
                  </span>
                </div>
                <div>
                  <span> Use this token (only in Dev mode)</span>
                </div>
                <div className="flex justify-center items-center">
                  <span className="text-3xl font-bold px-2 bg-red-300">
                    {data.payload}
                  </span>
                </div>
              </div>
              <Input
                register={tokenRegister("token", {
                  required: true,
                })}
                name="token"
                label="Confrimation Token"
                type="text"
                required
              />
              <Button title={loading ? "Loading..." : "Confirm Token"} />
            </form>
          ) : (
            <>
              <div className="flex flex-col items-center">
                <h5 className="text-sm text-gray-500 font-medium">
                  Create new accout.
                </h5>
              </div>
              <form
                onSubmit={handleSubmit(onValid)}
                className="flex flex-col mt-8 space-y-4"
              >
                {errors.errors?.message ? (
                  <div>
                    <span>{errors.errors.message}</span>
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
                  register={register("nickname", {
                    required: true,
                  })}
                  name="nickname"
                  label="Nickname"
                  type="text"
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

                <Button title={loading ? "Loading..." : "Get token"} />
              </form>
              <div className="mt-2 flex flex-col justify-center items-center space-y-2">
                <span className="text-sm text-gray-600">OR</span>
                <Button
                  title="Go to login"
                  onClick={() => {
                    router.push("/log-in");
                  }}
                />
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
};
export default Enter;
