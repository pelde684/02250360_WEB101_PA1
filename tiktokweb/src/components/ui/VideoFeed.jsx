'use client';

import VideoCard from "./VideoCard";

const DUMMY_POSTS = [
  {
    id: "1",
    username: "@user1",
    caption: "Check out this cool video!",
    audio: "Original Sound",
    likes: 120,
    comments: 30,
    shares: 10
  },
  {
    id: "2",
    username: "@user2",
    caption: "Learning dance 💃",
    audio: "Trending Music",
    likes: 340,
    comments: 50,
    shares: 20
  }
];

export default function VideoFeed() {
  return (
    <div className="max-w-[550px] mx-auto">
      {DUMMY_POSTS.map((post) => (
        <VideoCard key={post.id} post={post} />
      ))}
    </div>
  );
}