import { useState } from "react";

export default function Header({ activeView, onViewChange }) {
  const tabs = [
    { id: "kanban", label: "Kanban View" },
    { id: "unanswered", label: "Unanswered" },
    { id: "answered", label: "Answered" },
    { id: "important", label: "Important" },
  ];

  const activeIndex = tabs.findIndex((tab) => tab.id === activeView);

  return (
    <header className="h-[10vh] bg-gradient-to-r from-slate-50 via-white to-slate-50 backdrop-blur-sm border-b border-slate-200/60 flex items-center justify-between px-8">
      <div className="flex items-center gap-3">
     
        <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
          SSD Lecture 14th June
        </h1>
      </div>

      <div
        className="relative bg-white/80 backdrop-blur-sm rounded-xl p-1.5 flex shadow-lg border border-slate-200/60"
        style={{ width: "36.5rem" }}
      >
        {/* Sliding active indicator */}
        <div
          className="absolute top-1.5 bottom-1.5 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg transition-all duration-300 ease-out shadow-md border border-indigo-400/20"
          style={{
            left: `calc(0.375rem + ${activeIndex * 9}rem)`,
            width: "9rem",
          }}
        />

        {/* Tab buttons */}
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            onClick={() => onViewChange(tab.id)}
            className={`relative z-10 py-2.5 text-sm font-medium rounded-lg flex items-center justify-center cursor-pointer text-center ${
              activeView === tab.id
                ? "text-white"
                : "text-slate-600 hover:text-slate-800"
            }`}
            style={{
              width: "9rem",
              margin: 0,
              padding: "0.625rem 0",
              border: "none",
              outline: "none",
            }}
          >
            <span className="block w-full text-center font-medium">
              {tab.label}
            </span>
          </button>
        ))}
      </div>
    </header>
  );
}
