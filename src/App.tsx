import { useAtom } from "jotai";
import { responseIdsAtom, responseMapAtom, showSettingsAtom } from "./Atoms";
import { useDevices } from "./useDevices";
import { Responses } from "./Responses";
import { SettingsIcon } from "lucide-react";
import { Keyboard } from "./Keyboard";
import { Settings } from "./Settings";

function App() {
  useDevices();
  const [showSettings, setShowSettings] = useAtom(showSettingsAtom);

  return (
    <div className="w-full h-[100dvh] bg-neutral-900 relative overflow-hidden flex flex-col">
      <BackgroundColor />
      <button
        className={`absolute right-6 focus:outline-none top-4 flex items-center justify-center w-12 h-12 ${showSettings ? "bg-neutral-500 bg-opacity-50 hover:bg-neutral-400" : "bg-neutral-800 bg-opacity-50 hover:bg-neutral-700"} hover:bg-neutral-700 rounded-full`}
        onClick={() => setShowSettings((prev) => !prev)}
      >
        <SettingsIcon size={24} onClick={() => {}} />
      </button>
      {showSettings ? (
        <Settings />
      ) : (
        <div className="grow w-full relative flex flex-col overflow-hidden">
          <Responses />
        </div>
      )}
      <Keyboard />
    </div>
  );
}

export default App;

function BackgroundColor() {
  const [responseMap] = useAtom(responseMapAtom);
  const [responseIds] = useAtom(responseIdsAtom);

  const lastResponseId = responseIds[responseIds.length - 1];
  const lastResponse = responseMap[lastResponseId];
  const backgroundColor = lastResponse ? lastResponse.text : "transparent";
  return (
    <div
      className="absolute inset-0 transition-colors duration-500"
      style={{ backgroundColor }}
    ></div>
  );
}
