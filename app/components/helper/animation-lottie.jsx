"use client";

import dynamic from "next/dynamic";

// lottie-web touches `document` as soon as it is imported, which breaks server-side
// pre-rendering ("ReferenceError: document is not defined"). Load it in the browser only.
const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
  loading: () => <div style={{ width: "95%", aspectRatio: "1 / 1" }} />,
});

const AnimationLottie = ({ animationPath, width }) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationPath,
    style: {
      width: width || '95%',
    }
  };

  return (
    <Lottie {...defaultOptions} />
  );
};

export default AnimationLottie;
