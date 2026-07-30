'use client';

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
      <button className="next-video-sound" type="button" onClick={toggleSound} aria-pressed={!muted}>
        {muted ? 'Enable sound' : 'Mute video'}
      </button>
    </section>
  );
}
