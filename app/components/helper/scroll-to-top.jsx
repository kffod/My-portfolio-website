"use client";

import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa6";

const DEFAULT_BTN_CLS =
  "m-btn fixed bottom-8 right-6 z-50 flex items-center rounded-full border border-edge bg-surface p-4 text-white shadow-xl shadow-black/40 transition-colors duration-200 hover:border-accent hover:text-accent";
const SCROLL_THRESHOLD = 50;

const ScrollToTop = () => {
  const [btnCls, setBtnCls] = useState(DEFAULT_BTN_CLS);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > SCROLL_THRESHOLD) {
        setBtnCls(DEFAULT_BTN_CLS.replace(" hidden", ""));
      } else {
        setBtnCls(DEFAULT_BTN_CLS + " hidden");
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll, { passive: true });
    };
  }, []);

  const onClickBtn = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <button className={btnCls} onClick={onClickBtn}>
      <FaArrowUp />
    </button>
  );
};

export default ScrollToTop;
