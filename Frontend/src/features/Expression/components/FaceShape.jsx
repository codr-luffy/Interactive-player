import { useEffect, useRef, useState } from "react";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

const GLASSES_DATA = {
  "Oval 🥚": {
    frames: ["Wayfarer", "Aviator", "Square", "Cat-Eye"],
    avoid: ["Round frames"],
    tip: "Lucky you! Almost every frame style suits an oval face.",
    color: "#00c896",
  },
  "Round 🔵": {
    frames: ["Rectangle", "Square", "Wayfarer", "Geometric"],
    avoid: ["Round / circular frames"],
    tip: "Angular frames add definition and make the face look longer.",
    color: "#4e9eff",
  },
  "Square 🟦": {
    frames: ["Round", "Oval", "Aviator", "Cat-Eye"],
    avoid: ["Square / boxy frames"],
    tip: "Soft, curved frames balance a strong jawline beautifully.",
    color: "#a78bfa",
  },
  "Heart 💜": {
    frames: ["Aviator", "Oval", "Light Rimless", "Bottom-heavy frames"],
    avoid: ["Cat-Eye", "Top-heavy frames"],
    tip: "Wider-at-bottom frames balance a broader forehead.",
    color: "#f472b6",
  },
  "Oblong 🟥": {
    frames: ["Oversized", "Round", "Square", "Decorative temples"],
    avoid: ["Narrow / small frames"],
    tip: "Wide, tall frames add width and break the length visually.",
    color: "#fb923c",
  },
};

const FRAME_SHAPES = {
  Wayfarer: (ctx, x, y, w, h) => {
    ctx.beginPath();
    ctx.moveTo(x, y + h * 0.3);
    ctx.lineTo(x + w * 0.1, y);
    ctx.lineTo(x + w * 0.9, y);
    ctx.lineTo(x + w, y + h * 0.3);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x, y + h);
    ctx.closePath();
    ctx.stroke();
  },
  Aviator: (ctx, x, y, w, h) => {
    ctx.beginPath();
    ctx.moveTo(x + w * 0.5, y + h * 0.1);
    ctx.bezierCurveTo(x + w * 0.9, y, x + w, y + h * 0.5, x + w * 0.9, y + h);
    ctx.bezierCurveTo(
      x + w * 0.6,
      y + h * 1.1,
      x + w * 0.4,
      y + h * 1.1,
      x + w * 0.1,
      y + h,
    );
    ctx.bezierCurveTo(x, y + h * 0.5, x + w * 0.1, y, x + w * 0.5, y + h * 0.1);
    ctx.closePath();
    ctx.stroke();
  },
  Square: (ctx, x, y, w, h) => {
    ctx.strokeRect(x, y, w, h);
  },
  Rectangle: (ctx, x, y, w, h) => {
    ctx.strokeRect(x, y, w, h * 0.7);
  },
  Round: (ctx, x, y, w, h) => {
    ctx.beginPath();
    ctx.arc(x + w / 2, y + h / 2, Math.min(w, h) / 2, 0, Math.PI * 2);
    ctx.stroke();
  },
  Oval: (ctx, x, y, w, h) => {
    ctx.beginPath();
    ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
    ctx.stroke();
  },
  "Cat-Eye": (ctx, x, y, w, h) => {
    ctx.beginPath();
    ctx.moveTo(x, y + h * 0.5);
    ctx.bezierCurveTo(x, y + h * 0.1, x + w * 0.6, y, x + w, y);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x, y + h);
    ctx.closePath();
    ctx.stroke();
  },
  Geometric: (ctx, x, y, w, h) => {
    const cx = x + w / 2,
      cy = y + h / 2;
    ctx.beginPath();
    ctx.moveTo(cx, y);
    ctx.lineTo(x + w, cy);
    ctx.lineTo(cx, y + h);
    ctx.lineTo(x, cy);
    ctx.closePath();
    ctx.stroke();
  },
  Oversized: (ctx, x, y, w, h) => {
    ctx.beginPath();
    ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2 + 6, 0, 0, Math.PI * 2);
    ctx.stroke();
  },
  "Light Rimless": (ctx, x, y, w, h) => {
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(x, y, w, h);
    ctx.setLineDash([]);
  },
  "Bottom-heavy frames": (ctx, x, y, w, h) => {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + w, y);
    ctx.lineTo(x + w, y + h * 0.6);
    ctx.bezierCurveTo(x + w, y + h, x, y + h, x, y + h * 0.6);
    ctx.closePath();
    ctx.stroke();
  },
  "Decorative temples": (ctx, x, y, w, h) => {
    ctx.strokeRect(x, y, w, h);
    ctx.beginPath();
    ctx.moveTo(x - 8, y);
    ctx.lineTo(x - 8, y - 6);
    ctx.moveTo(x + w + 8, y);
    ctx.lineTo(x + w + 8, y - 6);
    ctx.stroke();
  },
};

