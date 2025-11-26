"use client"
import React, { useEffect, useRef } from 'react';

// --- Perlin Noise Implementation ---
// A self-contained implementation to generate organic terrain data
const PERM = new Uint8Array(512);
const P = new Uint8Array([151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180]);
for(let i=0; i<512; i++) PERM[i] = P[i & 255];

const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const lerp = (t: number, a: number, b: number) => a + t * (b - a);
const grad = (hash: number, x: number, y: number, z: number) => {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
}

const noise = (x: number, y: number, z: number) => {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const Z = Math.floor(z) & 255;
    x -= Math.floor(x);
    y -= Math.floor(y);
    z -= Math.floor(z);
    const u = fade(x), v = fade(y), w = fade(z);
    const A = PERM[X]+Y, AA = PERM[A]+Z, AB = PERM[A+1]+Z, B = PERM[X+1]+Y, BA = PERM[B]+Z, BB = PERM[B+1]+Z;
    return lerp(w, lerp(v, lerp(u, grad(PERM[AA], x, y, z), grad(PERM[BA], x-1, y, z)), lerp(u, grad(PERM[AB], x, y-1, z), grad(PERM[BB], x-1, y-1, z))), lerp(v, lerp(u, grad(PERM[AA+1], x, y, z-1), grad(PERM[BA+1], x-1, y, z-1)), lerp(u, grad(PERM[AB+1], x, y-1, z-1), grad(PERM[BB+1], x-1, y-1, z-1))));
}

export const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let flying = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const draw = () => {
      // Clear with slight transparency for trail effect if desired, or solid clear for crisp dots
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const w = canvas.width;
      const h = canvas.height;
      
      // Terrain Parameters
      const scale = 25; // Scale of the grid
      const cols = Math.floor(w / scale) + 10;
      const rows = Math.floor(h / scale) + 10;
      
      flying -= 0.005; // Speed of flight over terrain
      
      const terrainHeight = 120; // Amplitude of peaks

      // We render a grid of particles
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          
          // Use noise to determine Z (height)
          // We map grid coordinates to noise coordinates
          const noiseValue = noise(x * 0.1, y * 0.08 + flying, 0); 
          
          // Map noise (-1 to 1) to Screen Height modification
          // Peaks are negative Y (higher on screen), Valleys are positive Y (lower)
          // We tilt the plane to create depth
          
          const zHeight = noiseValue * terrainHeight;
          
          // Perspective projection simulation
          // X position is standard grid
          // Y position is grid + height + tilt
          
          const screenX = (x * scale) - (scale * 5); // Center offset
          const screenY = (y * scale * 0.6) - zHeight + (h * 0.2); // 0.6 squashes the Y to fake perspective
          
          // Coloring Logic
          // Noise goes approx -0.7 to 0.7 usually
          // Peak (High Negative Z visually, but let's just use raw noise value)
          // High noise = Peak = White
          // Low noise = Valley = Dark Blue
          
          const normalizedHeight = (noiseValue + 1) / 2; // 0 to 1
          
          // Thresholds
          const alpha = Math.max(0.1, normalizedHeight * 0.8); // Faint valleys, distinct peaks
          
          let r, g, b;
          
          if (normalizedHeight > 0.6) {
             // Peaks: White
             r = 255; g = 255; b = 255;
          } else {
             // Valleys: Dark Blue / Black
             // Interpolate from Black/Blue to Greyish
             const intensity = normalizedHeight * 150; 
             r = intensity;
             g = intensity;
             b = intensity + 40; // Add blue tint
          }
          
          ctx.fillStyle = `rgba(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)}, ${alpha})`;
          
          // Size varies with height for depth effect
          const radius = Math.max(0.8, normalizedHeight * 2.2);
          
          ctx.beginPath();
          ctx.arc(screenX, screenY, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 bg-black"
    />
  );
};