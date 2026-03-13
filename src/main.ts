import { initHandTracker, HandData } from './handTracker';
import { createScene } from './scene';
import { updateFromHand, applyToParticles, isHandDetected } from './objectController';
import { drawHandOverlay } from './handOverlay';

const canvas = document.getElementById('scene-canvas') as HTMLCanvasElement;
const statusEl = document.getElementById('status') as HTMLDivElement;

const { particles, basePositions, camera, animate } = createScene(canvas);

// Hidden video element for webcam feed
const video = document.createElement('video');
video.style.display = 'none';
document.body.appendChild(video);

let currentHand: HandData | null = null;

initHandTracker(video, (hand) => {
  currentHand = hand;
  updateFromHand(hand);
});

function loop(): void {
  requestAnimationFrame(loop);
  const time = performance.now() / 1000;
  applyToParticles(particles, basePositions, camera, time);
  drawHandOverlay(video, currentHand);
  statusEl.textContent = isHandDetected() ? 'tracking' : 'no hand';
}

animate();
loop();
