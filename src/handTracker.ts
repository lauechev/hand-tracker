import { Hands, Results } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';

export interface HandData {
  landmarks: { x: number; y: number; z: number }[];
}

export type HandCallback = (hand: HandData | null) => void;

export function initHandTracker(videoElement: HTMLVideoElement, onResults: HandCallback): void {
  const hands = new Hands({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
  });

  hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.6,
    minTrackingConfidence: 0.5,
  });

  hands.onResults((results: Results) => {
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      onResults({ landmarks: results.multiHandLandmarks[0] });
    } else {
      onResults(null);
    }
  });

  const camera = new Camera(videoElement, {
    onFrame: async () => {
      await hands.send({ image: videoElement });
    },
    width: 640,
    height: 480,
  });

  camera.start();
}
