import * as THREE from 'three';
import type { HandData } from './handTracker';

const VIBRATE_AMOUNT = 0.015;
const ZOOM_LERP = 0.06;
const MIN_ZOOM = 1.5;
const MAX_ZOOM = 8;

let handDetected = false;
let pinchDistance = 1; // normalised 0-1ish
let targetZoom = 5; // camera z

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function updateFromHand(hand: HandData | null): void {
  if (hand) {
    handDetected = true;
    const thumb = hand.landmarks[4];
    const index = hand.landmarks[8];

    // Euclidean distance between thumb tip and index tip
    const dx = thumb.x - index.x;
    const dy = thumb.y - index.y;
    const dz = thumb.z - index.z;
    pinchDistance = Math.sqrt(dx * dx + dy * dy + dz * dz);

    // Map pinch to zoom: pinch = zoom out, open hand = zoom in
    // Typical range ~0.03 (pinched) to ~0.25 (open)
    const normalized = Math.min(Math.max((pinchDistance - 0.03) / 0.22, 0), 1);
    targetZoom = MAX_ZOOM - normalized * (MAX_ZOOM - MIN_ZOOM);
  } else {
    handDetected = false;
    targetZoom = 5;
  }
}

export function applyToParticles(
  particles: THREE.Points,
  basePositions: Float32Array,
  camera: THREE.PerspectiveCamera,
  time: number
): void {
  // Vibrate particles
  const posAttr = particles.geometry.getAttribute('position') as THREE.BufferAttribute;
  const pos = posAttr.array as Float32Array;

  for (let i = 0; i < pos.length; i += 3) {
    // Each particle gets a unique phase from its base position
    const phase = basePositions[i] * 31.7 + basePositions[i + 1] * 17.3 + basePositions[i + 2] * 23.1;
    pos[i] = basePositions[i] + Math.sin(time * 3 + phase) * VIBRATE_AMOUNT;
    pos[i + 1] = basePositions[i + 1] + Math.cos(time * 2.7 + phase * 1.3) * VIBRATE_AMOUNT;
    pos[i + 2] = basePositions[i + 2] + Math.sin(time * 3.3 + phase * 0.7) * VIBRATE_AMOUNT;
  }
  posAttr.needsUpdate = true;

  // Smooth zoom
  camera.position.z = lerp(camera.position.z, targetZoom, ZOOM_LERP);
}

export function isHandDetected(): boolean {
  return handDetected;
}
