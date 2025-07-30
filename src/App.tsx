import { useAtom } from "jotai";
import {
  showSettingsAtom,
} from "./Atoms";
import { useDevices } from "./useDevices";
import { Responses } from "./Responses";
import {
  SettingsIcon,
} from "lucide-react";
import { Keyboard } from "./Keyboard";
import { Settings } from "./Settings";

function App() {
  useDevices();
  const [showSettings, setShowSettings] = useAtom(showSettingsAtom);

  return (
    <div className="w-full h-[100dvh] bg-neutral-900 relative overflow-hidden flex flex-col">
      <button
        className={`absolute right-6 focus:outline-none top-4 flex items-center justify-center w-12 h-12 ${showSettings ? "bg-neutral-500 hover:bg-neutral-400" : "bg-neutral-800 hover:bg-neutral-700"} hover:bg-neutral-700 rounded-full`}
        onClick={() => setShowSettings((prev) => !prev)}
      >
        <SettingsIcon size={24} onClick={() => {}} />
      </button>
      {showSettings ? (
        <Settings />
      ) : (
        <div className="grow w-full flex flex-col overflow-hidden">
          <Responses />
        </div>
      )}
      <Keyboard />
    </div>
  );
}

export default App;
