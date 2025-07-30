import { useEffect, useRef } from "react";
import { idealResolution } from "./consts";
import {
  selectedDeviceAtom,
  devicesAtom,
  videoSizeAtom,
} from "./Atoms";
import { useAtom } from "jotai";

const video = document.createElement("video");
video.style.position = "absolute";
video.style.left = "0";
video.style.top = "0";
video.style.opacity = "0";
video.style.pointerEvents = "none";
video.autoplay = true;
video.playsInline = true;
video.muted = true;
video.id = "webcam-video";
document.body.appendChild(video);

export function useDevices() {
  const [devices, setDevices] = useAtom(devicesAtom);
  const [selectedDevice, setSelectedDevice] = useAtom(selectedDeviceAtom);
  const [, setVideoSize] = useAtom(videoSizeAtom);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    async function handleDeviceChange() {
      if (!selectedDevice) return;
      if (streamRef.current) {
        video.srcObject = null;
        streamRef.current.getTracks().forEach((track) => track.stop());
        setVideoSize(null);
      }
      streamRef.current = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: { exact: selectedDevice },
          width: { ideal: idealResolution.width },
        },
      });
      video.srcObject = streamRef.current;
      video.onloadedmetadata = () => {
        if (video.videoWidth && video.videoHeight) {
          setVideoSize({
            width: video.videoWidth,
            height: video.videoHeight,
          });
        }
      };
    }
    handleDeviceChange();
    return () => {
      if (streamRef.current) {
        video.srcObject = null;
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [selectedDevice]);

  useEffect(() => {
    const getCameras = async () => {
      try {
        // Trigger the browser to ask for permission to use the camera
        await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: idealResolution.width },
          },
        });
        const devices = await navigator.mediaDevices.enumerateDevices();
        let videoDevices = devices.filter(
          (device) => device.kind === "videoinput",
        );

        setDevices(videoDevices);

        if (videoDevices.length > 0) {
          const storageCheck = localStorage.getItem("selectedDevice");
          if (storageCheck) {
            if (videoDevices.some((d) => d.deviceId === storageCheck)) {
              // if the stored device is still available, use it
              setSelectedDevice(storageCheck);
            } else {
              setSelectedDevice(videoDevices[0].deviceId);
            }
          } else {
            // do not store - only when the user selects a device
            const initialDeviceId = videoDevices[0].deviceId;
            setSelectedDevice(initialDeviceId);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };
    getCameras();
    function handleDeviceChange() {
      getCameras();
    }
    navigator.mediaDevices.addEventListener("devicechange", handleDeviceChange);
    return () => {
      navigator.mediaDevices.removeEventListener(
        "devicechange",
        handleDeviceChange,
      );
    };
  }, []);

  return {
    devices,
  };
}
