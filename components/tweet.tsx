import Link from "next/link";
import type { TweetWithUser } from "pages/tweet/[id]";

const Tweet = ({ tweet }: { tweet: TweetWithUser }) => {
  const tweetCreatedDate = new Date(tweet.createdAt);
  const refinedDate = `${
    tweetCreatedDate.getMonth() + 1
  }월 ${tweetCreatedDate.getDate()}일 ${tweetCreatedDate.getHours()}시 ${tweetCreatedDate.getMinutes()}분`;
  return (
    <Link href={`/tweet/${tweet.id}`}>
      <div className="flex cursor-pointer">
        <div className="IMAGE mr-2">
          <div className="rounded-full bg-gray-500 w-12 h-12 aspect-square"></div>
        </div>
        <div className="w-full">
          <div className="mt-1 space-x-1">
            <span className="font-bold">{tweet.user.nickname}</span>
            <span className="text-sm text-gray-600">{tweet.user.email}</span>
            <span className="text-sm text-gray-600">{refinedDate}</span>
          </div>
          <div>
            <p>{tweet.text}</p>
          </div>
          <div className="flex justify-end space-x-5 items-center px-5">
            <div className="space-x-1">
              <span>Like</span>
              <span>1k</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Tweet;
