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
  console.log(data?.tweet);
  if (data && data.tweet) {
    return <OneTweet tweet={data?.tweet} />;
  } else {
    return (
      <div>
        <span>No tweet</span>
      </div>
    );
  }
};

export default TweetDetail;
