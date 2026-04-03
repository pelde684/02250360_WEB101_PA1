'use client';

export default function VideoCard({ post }) {
  if (!post) return null;

  return (
    <div className="bg-black text-white h-[400px] mb-6 rounded-lg flex flex-col justify-end p-4">
      <p className="font-semibold">{post.username}</p>
      <p className="text-sm">{post.caption}</p>
      <p className="text-xs text-gray-300">{post.audio}</p>

      <div className="flex gap-4 mt-2">
        <span>❤️ {post.likes}</span>
        <span>💬 {post.comments}</span>
        <span>🔁 {post.shares}</span>
      </div>
    </div>
  );
}