export default function FaceExpression() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const landmarkerRef = useRef(null);
  const animationRef = useRef(null);
  const [shape, setShape] = useState("Detecting...");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let stream;
    const init = async () => {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
      );
      landmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
        },
        outputFaceBlendshapes: false,
        runningMode: "VIDEO",
        numFaces: 1,
      });
      stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      setReady(true);
      detect();
    };

    const detect = () => {
      if (!landmarkerRef.current || !videoRef.current) return;
      const results = landmarkerRef.current.detectForVideo(
        videoRef.current,
        performance.now(),
      );
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      if (results.faceLandmarks?.length > 0) {
        const lm = results.faceLandmarks[0];

        // Draw face mesh
        const CONNECTIONS = FaceLandmarker.FACE_LANDMARKS_TESSELATION;
        ctx.strokeStyle = "rgba(0, 200, 150, 0.45)";
        ctx.lineWidth = 0.8;
        if (CONNECTIONS) {
          for (const conn of CONNECTIONS) {
            const s = lm[conn.start],
              e = lm[conn.end];
            if (!s || !e) continue;
            ctx.beginPath();
            ctx.moveTo(s.x * canvas.width, s.y * canvas.height);
            ctx.lineTo(e.x * canvas.width, e.y * canvas.height);
            ctx.stroke();
          }
        }

        // Key landmarks
        const faceTop = lm[10];
        const faceBottom = lm[152];
        const leftCheek = lm[234];
        const rightCheek = lm[454];
        const leftJaw = lm[172];
        const rightJaw = lm[397];
        const foreheadL = lm[70];
        const foreheadR = lm[300];
        const leftEyeL = lm[33];
        const leftEyeR = lm[133];
        const rightEyeL = lm[362];
        const rightEyeR = lm[263];

        const faceHeight = Math.abs(faceBottom.y - faceTop.y);
        const cheekWidth = Math.abs(rightCheek.x - leftCheek.x);
        const jawWidth = Math.abs(rightJaw.x - leftJaw.x);
        const foreheadWidth = Math.abs(foreheadR.x - foreheadL.x);
        const ratio = faceHeight / cheekWidth;
        const jawRatio = jawWidth / cheekWidth;
        const foreheadRatio = foreheadWidth / cheekWidth;

        let detectedShape = "Oval 🥚";
        if (ratio > 1.75) detectedShape = "Oblong 🟥";
        else if (jawRatio > 0.85 && foreheadRatio > 0.85 && ratio < 1.4)
          detectedShape = "Square 🟦";
        else if (jawRatio > 0.85 && ratio < 1.5) detectedShape = "Round 🔵";
        else if (foreheadRatio > jawRatio + 0.1) detectedShape = "Heart 💜";
        setShape(detectedShape);

        // Draw glasses overlay on face
        const eyeY =
          ((leftEyeL.y + leftEyeR.y + rightEyeL.y + rightEyeR.y) / 4) *
          canvas.height;
        const leftX = leftEyeL.x * canvas.width;
        const rightX = rightEyeR.x * canvas.width;
        const totalW = rightX - leftX;
        const frameW = totalW * 0.46;
        const frameH = frameW * 0.55;
        const gap = totalW * 0.08;
        const centerX = (leftX + rightX) / 2;
        const frameColor = GLASSES_DATA[detectedShape]?.color || "#00c896";

        const drawGlassesFrame = (shapeName, x, y, w, h) => {
          const fn = FRAME_SHAPES[shapeName] || FRAME_SHAPES["Oval"];
          ctx.save();
          ctx.strokeStyle = frameColor;
          ctx.lineWidth = 2.5;
          fn(ctx, x, y, w, h);
          ctx.restore();
        };

        const recommended = GLASSES_DATA[detectedShape]?.frames[0] || "Oval";

        // Left lens
        drawGlassesFrame(
          recommended,
          centerX - gap / 2 - frameW,
          eyeY - frameH / 2,
          frameW,
          frameH,
        );
        // Right lens
        drawGlassesFrame(
          recommended,
          centerX + gap / 2,
          eyeY - frameH / 2,
          frameW,
          frameH,
        );
        // Bridge
        ctx.save();
        ctx.strokeStyle = frameColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX - gap / 2, eyeY);
        ctx.lineTo(centerX + gap / 2, eyeY);
        ctx.stroke();
        ctx.restore();
      }

      animationRef.current = requestAnimationFrame(detect);
    };

    init();
    return () => {
      cancelAnimationFrame(animationRef.current);
      landmarkerRef.current?.close();
      videoRef.current?.srcObject?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const info = GLASSES_DATA[shape];

  return (
    <div
      style={{
        textAlign: "center",
        background: "#0a0a0f",
        minHeight: "100vh",
        padding: "20px",
        fontFamily: "monospace",
      }}
    >
      <h2 style={{ color: "#00c896", marginBottom: "16px" }}>
        Face Shape + Glasses Advisor
      </h2>

      <video ref={videoRef} style={{ display: "none" }} playsInline />

      <canvas
        ref={canvasRef}
        style={{
          borderRadius: "16px",
          border: "2px solid #00c896",
          maxWidth: "100%",
          width: "480px",
        }}
      />

      <div style={{ marginTop: "20px", color: "white" }}>
        <h3 style={{ color: "#00c896" }}>Face Shape: {shape}</h3>

        {info && (
          <div
            style={{
              background: "#111",
              borderRadius: "12px",
              padding: "16px 20px",
              maxWidth: "460px",
              margin: "0 auto",
              textAlign: "left",
              border: "1px solid #222",
            }}
          >
            <p
              style={{ color: "#aaa", fontSize: "13px", marginBottom: "12px" }}
            >
              {info.tip}
            </p>

            <p
              style={{
                color: "#00c896",
                fontWeight: "bold",
                marginBottom: "6px",
              }}
            >
              ✅ Best frames for you:
            </p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                marginBottom: "14px",
              }}
            >
              {info.frames.map((f, i) => (
                <span
                  key={i}
                  style={{
                    background: i === 0 ? info.color : "#1e1e2e",
                    color: i === 0 ? "#000" : "#ccc",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "13px",
                    fontWeight: i === 0 ? "bold" : "normal",
                    border: i === 0 ? "none" : "1px solid #333",
                  }}
                >
                  {i === 0 ? "⭐ " : ""}
                  {f}
                </span>
              ))}
            </div>

            <p
              style={{
                color: "#ff6b6b",
                fontWeight: "bold",
                marginBottom: "6px",
              }}
            >
              ❌ Avoid:
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {info.avoid.map((f, i) => (
                <span
                  key={i}
                  style={{
                    background: "#2a1010",
                    color: "#ff6b6b",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "13px",
                    border: "1px solid #ff6b6b44",
                  }}
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
