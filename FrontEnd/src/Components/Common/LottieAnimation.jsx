// import React from 'react';
import Lottie from 'react-lottie';
// import animationData from './path-to-your-lottie-json.json';

const LottieAnimation = ({path}) => {
  const defaultOptions = {
    loop: true,
    autoplay: true, 
    animationData: path,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return (
    <>
      <Lottie options={defaultOptions}
        height={400}
        width={400}
      />
    </>
  );
}

export default LottieAnimation;
