import React from 'react';

// functional component - no state is required, lightweight and fast

const VideoDetail = ({video}) => {

  // make sure a video detail is availble, otherwise give a loading message
  if (!video) {
    return <div>Loading...</div>;
  }

  // interpolation needs a backtick
  const videoId = video.id.videoId;
  const url = `https://www.youtube.com/embed/${videoId}`;

  return (
    <div className="video-detail col-md-8">
      <div className="embed-responsive embed-responsive-16by9">
        <iframe className="embed-responsive-item" src={url}></iframe>
      </div>
      <div className="details">
        <div>{video.snippet.title}</div>
        <div>{video.snippet.description}</div>
      </div>
    </div>
  );
};

export default VideoDetail;
