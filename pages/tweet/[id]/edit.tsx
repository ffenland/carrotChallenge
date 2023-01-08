import Layout from "@components/layout";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "@lib/withSession";
import type { Tweet } from "@prisma/client";
import { useRouter } from "next/router";
import useSWR from "swr";
import Button from "@components/button";
import useMutation from "@lib/useMutation";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

export interface TweetWithUserAndLikes extends Tweet {
  user: { email: string; nickname: string };
  likes: { id: string }[];
}

interface TweetResponse {
  ok: boolean;
  tweet: TweetWithUserAndLikes;
  isLiked: boolean;
}

interface SessionUser {
  user: { id: string };
}
interface TweetForm {
  tweetText: string;
}
interface TweetWriteResponse {
  ok: boolean;
}

const TweetDetailEdit = ({ user }: SessionUser) => {
  const router = useRouter();
  const tweetId = router.query.id;
  const { data } = useSWR<TweetResponse>(
    tweetId ? `/api/tweet/${tweetId}` : null
  );
  const { register, handleSubmit } = useForm<TweetForm>();
  const [write, { data: writeData, loading }] = useMutation<TweetWriteResponse>(
    `/api/tweet/${tweetId}/edit`
  );
  const onValid = (validForm: TweetForm) => {
    if (loading) return;
    write({ ...validForm, userId: user?.id });
  };
  useEffect(() => {
    if (writeData && writeData.ok) {
      router.push(`/`);
    }
  }, [writeData, router]);

  if (data && data.tweet && user.id === data.tweet.userId) {
    const tweetCreatedDate = new Date(data.tweet.createdAt);
    const refinedDate = `${
      tweetCreatedDate.getMonth() + 1
    }월 ${tweetCreatedDate.getDate()}일 ${tweetCreatedDate.getHours()}시 ${tweetCreatedDate.getMinutes()}분`;
    return (
      <Layout title="Tweet">
        <div className="flex rounded-md p-1 shadow-md border border-gray-50">
          <div className="IMAGE mr-2">
            <div className="rounded-full bg-cyan-900 w-12 h-12 aspect-square flex justify-center items-center">
              <span className="font-bold text-4xl text-orange-100">
                {data.tweet.user.nickname[0].toUpperCase()}
              </span>
            </div>
          </div>
          <div className="w-full">
            <div className="mt-1 space-x-1">
              <span className="font-bold">{data.tweet.user.nickname}</span>
              <span className="text-sm text-gray-600">
                {data.tweet.user.email}
              </span>
              <span className="text-sm text-gray-600">{refinedDate}</span>
            </div>
            <form onSubmit={handleSubmit(onValid)} className="mt-2">
              <textarea
                {...register("tweetText", {
                  required: true,
                  maxLength: 140,
                  value: data?.tweet.text,
                })}
                className="w-full outline-none border border-grau-200 p-5 rounded-md focus:border-cyan-100"
                rows={8}
                maxLength={140}
              ></textarea>
              <Button title={loading ? "Loading..." : "Edit tweet"} />
            </form>
          </div>
        </div>
      </Layout>
    );
  } else {
    return (
      <Layout title="Tweet">
        <div>
          <span>No tweet, Not authorized.</span>
        </div>
      </Layout>
    );
  }
};

export default TweetDetailEdit;

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user;
    return {
      props: {
        user: user,
      },
    };
  },
  sessionOptions
);
