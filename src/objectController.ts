import type * as THREE from 'three';
import type { HandData } from './handTracker';

const LERP_FACTOR = 0.08;
const IDLE_SPEED = 0.005;

let targetX = 0;
let targetY = 0;
let targetRotX = 0;
let targetRotY = 0;
let handDetected = false;
let idleAngle = 0;

function lerp(current: number, target: number, factor: number): number {
  return current + (target - current) * factor;
}

export function updateFromHand(hand: HandData | null): void {
  if (hand) {
    handDetected = true;
    const wrist = hand.landmarks[0];
    const middleTip = hand.landmarks[12];

    // Mirror X so movement feels natural, map to world range [-2, 2]
    const normalizedX = 1 - wrist.x;
    targetX = (normalizedX - 0.5) * 4;
    targetY = (0.5 - wrist.y) * 4;

    // Angle from wrist to middle fingertip drives rotation
    const dx = middleTip.x - wrist.x;
    const dy = middleTip.y - wrist.y;
    targetRotY = dx * Math.PI * 2;
    targetRotX = dy * Math.PI * 2;
  } else {
    handDetected = false;
  }
}

export function applyToMesh(mesh: THREE.Mesh): void {
  if (handDetected) {
    mesh.position.x = lerp(mesh.position.x, targetX, LERP_FACTOR);
    mesh.position.y = lerp(mesh.position.y, targetY, LERP_FACTOR);
    mesh.rotation.x = lerp(mesh.rotation.x, targetRotX, LERP_FACTOR);
    mesh.rotation.y = lerp(mesh.rotation.y, targetRotY, LERP_FACTOR);
  } else {
    // Slowly return to center
    mesh.position.x = lerp(mesh.position.x, 0, LERP_FACTOR * 0.5);
    mesh.position.y = lerp(mesh.position.y, 0, LERP_FACTOR * 0.5);

    // Idle rotation
    idleAngle += IDLE_SPEED;
    mesh.rotation.x = lerp(mesh.rotation.x, Math.sin(idleAngle) * 0.3, LERP_FACTOR);
    mesh.rotation.y = lerp(mesh.rotation.y, idleAngle, LERP_FACTOR);
  }
}

export function isHandDetected(): boolean {
  return handDetected;
}
