import OneTweet from "@components/tweet";
import useUser from "@lib/useUser";
import { Tweet } from "@prisma/client";
import React from "react";
import useSWR from "swr";
import { TweetWithUser } from "./tweet/[id]";

interface GetAllTweets {
  ok: boolean;
  tweets: TweetWithUser[];
}

const Home = () => {
  const { user } = useUser();
  const { data } = useSWR<GetAllTweets>("/api/tweet");
  return (
    <div>
      <header className="flex justify-between my-5">
        <span>LOGO</span>
        <div className="USERINFO flex space-x-3 items-center justify-center">
          <span className="font-bold">{user?.nickname}</span>
          <button className="p-1 border rounded-md hover:bg-black hover:text-white">
            LOGOUT
          </button>
        </div>
      </header>
      <div className="WRITE"></div>
      <div className="TWEETS space-y-2">
        {data?.tweets.map((tweet) => (
          <div
            key={tweet.id}
            className="border border-gray-100 p-3 shadow-md rounded-md"
          >
            <OneTweet tweet={tweet} />
          </div>
        ))}
      </div>
    </div>
  );
};
export default Home;
