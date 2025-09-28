import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

function TooltipPortal({ text, anchorRect, visible }) {
  if (!visible || !anchorRect) return null;
  const style = {
    position: "fixed",
    top: anchorRect.top - 6,
    left: anchorRect.left + anchorRect.width / 2,
    transform: "translate(-50%, -100%)",
  };
  return createPortal(
    <div
      style={style}
      className="pointer-events-none z-50 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[10px] font-medium text-white shadow-md"
      role="tooltip"
    >
      {text}
    </div>,
    document.body
  );
}

function IconButton({ title, ariaLabel, className, onClick, children }) {
  const btnRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [rect, setRect] = useState(null);

  const refreshRect = () => {
    if (btnRef.current) {
      setRect(btnRef.current.getBoundingClientRect());
    }
  };

  useEffect(() => {
    if (!visible) return;
    refreshRect();
    const onScroll = () => refreshRect();
    const onResize = () => refreshRect();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [visible]);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        className={`inline-flex items-center justify-center h-8 w-8 rounded-md cursor-pointer ${className}`}
        aria-label={ariaLabel || title}
        onClick={onClick}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
      >
        {children}
      </button>
      <TooltipPortal text={title} anchorRect={rect} visible={visible} />
    </>
  );
}

// Static accent map to ensure Tailwind keeps these classes
const ACCENT_BUTTON_STYLES = {
  pink: "border border-pink-100 hover:border-pink-300 bg-pink-100 text-pink-800 hover:bg-pink-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 transition-colors",
  purple:
    "border border-purple-100 hover:border-purple-300 bg-purple-100 text-purple-800 hover:bg-purple-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 transition-colors",
  red: "border border-red-100 hover:border-red-300 bg-red-100 text-red-800 hover:bg-red-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 transition-colors",
  blue: "border border-blue-100 hover:border-blue-300 bg-blue-100 text-blue-800 hover:bg-blue-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 transition-colors",
  fuchsia:
    "border border-fuchsia-100 hover:border-fuchsia-300 bg-fuchsia-100 text-fuchsia-800 hover:bg-fuchsia-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 transition-colors",
  rose: "border border-rose-100 hover:border-rose-300 bg-rose-100 text-rose-800 hover:bg-rose-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 transition-colors",
  violet:
    "border border-violet-100 hover:border-violet-300 bg-violet-100 text-violet-800 hover:bg-violet-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 transition-colors",
  cyan: "border border-cyan-100 hover:border-cyan-300 bg-cyan-100 text-cyan-800 hover:bg-cyan-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 transition-colors",
  sky: "border border-sky-100 hover:border-sky-300 bg-sky-100 text-sky-800 hover:bg-sky-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 transition-colors",
  teal: "border border-teal-100 hover:border-teal-300 bg-teal-100 text-teal-800 hover:bg-teal-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 transition-colors",
};

export default function ActionButtons({
  accentKey,
  status,
  onDelete,
  onAnswered,
  onImportant,
}) {
  const accentClass =
    ACCENT_BUTTON_STYLES[accentKey] || ACCENT_BUTTON_STYLES.blue;
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="flex items-center gap-2">
      {/* Mark as Answered - only show if not already answered or important */}
      {status !== "answered" && status !== "important" && (
        <IconButton
          title="Mark as Answered"
          ariaLabel="Mark as Answered"
          onClick={onAnswered}
          className={accentClass}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m4.5 12.75 6 6 9-13.5"
            />
          </svg>
        </IconButton>
      )}

      {/* Mark as Important - always show, filled if status is important */}
      <IconButton
        title={
          status === "important" ? "Remove from Important" : "Mark as Important"
        }
        ariaLabel={
          status === "important" ? "Remove from Important" : "Mark as Important"
        }
        onClick={onImportant}
        className={accentClass}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill={status === "important" ? "currentColor" : "none"}
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
          />
        </svg>
      </IconButton>

      {/* Delete → Confirm/Cancel with width expand + crossfade/slide */}
      <span
        className={`relative inline-flex items-center overflow-visible h-10 py-1 transition-all duration-200 ease-out ${
          confirmDelete ? "w-[4.75rem]" : "w-9"
        }`}
      >
        {/* Delete layer */}
        <span
          className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ease-out ${
            confirmDelete
              ? "-translate-x-full opacity-0 pointer-events-none"
              : "translate-x-0 opacity-100"
          }`}
        >
          <IconButton
            title="Delete"
            ariaLabel="Delete"
            onClick={() => setConfirmDelete(true)}
            className={accentClass}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
          </IconButton>
        </span>

        {/* Confirm/Cancel layer */}
        <span
          className={`absolute inset-0 flex items-center justify-center gap-2 transition-all duration-200 ease-out ${
            confirmDelete
              ? "translate-x-0 opacity-100"
              : "translate-x-full opacity-0 pointer-events-none"
          }`}
        >
          {/* Confirm */}
          <IconButton
            title="Confirm Delete"
            ariaLabel="Confirm Delete"
            onClick={() => {
              onDelete?.();
              setConfirmDelete(false);
            }}
            className={accentClass}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </IconButton>
          {/* Cancel */}
          <IconButton
            title="Cancel"
            ariaLabel="Cancel"
            onClick={() => setConfirmDelete(false)}
            className={accentClass}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </IconButton>
        </span>
      </span>
    </div>
  );
}
