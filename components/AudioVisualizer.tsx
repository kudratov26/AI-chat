"use client";

import React, { useEffect, useRef } from "react";
import { getAudioTools } from "@/lib/audio-context";

interface AudioVisualizerProps {
  isActive: boolean;
  isListening: boolean;
  color?: string;
  barWidth?: number;
  gap?: number;
}

export const AudioVisualizer = ({
  isActive,
  isListening,
  color = "#94a3b8", // slate-400 for minimalism
  barWidth = 2,
  gap = 1,
}: AudioVisualizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const micSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  useEffect(() => {
    const { ctx, analyser } = getAudioTools();
    if (!ctx || !analyser) return;

    if (isListening) {
      startMic(ctx, analyser);
    } else {
      stopMic();
    }

    if (isActive || isListening) {
      draw(analyser);
    } else {
      stopDrawing();
    }

    return () => {
      stopMic();
      stopDrawing();
    };
  }, [isActive, isListening]);

  const startMic = async (ctx: AudioContext, analyser: AnalyserNode) => {
    try {
      if (ctx.state === "suspended") await ctx.resume();

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);
      micSourceRef.current = source;
    } catch (err) {
      console.error("Error accessing microphone for visualizer:", err);
    }
  };

  const stopMic = () => {
    if (micSourceRef.current) {
      micSourceRef.current.disconnect();
      micSourceRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }
  };

  const stopDrawing = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const draw = (analyser: AnalyserNode) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const renderFrame = () => {
      animationFrameRef.current = requestAnimationFrame(renderFrame);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;
      const barCount = 12;

      for (let i = 0; i < barCount; i++) {
        const dataIndex = Math.floor((i / barCount) * (bufferLength / 2));
        const value = dataArray[dataIndex];
        const percent = value / 255;
        // Increased sensitivity for better animation
        const bHeight = Math.max(2, height * percent * 1.5);

        const x = (width / 2) - (barCount * (barWidth + gap) / 2) + i * (barWidth + gap);
        const y = (height - bHeight) / 2;

        ctx.fillStyle = color;
        if (ctx.roundRect) {
          ctx.roundRect(x, y, barWidth, bHeight, barWidth / 2);
        } else {
          ctx.rect(x, y, barWidth, bHeight);
        }
        ctx.fill();
      }
    };

    renderFrame();
  };

  return (
    <div className={`transition-all duration-500 ease-in-out flex justify-center items-center h-6 ${(isActive || isListening) ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
      <canvas
        ref={canvasRef}
        width={100}
        height={24}
        className="w-24 h-6 opacity-60"
      />
    </div>
  );
};
