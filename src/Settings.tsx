import { useAtom } from "jotai";
import { promptAtom, showSentCanvasAtom, stateRef } from "./Atoms";
import { FlipHorizontal2Icon, FlipVertical2Icon } from "lucide-react";
import { CameraPreview } from "./CameraPreview";
import { startingPrompt } from "./consts";
import { DeviceSelector } from "./DeviceSelector";

export function Settings() {
  const [showSentCanvas, setShowSentCanvas] = useAtom(showSentCanvasAtom);
  const [prompt, setPrompt] = useAtom(promptAtom);

  return (
    <div className="w-full h-[100dvh] overflow-auto bg-neutral-900 flex flex-col px-3">
      <div className="px-3 uppercase mb-3 py-8 text-neutral-400">Settings</div>
      <div className="flex gap-3 items-center px-3 mb-3">
        <div>Camera:</div>
        <DeviceSelector />
        <button
          className="h-[4ch] flex items-center justify-center w-12 bg-neutral-800 hover:bg-neutral-700 rounded-full"
          onClick={() => {
            localStorage.setItem(
              "flippedHorizontally",
              String(!stateRef.flippedHorizontally),
            );
            stateRef.flippedHorizontally = !stateRef.flippedHorizontally;
          }}
        >
          <FlipHorizontal2Icon size={20} />
        </button>
        <button
          className="h-[4ch] flex items-center justify-center w-12 bg-neutral-800 hover:bg-neutral-700 rounded-full"
          onClick={() => {
            localStorage.setItem(
              "flippedVertically",
              String(!stateRef.flippedVertically),
            );
            stateRef.flippedVertically = !stateRef.flippedVertically;
          }}
        >
          <FlipVertical2Icon size={20} />
        </button>
      </div>
      <CameraPreview />
      <div className="px-1">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="cursor-pointer ml-2"
            checked={showSentCanvas}
            onChange={(e) => {
              setShowSentCanvas(e.target.checked);
            }}
          />
          Show sent image thumbnail in feed
        </label>
      </div>
      <div className="px-3 mt-4">
        <div className="flex justify-between">
          <div>Prompt</div>
          {prompt !== startingPrompt ? (
            <button
              className="underline"
              onClick={() => {
                setPrompt(startingPrompt);
              }}
            >
              Reset
            </button>
          ) : null}
        </div>
        <textarea
          className="w-full resize-none h-[360px] mb-4 focus:outline-none bg-neutral-800 text-neutral-200 p-2 rounded mt-2"
          value={prompt}
          onChange={(e) => {
            setPrompt(e.target.value);
          }}
          placeholder="Enter your prompt here..."
        />
      </div>
    </div>
  );
}


