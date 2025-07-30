import { useAtom } from "jotai";
import { devicesAtom, selectedDeviceAtom } from "./Atoms";

export function DeviceSelector() {
  const [devices] = useAtom(devicesAtom);
  const [selectedDevice, setSelectedDevice] = useAtom(selectedDeviceAtom);

  return devices.length > 0 ? (
    <div className="flex">
      <select
        className="px-3 w-full py-2 bg-neutral-800 hover:bg-neutral-700"
        value={selectedDevice || ""}
        onChange={(e) => {
          localStorage.setItem("selectedDevice", e.target.value);
          setSelectedDevice(e.target.value);
          e.target.blur();
        }}
      >
        {devices.map((device) => (
          <option
            key={device.deviceId}
            value={device.deviceId}
            className="bg-neutral-800"
          >
            {device.label.split("(")[0] || "Camera"}
          </option>
        ))}
      </select>
    </div>
  ) : null;
}
