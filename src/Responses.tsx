import { useAtom } from "jotai";
import { responseMapAtom, responseIdsAtom, showSentCanvasAtom } from "./Atoms";
import { useEffect, useRef } from "react";
import Markdown from "react-markdown";

export function Responses() {
  const [responseIds] = useAtom(responseIdsAtom);
  const [responseMap] = useAtom(responseMapAtom);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [responseMap]);

  return responseIds.length > 0 ? (
    <>
      <div className="h-8 shrink-0 w-full"></div>
      <div
        className="p-8 flex flex-col-reverse gap-8 overflow-auto w-full"
        ref={scrollRef}
      >
        {responseIds.map((responseId) => (
          <Response id={responseId} key={responseId} />
        ))}
      </div>
    </>
  ) : null;
}

function Response({ id: responseId }: { id: string }) {
  const [responseMap] = useAtom(responseMapAtom);
  const [showSentCanvas] = useAtom(showSentCanvasAtom);

  const response = responseMap[responseId];

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    if (showSentCanvas) {
      const responseCanvas = response.canvas;
      const canvas = canvasRef.current!;
      canvas.width = responseCanvas.width;
      canvas.height = responseCanvas.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(responseCanvas, 0, 0, canvas.width, canvas.height);
      }
    }
  }, [showSentCanvas]);

  const summary =
    response.text.split("SUMMARY")[1]?.split("APPEARANCE")[0].trim() || "";
  const transcription = response.text.split("TRANSCRIPTION")[1]?.trim() || "";

  return (
    <div
      className="whitespace-pre-wrap text-neutral-200 font-sans"
      key={responseId}
    >
      <div className="flex justify-between items-center mb-2">
        <div className="text-blue-100">GEMINI</div>
        <div className="text-neutral-200">
          {Math.round(response.elapsedTime / 100) / 10}s
        </div>
      </div>
      <div className="text-white py-3">
        <div>
          <div className="text-4xl font-bold mb-3">
            {summary.length > 0 ? (
              summary
            ) : (
              <span className="animate-pulse">...</span>
            )}
          </div>
          <div className="text-xl">
            {transcription.length > 0 ? transcription : null}
          </div>
        </div>
      </div>
      <div>
        {showSentCanvas ? (
          <canvas ref={canvasRef} className="mt-4 bg-neutral-200 w-40" />
        ) : null}
      </div>
    </div>
  );
}
