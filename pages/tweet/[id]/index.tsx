import Layout from "@components/layout";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "@lib/withSession";
import type { Tweet } from "@prisma/client";
import { useRouter } from "next/router";
import useSWR from "swr";
import Button from "@components/button";
import useMutation from "@lib/useMutation";

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

const TweetDetail = ({ user }: SessionUser) => {
  const router = useRouter();
  const tweetId = router.query.id;
  const { data, mutate } = useSWR<TweetResponse>(
    tweetId ? `/api/tweet/${tweetId}` : null
  );

  const [toggleLike, { loading }] = useMutation(`/api/tweet/${tweetId}/like`);
  const onEditClick = () => {
    router.push(`/tweet/${tweetId}/edit`);
  };
  const onLikeClick = () => {
    if (loading) return;
    if (!data) return;
    toggleLike({});
    mutate(
      (prev) =>
        prev && {
          ...prev,
          isLiked: !prev?.isLiked,
          tweet: {
            ...prev.tweet,

            likes: prev.isLiked
              ? prev.tweet.likes.slice(0, -1)
              : [...prev.tweet.likes, { id: "temporary" }],
          },
        },
      false
    );
  };
  if (data && data.tweet) {
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
            <div>
              <p>{data.tweet.text}</p>
            </div>
            <div className="flex justify-end items-center px-5">
              {user.id === data.tweet.userId ? (
                <div className="space-x-1 border px-4 shadow-md border-gray-50 rounded-md mb-2">
                  <span>Like</span>
                  <span>
                    {data.tweet.likes ? data.tweet.likes.length : "0"}
                  </span>
                </div>
              ) : (
                <div
                  className="space-x-1 border px-4 shadow-md border-gray-50 rounded-md mb-2 cursor-pointer hover:bg-rose-100 flex"
                  onClick={onLikeClick}
                >
                  <span>Like</span>
                  <span>
                    {data.tweet.likes ? data.tweet.likes.length : "0"}
                  </span>
                  <div className="w-5 flex justify-center items-center">
                    {data.isLiked ? (
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-6 w-6 "
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              )}
            </div>
            {user.id === data.tweet.userId ? (
              <div className="mr-14">
                <Button title="Edit your tweet" onClick={onEditClick} />
              </div>
            ) : null}
          </div>
        </div>
      </Layout>
    );
  } else {
    return (
      <Layout title="Tweet">
        <div>
          <span>No tweet</span>
        </div>
      </Layout>
    );
  }
};

export default TweetDetail;

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
