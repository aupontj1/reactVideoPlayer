import VideoPlayer from './comps/VideoPlayer';
import MyVideo from './assets/coverr-active-morning-jog-on-cobblestone-1080p.mp4';
import MyThumbnail from './assets/joshua-kettle-tr1nv_cLVP0-unsplash.jpg';
import './App.css';

function App() {

  return (
    <>
      <div className='video-wrapper'>
        <VideoPlayer src={MyVideo} thumbnail={MyThumbnail}/>
      </div>
    </>
  )
}

export default App;
