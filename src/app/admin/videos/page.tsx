"use client";

import { useState, useEffect } from "react";

interface VideoTutorial {
  id: string;
  title: string;
  videoUrl: string;
  tags: string[];
}

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<VideoTutorial[]>([]);
  const [filterTag, setFilterTag] = useState("");
  const [newVideo, setNewVideo] = useState({ title: "", videoUrl: "", tags: "" });

  useEffect(() => {
    async function fetchVideos() {
      const response = await fetch("/api/admin/videos");
      const data = await response.json();
      setVideos(data);
    }
    fetchVideos();
  }, []);

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArray = newVideo.tags.split(",").map((tag) => tag.trim());
    const response = await fetch("/api/admin/videos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newVideo, tags: tagsArray }),
    });

    if (response.ok) {
      const createdVideo = await response.json();
      setVideos((prev) => [...prev, createdVideo]);
      setNewVideo({ title: "", videoUrl: "", tags: "" });
    } else {
      alert("Failed to add video tutorial");
    }
  };

  const filteredVideos = filterTag
    ? videos.filter((video) => video.tags.includes(filterTag))
    : videos;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Video Tutorials</h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Filter by tag"
          value={filterTag}
          onChange={(e) => setFilterTag(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      <form onSubmit={handleAddVideo} className="mb-6">
        <h2 className="text-xl font-bold mb-2">Add New Video Tutorial</h2>
        <input
          type="text"
          placeholder="Title"
          value={newVideo.title}
          onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
          className="border p-2 rounded w-full mb-2"
        />
        <input
          type="text"
          placeholder="Video URL"
          value={newVideo.videoUrl}
          onChange={(e) => setNewVideo({ ...newVideo, videoUrl: e.target.value })}
          className="border p-2 rounded w-full mb-2"
        />
        <input
          type="text"
          placeholder="Tags (comma-separated)"
          value={newVideo.tags}
          onChange={(e) => setNewVideo({ ...newVideo, tags: e.target.value })}
          className="border p-2 rounded w-full mb-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Add Video
        </button>
      </form>

      <h2 className="text-xl font-bold mb-2">Video Tutorials</h2>
      <ul>
        {filteredVideos.map((video) => (
          <li key={video.id} className="border p-4 rounded mb-2">
            <h3 className="text-lg font-bold">{video.title}</h3>
            <p>
              <a href={video.videoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                {video.videoUrl}
              </a>
            </p>
            <p>Tags: {video.tags.join(", ")}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
