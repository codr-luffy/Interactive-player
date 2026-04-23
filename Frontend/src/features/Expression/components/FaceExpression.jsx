import { useRef, useState } from "react";
import { detectLoop, init, stopStream } from "../utils/utils.js";
import "../../shared/style/button.scss";

export default function FaceExpression({ onClick = () => {} }) {
  const videoRef = useRef(null);
  const landmarkerRef = useRef(null);
  const streamRef = useRef(null);
  const animationRef = useRef(null);

  const [expression, setExpression] = useState(null); // null = idle
  const [detecting, setDetecting] = useState(false);

  async function handleDetect() {
    setExpression(null);
    setDetecting(true);

    await init({ landmarkerRef, videoRef, streamRef });

    detectLoop({
      landmarkerRef,
      videoRef,
      animationRef,
      onDetected: (expr) => {
        // ✅ Cancel animation loop
        cancelAnimationFrame(animationRef.current);

        // ✅ Stop camera
        stopStream({ landmarkerRef, videoRef, streamRef });

        // ✅ Update UI
        setExpression(expr);
        setDetecting(false);

        // ✅ Bubble up
        onClick(expr);
      },
    });
  }

  return (
    <div style={{ textAlign: "center" }}>
      {/* Video only shown while detecting */}
      <video
        ref={videoRef}
        style={{
          width: "320px",
          borderRadius: "12px",
          display: detecting ? "block" : "none",
        }}
        playsInline
      />

      {expression && <h2>😊 Detected: {expression}</h2>}
      {detecting && <h2>🔍 Detecting...</h2>}

      {/* Hide button while detecting */}
      {!detecting && (
        <button className="button" onClick={handleDetect}>
          {expression ? "Detect Again" : "Detect Expression"}
        </button>
      )}
    </div>
  );
}
