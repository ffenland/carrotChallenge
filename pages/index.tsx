import Button from "@components/button";
import FloatingButton from "@components/floatingButton";
import Layout from "@components/layout";
import OneTweet from "@components/tweet";
import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";
import { TweetWithUser } from "./tweet/[id]";

interface GetAllTweets {
  ok: boolean;
  tweets: TweetWithUser[];
}

const Home = () => {
  const router = useRouter();
  const { data } = useSWR<GetAllTweets>("/api/tweet");
  return (
    <Layout title="Home">
      <div>
        <div className="TWEETS space-y-2">
          {data?.tweets?.map((tweet) => (
            <div
              key={tweet.id}
              className="border border-gray-100 p-3 shadow-md rounded-md"
            >
              <OneTweet tweet={tweet} />
            </div>
          ))}
        </div>
        <div className="WRITE mt-5 shadow-md">
          <Button
            title="Write New Tweet"
            type="large"
            onClick={() => {
              router.push("/tweet/write");
            }}
          />
        </div>
      </div>
    </Layout>
  );
};
export default Home;
