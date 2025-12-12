"use client";

import React from "react";

export default function LoadingCircular() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm z-50">
      <div className="flex flex-col items-center">
        {/* Circular Progress */}
        <svg
          className="w-12 h-12 animate-spin text-primary"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>

        {/* Text */}
        <p className="mt-4 text-sm text-muted-foreground">
          Loading
        </p>
      </div>
    </div>
  );
}
