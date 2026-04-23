import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

export const init = async ({ landmarkerRef, videoRef, streamRef }) => {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
  );
  landmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
    },
    outputFaceBlendshapes: true,
    runningMode: "VIDEO",
    numFaces: 1,
  });
  streamRef.current = await navigator.mediaDevices.getUserMedia({
    video: true,
  });
  videoRef.current.srcObject = streamRef.current;
  await videoRef.current.play();
};

export const stopStream = ({ landmarkerRef, videoRef, streamRef }) => {
  if (streamRef.current) {
    streamRef.current.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }
  if (videoRef.current) {
    videoRef.current.srcObject = null;
  }
  if (landmarkerRef.current) {
    landmarkerRef.current.close();
    landmarkerRef.current = null;
  }
};

// Runs detection in a loop until a non-neutral expression is found
export const detectLoop = ({
  landmarkerRef,
  videoRef,
  animationRef,
  onDetected,
}) => {
  const loop = () => {
    if (!landmarkerRef.current || !videoRef.current) return;

    const results = landmarkerRef.current.detectForVideo(
      videoRef.current,
      performance.now(),
    );

    if (results.faceBlendshapes?.length > 0) {
      const blendshapes = results.faceBlendshapes[0].categories;
      const getScore = (name) =>
        blendshapes.find((b) => b.categoryName === name)?.score || 0;

      const smileLeft = getScore("mouthSmileLeft");
      const smileRight = getScore("mouthSmileRight");
      const jawOpen = getScore("jawOpen");
      const browUp = getScore("browInnerUp");
      const frownLeft = getScore("mouthFrownLeft");
      const frownRight = getScore("mouthFrownRight");

      let currentExpression = "neutral";
      if (smileLeft > 0.5 && smileRight > 0.5) {
        currentExpression = "happy";
      } else if (jawOpen > 0.2 && browUp > 0.2) {
        currentExpression = "surprised";
      } else if (frownLeft > 0.00015 && frownRight > 0.00015) {
        currentExpression = "sad";
      }

      if (currentExpression !== "neutral") {
        onDetected(currentExpression); // ✅ stop loop, emit result
        return;
      }
    }

    animationRef.current = requestAnimationFrame(loop); // 🔁 keep looping
  };

  animationRef.current = requestAnimationFrame(loop);
};
