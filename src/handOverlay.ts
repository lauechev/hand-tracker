import { HAND_CONNECTIONS } from '@mediapipe/hands';
import type { HandData } from './handTracker';

const canvas = document.getElementById('hand-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

export function drawHandOverlay(video: HTMLVideoElement, hand: HandData | null): void {
  const w = canvas.width;
  const h = canvas.height;

  // Draw mirrored video feed
  ctx.save();
  ctx.scale(-1, 1);
  ctx.drawImage(video, -w, 0, w, h);
  ctx.restore();

  // Dark filter overlay
  ctx.fillStyle = 'rgba(0, 0, 0, 0.77)';
  ctx.fillRect(0, 0, w, h);

  if (!hand) return;

  const lm = hand.landmarks;

  // Draw connections
  ctx.strokeStyle = 'rgba(0, 255, 60, 0.5)';
  ctx.lineWidth = 2;
  for (const [i, j] of HAND_CONNECTIONS) {
    ctx.beginPath();
    ctx.moveTo((1 - lm[i].x) * w, lm[i].y * h);
    ctx.lineTo((1 - lm[j].x) * w, lm[j].y * h);
    ctx.stroke();
  }

  // Draw nodes
  ctx.fillStyle = '#00ff3c';
  for (const pt of lm) {
    ctx.beginPath();
    ctx.arc((1 - pt.x) * w, pt.y * h, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}
