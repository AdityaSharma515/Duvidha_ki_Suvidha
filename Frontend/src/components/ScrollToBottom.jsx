import React, { useEffect, useState } from 'react';
import { FaArrowDown } from 'react-icons/fa';

const ScrollToBottom = ({ showAfter = 100 }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      try {
        const scrolled = window.scrollY || document.documentElement.scrollTop;
        setShow(scrolled > showAfter);
      } catch (e) {
        // ignore in SSR / test env
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [showAfter]);

  const scrollToBottom = () => {
    try {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    } catch (e) {
      window.scrollTo(0, document.body.scrollHeight);
    }
  };

  if (!show) return null;

  return (
    <>
      <button
        className="scroll-bottom-btn"
        onClick={scrollToBottom}
        aria-label="Scroll to bottom"
        title="Scroll to bottom"
      >
        <FaArrowDown />
      </button>

      <style>{`
        .scroll-bottom-btn {
          position: fixed;
          right: 20px;
          bottom: 24px;
          width: 44px;
          height: 44px;
          border-radius: 9999px;
          background: #238636;
          border: 1px solid #1f6f2f;
          color: #fff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 18px rgba(2,6,23,0.6);
          cursor: pointer;
          z-index: 1200;
          transition: transform 0.15s ease, opacity 0.15s ease;
        }

        .scroll-bottom-btn:hover { transform: translateY(-3px); }

        .light .scroll-bottom-btn {
          background: #0369a1;
          border-color: #035f86;
          color: #fff;
        }
      `}</style>
    </>
  );
};

export default ScrollToBottom;
