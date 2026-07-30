'use client';

import { useEffect, useRef } from 'react';

export function PortraitCutout({ src, alt }: { src: string; alt: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const image = new window.Image();
    image.src = src;
    image.onload = () => {
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext('2d', { willReadFrequently: true });
      if (!context) return;

      context.drawImage(image, 0, 0);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const { data } = imageData;
      const pixels = canvas.width * canvas.height;
      const removed = new Uint8Array(pixels);
      const queue = new Int32Array(pixels);
      let head = 0;
      let tail = 0;

      const isPlainBackground = (pixel: number) => {
        const offset = pixel * 4;
        const red = data[offset];
        const green = data[offset + 1];
        const blue = data[offset + 2];
        return red > 228 && green > 228 && blue > 228 && Math.max(red, green, blue) - Math.min(red, green, blue) < 18;
      };
      const enqueue = (pixel: number) => {
        if (!removed[pixel] && isPlainBackground(pixel)) {
          removed[pixel] = 1;
          queue[tail++] = pixel;
        }
      };

      for (let x = 0; x < canvas.width; x += 1) {
        enqueue(x);
        enqueue((canvas.height - 1) * canvas.width + x);
      }
      for (let y = 1; y < canvas.height - 1; y += 1) {
        enqueue(y * canvas.width);
        enqueue(y * canvas.width + canvas.width - 1);
      }
      while (head < tail) {
        const pixel = queue[head++];
        const x = pixel % canvas.width;
        const y = Math.floor(pixel / canvas.width);
        if (x > 0) enqueue(pixel - 1);
        if (x < canvas.width - 1) enqueue(pixel + 1);
        if (y > 0) enqueue(pixel - canvas.width);
        if (y < canvas.height - 1) enqueue(pixel + canvas.width);
      }
      for (let pixel = 0; pixel < pixels; pixel += 1) {
        if (removed[pixel]) data[pixel * 4 + 3] = 0;
      }

      context.putImageData(imageData, 0, 0);
      canvas.classList.add('is-ready');
    };
  }, [src]);

  return <canvas ref={canvasRef} className="next-hero-portrait-cutout" role="img" aria-label={alt} />;
}
