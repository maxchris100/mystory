"use client";

import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { Play, Pause, SkipForward, SkipBack, Music2, Volume2, VolumeX } from "lucide-react";

const PLAYLIST = [
  {
    title: "Canon in D",
    artist: "Pachelbel",
    src: "https://ia800504.us.archive.org/11/items/PachelbelCanonInDMajor/Pachelbel%20Canon%20in%20D%20Major.mp3",
  },
  {
    title: "Wedding March",
    artist: "Mendelssohn",
    src: "https://ia800300.us.archive.org/21/items/CanonInD_201604/Canon%20in%20D.mp3", // Alternative classical track
  },
];

export interface MusicPlayerHandle {
  playMusic: () => void;
  stopMusic: () => void;
}

const MusicPlayer = forwardRef<MusicPlayerHandle>((props, ref) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = PLAYLIST[currentTrackIndex];

  useImperativeHandle(ref, () => ({
    playMusic: () => {
      setIsPlaying(true);
      setIsOpen(true); // Auto open player when triggered
    },
    stopMusic: () => {
      setIsPlaying(false);
    }
  }));

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((e) => {
          console.log("Autoplay blocked, waiting for user interaction", e);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
    setIsPlaying(true);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 flex items-end gap-2">
      {/* Player Control */}
      <div
        className={`
           bg-white/90 backdrop-blur-md border border-primary/20 rounded-2xl p-4 shadow-2xl
           transition-all duration-500 ease-in-out origin-bottom-left overflow-hidden
           ${isOpen ? 'w-64 opacity-100 scale-100' : 'w-0 h-0 opacity-0 scale-0 p-0 border-0'}
         `}
      >
        <div className="flex flex-col gap-3 min-w-[200px]">
          <div className="flex items-center gap-3 border-b border-primary/10 pb-2">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary animate-spin-slow">
              <Music2 size={20} />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold truncate text-primary font-playfair">{currentTrack.title}</p>
              <p className="text-xs text-muted-foreground truncate font-playfair">{currentTrack.artist}</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-primary">
            <button onClick={prevTrack} className="hover:text-primary/70 transition-colors">
              <SkipBack size={20} />
            </button>
            <button
              onClick={togglePlay}
              className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90 shadow-md transition-transform hover:scale-105"
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-1" />}
            </button>
            <button onClick={nextTrack} className="hover:text-primary/70 transition-colors">
              <SkipForward size={20} />
            </button>
          </div>

          <div className="flex items-center justify-end">
            <button onClick={toggleMute} className="text-primary/60 hover:text-primary transition-colors">
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
           w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300
           ${isOpen ? 'bg-secondary text-primary' : 'bg-primary text-white animate-pulse'}
         `}
      >
        <Music2 size={20} />
      </button>

      <audio
        ref={audioRef}
        src={currentTrack.src}
        onEnded={nextTrack}
        loop={false}
      />
    </div>
  );
});

MusicPlayer.displayName = "MusicPlayer";
export default MusicPlayer;
