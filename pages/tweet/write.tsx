import Button from "@components/button";
import useMutation from "@lib/useMutation";
import useUser from "@lib/useUser";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

interface TweetForm {
  tweetText: string;
}
interface TweetWriteResponse {
  ok: boolean;
  tweetId: string;
}

const WriteTweet = () => {
  const { user } = useUser();
  const { register, handleSubmit } = useForm<TweetForm>();
  const [write, { data, loading }] =
    useMutation<TweetWriteResponse>("/api/tweet");
  const router = useRouter();
  const onValid = (validForm: TweetForm) => {
    write({ ...validForm, userId: user?.id });
  };
  console.log(data);
  useEffect(() => {
    if (data && data.ok) {
      router.push(`/tweet/${data.tweetId}`);
    }
  }, [data, router]);
  return (
    <div className="flex">
      <div className="IMAGE mr-2">
        <div className="rounded-full bg-gray-500 w-12 h-12 aspect-square"></div>
      </div>
      <div className="w-full">
        <div className="mt-1 space-x-1">
          <span className="font-bold">{user?.nickname}</span>
          <span className="text-sm text-gray-600">{user?.email}</span>
          <span className="text-xs text-gray-600">
            {`${
              new Date().getMonth() + 1
            }월${new Date().getDate()}일 ${new Date().getHours()}시 ${new Date().getMinutes()}분`}
          </span>
        </div>
        <form onSubmit={handleSubmit(onValid)} className="mt-2">
          <textarea
            {...register("tweetText", { required: true, maxLength: 140 })}
            className="w-full outline-none border border-grau-200 p-5 rounded-md focus:border-cyan-100"
            rows={8}
            maxLength={140}
          ></textarea>
          <Button title="Tweet" />
        </form>
      </div>
    </div>
  );
};
export default WriteTweet;
