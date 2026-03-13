import { initHandTracker } from './handTracker';
import { createScene } from './scene';
import { updateFromHand, applyToMesh, isHandDetected } from './objectController';

const canvas = document.getElementById('scene-canvas') as HTMLCanvasElement;
const statusEl = document.getElementById('status') as HTMLDivElement;

const { mesh, animate } = createScene(canvas);

// Hidden video element for webcam feed
const video = document.createElement('video');
video.style.display = 'none';
document.body.appendChild(video);

initHandTracker(video, (hand) => {
  updateFromHand(hand);
});

// Override animate to include controller updates
function loop(): void {
  requestAnimationFrame(loop);
  applyToMesh(mesh);
  statusEl.textContent = isHandDetected() ? 'tracking' : 'no hand';
}

// Start the Three.js render loop and our controller loop
animate();
loop();
