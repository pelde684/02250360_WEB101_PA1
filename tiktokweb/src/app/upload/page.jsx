export default function UploadPage() {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Upload Video</h1>
      <div className="flex">
        <div className="flex-1 border-dashed border-2 border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-center">
          <label className="text-gray-500 mb-2">---Select video to upload---</label>
          <p className="text-sm text-gray-400 mb-4">or drag and drop a file</p>
          <p className="text-sm text-gray-400 mb-4">MP4 or WebM</p>
          <p className="text-xs text-gray-400 mb-4">720x1280 resolution or higher</p>
          <p className="text-xs text-gray-400">Up to 10 minutes</p>
          <p className="text-sm text-gray-400">less than 2 GB</p>
          <button className="bg-red-500 text-white px-4 py-2 rounded-md">
            Select file
          </button>
        </div>
      </div>
      <div className="flex mt-8">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">Caption</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            placeholder="Add a caption..."
          />
        </div>
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium mb-2">Cover</label>
        <input type="text" className="w-full p-2 border rounded-md" />
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium mb-2">Who can view this video</label>
        <select className="w-full p-2 border rounded-md">
          <option>Public</option>
          <option>Friends</option>
          <option>Private</option>
        </select>
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium mb-2">Allow users to</label>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <input type="checkbox" id="comments" className="mr-2" />
            <label htmlFor="comments">Comments</label>
          </div>
          <div className="flex items-center">
            <input type="checkbox" id="duet" className="mr-2" />
            <label htmlFor="duet">Duet</label>
          </div>
          <div className="flex items-center">
            <input type="checkbox" id="stitch" className="mr-2" />
            <label htmlFor="stitch">Stitch</label>
          </div>
        </div>
      </div>
      <div className="flex space-x-4 mt-8">
        <button className="px-4 py-2 border rounded-md">Discard</button>
        <button className="px-4 py-2 bg-red-500 text-white rounded-md">Post</button>
      </div>
    </div>
  );
}