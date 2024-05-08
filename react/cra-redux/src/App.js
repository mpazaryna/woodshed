import React, { Component } from "react";
import "./App.css";
import SearchBar from "./components/search_bar";
import VideoList from "./components/video_list";
import VideoDetail from "./components/video_detail";
import _ from 'lodash';

const API_KEY = "AIzaSyBpuWN7UcS9YWwP9dC91pkwfPoMzJqc7mA";
import YTSearch from "youtube-api-search";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videos: [],
      selectedVideo: null
    };
    this.videoSearch("george harrison");
  }

  videoSearch(term) {
    YTSearch({ key: API_KEY, term: term }, videos => {
      this.setState({
        videos: videos,
        selectedVideo: videos[0]
      });
    });
  }

  render() {
    // throttle the search
    const videoSearch = _.debounce((term) => { this.videoSearch(term) }, 300);
    return (
      <div>
         <SearchBar onSearchTermChange={videoSearch} />
        <VideoDetail video={this.state.selectedVideo} />
        <VideoList
          onVideoSelect={selectedVideo => this.setState({ selectedVideo })}
          videos={this.state.videos}
        />
      </div>
    );
  }
}

export default App;
