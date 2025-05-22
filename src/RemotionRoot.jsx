import { Composition } from 'remotion';
import VideoComposition from './components/VideoComposition';
import { channelData, videoData, yearlyStats } from './constants/videoData';

export const RemotionRoot = () => {
  return (
    <Composition
      id="ChannelVideo"
      component={VideoComposition}
      durationInFrames={2880}
      fps={60}
      width={1080}
      height={1920}
      defaultProps={{
        channelData,
        videoData,
        yearlyStats
      }}
    />
  );
}; 