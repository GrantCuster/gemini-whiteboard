import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { ResponseType } from "./Types";
import { startingPrompt } from "./consts";

export const devicesAtom = atom<MediaDeviceInfo[]>([]);
export const selectedDeviceAtom = atom<string | null>(null);
export const videoSizeAtom = atom<{ width: number; height: number } | null>(
  null,
);

export const cropBoxAtom = atomWithStorage<{
  x: number;
  y: number;
  width: number;
  height: number;
} | null>("cropBox", null);


export const responseIdsAtom = atom<string[]>([]);
export const responseMapAtom = atom<Record<string, ResponseType>>({});

export const showSettingsAtom = atom(false);

const flippedHorizontallyStorageCheck = localStorage.getItem(
  "flippedHorizontally",
);
const flippedVerticallyStorageCheck = localStorage.getItem("flippedVertically");
export const stateRef = {
  flippedHorizontally: flippedHorizontallyStorageCheck
    ? flippedHorizontallyStorageCheck === "true"
    : true,
  flippedVertically: flippedVerticallyStorageCheck
    ? flippedVerticallyStorageCheck === "true"
    : false,
};

export const showSentCanvasAtom = atomWithStorage<boolean>(
  "showSentCanvas",
  true,
);

// TODO: revert
// export const promptAtom = atomWithStorage<string>("prompt", startingPrompt);
export const promptAtom = atom<string>(startingPrompt);
