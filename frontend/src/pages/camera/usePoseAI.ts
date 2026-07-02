import { useEffect, useRef } from 'react';
import { PoseLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

export const usePoseAI = (videoRef: React.RefObject<HTMLVideoElement>, canvasRef: React.RefObject<HTMLCanvasElement>) => {
  useEffect(() => {
    let poseLandmarker: PoseLandmarker | null = null;
    
    const initAI = async () => {
      const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm");
      poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: { modelAssetPath: "...", delegate: "GPU" },
        runningMode: "VIDEO"
      });

      const loop = () => {
         // Тут твоя логіка з getAngle, drawLine та lastPoints...
         // Але це тепер ізольовано тут!
         requestAnimationFrame(loop);
      };
      loop();
    };

    initAI();
    return () => poseLandmarker?.close();
  }, [videoRef, canvasRef]);
};