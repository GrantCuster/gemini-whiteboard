import { createUserContent } from "@google/genai";
import { useAtom } from "jotai";
import { useRef, useEffect } from "react";
import { ai } from "./ai";

import {
  responseIdsAtom,
  responseMapAtom,
  cropBoxAtom,
  promptAtom,
  stateRef,
} from "./Atoms";

export const canvasBuffer = document.createElement("canvas");
export const cbx = canvasBuffer.getContext("2d")!;

export function Keyboard() {
  const [, setResponseIds] = useAtom(responseIdsAtom);
  const [, setResponseMap] = useAtom(responseMapAtom);
  const [cropBox] = useAtom(cropBoxAtom);
  const [prompt] = useAtom(promptAtom);

  const textStreamRef = useRef("");
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    async function handleKeyDown(event: KeyboardEvent) {
      if (event.key === " ") {
        event.preventDefault();
        const $video = document.getElementById(
          "webcam-video",
        ) as HTMLVideoElement;
        if ($video) {
          const newId = crypto.randomUUID();
          const $canvas = document.createElement("canvas");
          setResponseIds((prev) => [...prev, newId]);
          setResponseMap((prev) => ({
            ...prev,
            [newId]: {
              id: newId,
              text: "",
              elapsedTime: 0,
              canvas: $canvas,
            },
          }));
          const timeInterval = setInterval(() => {
            setResponseMap((prev) => {
              const updatedResponse = {
                ...prev[newId],
                elapsedTime: Date.now() - startTimeRef.current,
              };
              return {
                ...prev,
                [newId]: updatedResponse,
              };
            });
          }, 100);

          textStreamRef.current = "";
          startTimeRef.current = Date.now();

          const ctx = $canvas.getContext("2d");
          if (ctx) {
            canvasBuffer.width = $video.videoWidth;
            canvasBuffer.height = $video.videoHeight;

            cbx.save();
            if (stateRef.flippedHorizontally) {
              cbx.scale(-1, 1);
              cbx.translate(-canvasBuffer.width, 0);
            }
            if (stateRef.flippedVertically) {
              cbx.scale(1, -1);
              cbx.translate(0, -canvasBuffer.height);
            }

            cbx.drawImage($video, 0, 0, $video.videoWidth, $video.videoHeight);

            if (cropBox) {
              const cropX = (cropBox.x / 100) * $video.videoWidth;
              const cropY = (cropBox.y / 100) * $video.videoHeight;
              const cropWidth = (cropBox.width / 100) * $video.videoWidth;
              const cropHeight = (cropBox.height / 100) * $video.videoHeight;

              $canvas.width = cropWidth;
              $canvas.height = cropHeight;
              ctx.drawImage(
                canvasBuffer,
                cropX,
                cropY,
                cropWidth,
                cropHeight,
                0,
                0,
                cropWidth,
                cropHeight,
              );
            } else {
              const maxSize = 2048;
              const scale = Math.min(
                maxSize / $video.videoWidth,
                maxSize / $video.videoHeight,
              );

              $canvas.width = $video.videoWidth * scale;
              $canvas.height = $video.videoHeight * scale;
              ctx.drawImage(
                canvasBuffer,
                0,
                0,
                $video.videoWidth,
                $video.videoHeight,
                0,
                0,
                $canvas.width,
                $canvas.height,
              );
            }
            ctx.restore();

            const dataUrl = $canvas.toDataURL("image/png");

            const response = await ai!.models.generateContentStream({
              // model: "gemini-2.5-flash-lite",
              model: "gemini-2.5-flash",
              contents: createUserContent([
                prompt,
                {
                  inlineData: {
                    mimeType: "image/png",
                    data: dataUrl.split(",")[1], // Extract base64 part
                  },
                },
              ]),
              config: {
                thinkingConfig: {
                  thinkingBudget: 0, // Disables thinking
                },
              },
            });

            for await (const chunk of response) {
              if (chunk.candidates && chunk.candidates.length > 0) {
                clearInterval(timeInterval);
                textStreamRef.current += chunk.text;
                setResponseMap((prev) => {
                  const updatedResponse = {
                    ...prev[newId],
                    text: textStreamRef.current,
                    elapsedTime: Date.now() - startTimeRef.current,
                  };
                  return {
                    ...prev,
                    [newId]: updatedResponse,
                  };
                });
              }
            }
          } else {
            console.error("Failed to get canvas context.");
          }
        } else {
          console.error("Video or canvas element not found.");
        }
      }

      if (event.key === "c") {
        setResponseIds([]);
        setResponseMap({});
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [cropBox, prompt]);

  return null;
}
