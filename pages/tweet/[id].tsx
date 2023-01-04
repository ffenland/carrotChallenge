import Layout from "@components/layout";
import OneTweet from "@components/tweet";
import type { Tweet } from "@prisma/client";
import { useRouter } from "next/router";
import useSWR from "swr";

export interface TweetWithUser extends Tweet {
  user: { email: string; nickname: string };
}

interface TweetResponse {
  ok: boolean;
  tweet: TweetWithUser;
}

const TweetDetail = () => {
  const router = useRouter();
  const tweetId = router.query.id;
  const { data } = useSWR<TweetResponse>(
    tweetId ? `/api/tweet/${tweetId}` : null
  );
  if (data && data.tweet) {
    const tweetCreatedDate = new Date(data.tweet.createdAt);
    const refinedDate = `${
      tweetCreatedDate.getMonth() + 1
    }월 ${tweetCreatedDate.getDate()}일 ${tweetCreatedDate.getHours()}시 ${tweetCreatedDate.getMinutes()}분`;
    return (
      <Layout title="Tweet">
        <div className="flex">
          <div className="IMAGE mr-2">
            <div className="rounded-full bg-gray-500 w-12 h-12 aspect-square"></div>
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
