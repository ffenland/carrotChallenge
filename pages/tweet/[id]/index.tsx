import Layout from "@components/layout";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "@lib/withSession";
import type { Tweet } from "@prisma/client";
import { useRouter } from "next/router";
import useSWR from "swr";
import Button from "@components/button";

export interface TweetWithUser extends Tweet {
  user: { email: string; nickname: string };
}

interface TweetResponse {
  ok: boolean;
  tweet: TweetWithUser;
}

interface SessionUser {
  user: { id: string };
}

const TweetDetail = ({ user }: SessionUser) => {
  const router = useRouter();
  const tweetId = router.query.id;
  const { data } = useSWR<TweetResponse>(
    tweetId ? `/api/tweet/${tweetId}` : null
  );
  const onEditClick = () => {
    router.push(`/tweet/${tweetId}/edit`);
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
              <span className="font-bold text-4xl mr-[2px] text-orange-100">
                {data.tweet.user.nickname[0]}
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
            <div className="flex justify-end space-x-5 items-center px-5">
              <div className="space-x-1">
                <span>Like</span>
                <span>1k</span>
              </div>
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
