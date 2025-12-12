"use client";

import React, { useState, useEffect } from "react";
import { Send, User, MessageCircle } from "lucide-react";

interface Wish {
  id: string;
  name: string;
  message: string;
  date: string;
}

export default function GuestBook() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedWishes = localStorage.getItem("wedding-wishes");
    if (savedWishes) {
      setWishes(JSON.parse(savedWishes));
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("wedding-wishes", JSON.stringify(wishes));
    }
  }, [wishes, mounted]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    const newWish: Wish = {
      id: Date.now().toString(),
      name: name.trim(),
      message: message.trim(),
      date: new Date().toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };

    setWishes([newWish, ...wishes]);
    setName("");
    setMessage("");
  };

  if (!mounted) return null;

  return (
    <section className="py-20 px-6 bg-secondary/20 relative z-10">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-great-vibes text-primary mb-4">
            Guest Book
          </h2>
          <p className="text-muted-foreground font-playfair">
            Send your warm wishes to the couple
          </p>
        </div>

        {/* Form */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-primary/10 mb-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground/70 mb-2 font-playfair">
                Your Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/40" size={18} />
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-secondary/10 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-playfair"
                  placeholder="Enter your name"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-foreground/70 mb-2 font-playfair">
                Your Message
              </label>
              <div className="relative">
                <MessageCircle className="absolute left-3 top-4 text-primary/40" size={18} />
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-secondary/10 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-playfair min-h-[120px]"
                  placeholder="Write your wishes here..."
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-white font-playfair py-3 rounded-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <Send size={18} />
              Send Wishes
            </button>
          </form>
        </div>

        {/* Wishes List */}
        <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          {wishes.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground font-playfair italic">
              Be the first to send a wish!
            </div>
          ) : (
            wishes.map((wish) => (
              <div
                key={wish.id}
                className="bg-white p-6 rounded-xl shadow-sm border border-primary/10 animate-fade-in hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <span className="font-great-vibes text-lg">{wish.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <h4 className="font-bold text-primary font-playfair text-lg">
                      {wish.name}
                    </h4>
                  </div>
                  <span className="text-xs text-muted-foreground font-playfair">
                    {wish.date}
                  </span>
                </div>
                <p className="text-foreground/80 font-playfair leading-relaxed pl-10">
                  {wish.message}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
