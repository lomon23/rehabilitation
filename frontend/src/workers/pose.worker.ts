import { PoseLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
let poseLandmarker: PoseLandmarker;

// 1. Ініціалізація MediaPipe (виконується один раз)
async function init() {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
  );
  poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task`,
      delegate: "GPU"
    },
    runningMode: "VIDEO"
  });
}

init();

// 2. Слухач повідомлень від головного потоку
self.onmessage = async (e: MessageEvent) => {
  const { frame, timestamp } = e.data;

  if (!poseLandmarker) return;

  // Виконуємо інференс
  const results = poseLandmarker.detectForVideo(frame, timestamp);
  
  // Відправляємо назад результати (тільки landmarks, без зайвого)
  self.postMessage({
    landmarks: results.landmarks[0] || null
  });
};