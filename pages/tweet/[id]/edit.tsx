import Button from "@components/button";
import useMutation from "@lib/useMutation";
import useUser from "@lib/useUser";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "@lib/withSession";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";

interface TweetForm {
  tweetText: string;
}
interface TweetWriteResponse {
  ok: boolean;
  tweetId: string;
}

interface EditTweetProps {
  user: {
    id: string;
  };
  query: string;
}

const EditTweet = ({ user, query }: EditTweetProps) => {
  const router = useRouter();
  const { register, handleSubmit } = useForm<TweetForm>();
  const [edit, { data, loading }] =
    useMutation<TweetWriteResponse>("/api/tweet");
  const tweetId = router.query.id;
  const { data: tweetData } = useSWR(tweetId ? `/api/tweet/${query}` : null);
  const onValid = (validForm: TweetForm) => {
    edit({ ...validForm, userId: user?.id });
  };
  useEffect(() => {
    if (data && data.ok) {
      router.push(`/tweet/${data.tweetId}`);
    }
  }, [data, router]);

  useEffect(() => {
    if (tweetData && tweetData.tweet) {
      console.log(tweetData);
    }
  }, [tweetData]);
  return (
    <div className="flex">
      <div className="IMAGE mr-2">
        <div className="rounded-full bg-cyan-900 w-12 h-12 aspect-square flex justify-center items-center">
          <span className="font-bold text-4xl mr-[2px] text-orange-100">
            {"user?.nickname[0]"}
          </span>
        </div>
      </div>
      <div className="w-full">
        <div className="mt-1 space-x-1">
          <span className="font-bold">{"user?.nickname"}</span>
          <span className="text-sm text-gray-600">{"user?.email"}</span>
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
export default EditTweet;

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps(context) {
    const {
      req: {
        session: { user },
      },
      query,
    } = context;
    return {
      props: {
        user: user,
        query: query,
      },
    };
  },
  sessionOptions
);
