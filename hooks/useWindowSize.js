"use client";

import { useEffect, useState } from "react";

// Hook theo dõi kích thước cửa sổ trình duyệt
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    height: 0,
    width: 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return windowSize;
};

export default useWindowSize;
