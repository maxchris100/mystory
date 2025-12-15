"use client";

import React, { useEffect, useState, useRef } from "react";
import { Heart, Calendar, MapPin, Camera, MailOpen } from "lucide-react";
import MusicPlayer, { MusicPlayerHandle } from "@/components/custom/MusicPlayer";
import GuestBook from "@/components/custom/GuestBook";

export default function WeddingPage() {
  const [mounted, setMounted] = useState(false);
  const [isInvitationOpened, setIsInvitationOpened] = useState(false);
  const musicPlayerRef = useRef<MusicPlayerHandle>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleOpenInvitation = () => {
    setIsInvitationOpened(true);
    if (musicPlayerRef.current) {
      musicPlayerRef.current.playMusic();
    }
    // Scroll to top when opened
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <MusicPlayer ref={musicPlayerRef} />

      {/* Cover Overlay (Invitation Envelope) */}
      <div
        className={`fixed inset-0 z-50 bg-background flex flex-col items-center justify-center transition-transform duration-1000 ease-in-out ${isInvitationOpened ? '-translate-y-full' : 'translate-y-0'}`}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 text-primary/20 animate-float animation-delay-200">
            <Heart size={48} />
          </div>
          <div className="absolute bottom-20 right-10 text-primary/10 animate-float animation-delay-400">
            <Heart size={64} />
          </div>
        </div>

        <div className="text-center space-y-8 p-6 relative z-10 animate-fade-in">
          <p className="text-xl md:text-2xl font-cinzel tracking-[0.3em] text-foreground/80 uppercase">
            The Wedding Of
          </p>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-great-vibes text-primary drop-shadow-sm p-4">
            Romeo & Juliet
          </h1>
          <div className="flex items-center justify-center gap-4 text-foreground/80 mt-4">
            <span className="h-[1px] w-12 bg-primary/50"></span>
            <p className="text-2xl md:text-3xl font-cinzel tracking-widest">25 . 12 . 2025</p>
            <span className="h-[1px] w-12 bg-primary/50"></span>
          </div>

          <button
            onClick={handleOpenInvitation}
            className="mt-12 px-8 py-4 bg-primary text-white font-cinzel text-lg tracking-widest rounded-full hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-3 mx-auto animate-pulse"
          >
            <MailOpen size={24} />
            <span>Open Invitation</span>
          </button>
        </div>
      </div>

      {/* Floating Elements Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-10 left-10 text-primary/20 animate-float animation-delay-200">
          <Heart size={48} />
        </div>
        <div className="absolute top-40 right-20 text-primary/20 animate-float animation-delay-600">
          <Heart size={32} />
        </div>
        <div className="absolute bottom-20 left-1/4 text-primary/10 animate-float animation-delay-400">
          <Heart size={64} />
        </div>
        <div className="absolute top-1/2 right-10 text-primary/10 animate-float">
          <Heart size={56} />
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center p-6 z-10">
        <div className="animate-fade-in space-y-6">
          <p className="text-xl md:text-2xl font-cinzel tracking-[0.3em] text-foreground/80 uppercase">
            The Wedding Of
          </p>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-great-vibes text-primary drop-shadow-sm p-4">
            Romeo & Juliet
          </h1>
          <div className="flex items-center justify-center gap-4 text-foreground/80 mt-4">
            <span className="h-[1px] w-12 bg-primary/50"></span>
            <p className="text-2xl md:text-3xl font-cinzel tracking-widest">Save The Date</p>
            <span className="h-[1px] w-12 bg-primary/50"></span>
          </div>
          <div className="mt-8 p-4 border border-primary/30 rounded-full inline-flex items-center gap-3 bg-white/50 backdrop-blur-sm shadow-sm animate-pulse">
            <Calendar className="text-primary" size={24} />
            <span className="text-lg font-cinzel font-semibold tracking-wider">
              December 25, 2025
            </span>
          </div>
        </div>

        <div className="absolute bottom-10 animate-bounce text-primary/50">
          <p className="text-sm font-cinzel tracking-widest mb-2">Scroll Down</p>
          <div className="w-[1px] h-12 bg-primary/50 mx-auto"></div>
        </div>
      </section>

      {/* Venue Section */}
      <section className="py-20 px-6 md:px-20 bg-secondary/30 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-great-vibes text-primary mb-10 animate-fade-in">
            The Venue
          </h2>

          <div className="bg-white/80 backdrop-blur-md p-8 md:p-12 rounded-t-[100px] rounded-b-[20px] shadow-xl border border-primary/20 hover:shadow-2xl transition-shadow duration-500 transform hover:-translate-y-1">
            <div className="flex flex-col items-center gap-6">
              <div className="p-4 bg-primary/10 rounded-full text-primary">
                <MapPin size={40} />
              </div>
              <div>
                <h3 className="text-3xl font-cinzel font-bold text-foreground mb-2 tracking-wide">
                  The Ritz-Carlton
                </h3>
                <p className="text-muted-foreground font-playfair italic text-lg">
                  Grand Ballroom
                </p>
              </div>
              <div className="w-full h-[1px] bg-border my-2"></div>
              <p className="text-foreground/80 leading-relaxed font-playfair text-lg">
                Join us for an evening of love, laughter, and happily ever after
                at one of the most prestigious venues.
              </p>
              <button className="px-8 py-3 bg-primary text-white font-cinzel tracking-widest rounded-full hover:bg-primary/90 transition-colors shadow-lg text-sm">
                View Map
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery / Story Section (Empty Frames) */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-great-vibes text-primary mb-4">
              Our Moments
            </h2>
            <p className="text-muted-foreground font-cinzel tracking-wider">
              Capturing our journey together
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="group relative aspect-[3/4] bg-white p-4 shadow-md rotate-1 hover:rotate-0 transition-transform duration-500 ease-in-out"
              >
                <div className="w-full h-full border-2 border-dashed border-primary/30 bg-secondary/20 flex flex-col items-center justify-center text-primary/40 gap-3 group-hover:bg-secondary/30 transition-colors">
                  <Camera size={32} />
                  <span className="font-cinzel text-xs tracking-[0.2em]">INSERT PHOTO HERE</span>
                </div>
                {/* Tape effect */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-8 bg-white/90 shadow-sm rotate-[-2deg] opacity-80"></div>
              </div>
            ))}
          </div>

          {/* Wide Frame */}
          <div className="mt-12 max-w-4xl mx-auto">
            <div className="bg-white p-4 shadow-lg -rotate-1 hover:rotate-0 transition-transform duration-500">
              <div className="w-full aspect-video border-2 border-dashed border-primary/30 bg-secondary/20 flex flex-col items-center justify-center text-primary/40 gap-3">
                <Camera size={48} />
                <span className="font-cinzel text-sm tracking-[0.2em] text-center px-4">INSERT PRE-WEDDING VIDEO/PHOTO HERE</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guest Book Section */}
      <GuestBook />

      {/* Footer */}
      <footer className="py-12 bg-primary text-primary-foreground text-center relative z-10">
        <div className="font-great-vibes text-4xl mb-4">Thank You</div>
        <p className="font-cinzel tracking-widest text-xs opacity-90 uppercase">
          {"Can't wait to celebrate with you!"}
        </p>
      </footer>
    </main>
  );
}
