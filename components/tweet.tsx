import Image from "next/image";

interface tweetProp {
    id:string;
}

const Tweet = ({ tweet }) => {

  return (
    <div className="flex">
      <div className="IMAGE">
        <div className="rounded-full bg-gray-500 w-8 h-8 aspect-square"></div>
      </div>
      <div className="w-full">
        <div>
          <span>JohnDoe</span>
          <span>@Johny</span>
          <span>1월 5일</span>
        </div>
        <div>
          <p>Hi, lorem ipsum</p>
        </div>
        <div className="flex justify-around items-center">
          <div>
            <span>VIEW</span>
            <span>231k</span>
          </div>
          <div>
            <span>Like</span>
            <span>1k</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tweet;
