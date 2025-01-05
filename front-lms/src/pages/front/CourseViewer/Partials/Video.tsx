import { Box } from "@chakra-ui/react";
import ReactPlayer from "react-player/youtube";

interface VideoProps {
  lesson: any;
}

const Video = ({ lesson }: VideoProps) => {
  const options = {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 1,
      controls: 1,
    },
  };

  function onReady(event) {
    event.target.pauseVideo();
  }

  return (
    <Box className="video-wrapper" rounded="md" overflow="hidden">
      <ReactPlayer
        className="react-player"
        url={lesson?.video}
        controls={true}
        width="100%"
        height="100%"
      />
    </Box>
  );
};

export default Video;
