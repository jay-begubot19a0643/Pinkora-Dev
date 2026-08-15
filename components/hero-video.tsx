'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = false;
    video.volume = 0.7;
    video.play()
      .then(() => setMuted(false))
      .catch(() => {
        video.muted = true;
        void video.play();
      });
  }, []);

  function toggleSound() {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setMuted(video.muted);
    void video.play();
  }

  return (
    <section className="next-video-hero">
      <video ref={videoRef} autoPlay muted loop playsInline preload="auto" aria-label="JVerse introduction">
        <source src="/Intro-1.mp4" type="video/mp4" />
      </video>
      <div className="next-video-hero-shade" aria-hidden="true" />
      <div className="next-container next-video-hero-content">
        <h1>JVerse</h1>
        <h2>Full-Stack Developer &amp; Innovator</h2>
        <h3>Hi, I&apos;m Jay-Be Gubot, founder of JVerse.</h3>
        <p>I build scalable systems for startups and SMEs—modern web applications and tools that help teams save time, reduce errors, and grow with confidence.</p>
        <div className="next-actions next-hero-actions">
          <Link href="/get-in-touch" className="next-button next-button-primary">Hire me</Link>
          <Link href="/portfolio" className="next-button next-button-hero-secondary">Book a free demo</Link>
        </div>
      </div>
      <button className="next-video-sound" type="button" onClick={toggleSound} aria-pressed={!muted}>
        {muted ? 'Enable sound' : 'Mute video'}
      </button>
    </section>
  );
}
