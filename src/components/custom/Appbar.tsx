"use client";

import React from "react";

interface AppBarProps {
    title: string;
    onBack?: () => void;
}

export default function AppBar({ title, onBack }: AppBarProps) {
    return (
        <header
            style={{
                backgroundColor: "#fff",
                boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                padding: "0.75rem 1rem",
                position: "sticky",
                top: 0,
                zIndex: 1000,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            {onBack ? (
                <button
                    onClick={onBack}
                    aria-label="Back"
                    style={{
                        position: "absolute",
                        left: 16,
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {/* Chevron left SVG icon */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        stroke="#000"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        viewBox="0 0 24 24"
                    >
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                </button>
            ) : (
                <div style={{ width: 40 }} /> // spacer supaya title tetap di tengah kalau gak ada back button
            )}

            <h1
                style={{
                    margin: 0,
                    fontSize: "1.25rem",
                    fontWeight: "600",
                    color: "#000",
                    userSelect: "none",
                }}
            >
                {title}
            </h1>

            <div style={{ width: 40 }} /> {/* spacer kanan supaya judul tetap center */}
        </header>
    );
}
