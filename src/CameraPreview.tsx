import { useAtom } from "jotai";
import { useRef, useEffect } from "react";
import { selectedDeviceAtom, cropBoxAtom, videoSizeAtom, stateRef } from "./Atoms";

export function CameraPreview() {
    const [selectedDevice] = useAtom(selectedDeviceAtom);
    const [cropBox, setCropBox] = useAtom(cropBoxAtom);
    const [videoSize] = useAtom(videoSizeAtom);

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const requestRef = useRef<number | null>(null);

    useEffect(() => {
        function draw() {
            const video = document.getElementById("webcam-video") as HTMLVideoElement;
            const canvas = canvasRef.current;

            if (video && canvas) {
                const ctx = canvas.getContext("2d");
                if (ctx) {
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;

                    ctx.save();

                    if (stateRef.flippedHorizontally) {
                        ctx.scale(-1, 1);
                        ctx.translate(-canvas.width, 0);
                    }
                    if (stateRef.flippedVertically) {
                        ctx.scale(1, -1);
                        ctx.translate(0, -canvas.height);
                    }

                    ctx.drawImage(
                        video,
                        0,
                        0,
                        video.videoWidth,
                        video.videoHeight,
                        0,
                        0,
                        canvas.width,
                        canvas.height
                    );
                    ctx.restore();
                }
            }

            requestRef.current = requestAnimationFrame(draw);
        }
        draw();

        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, [selectedDevice]);

    const startDragRef = useRef<{ x: number; y: number; } | null>(null);

    const canvasContainerRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        function handleResize() {
            const canvasContainer = canvasContainerRef.current;
            const canvas = canvasRef.current;
            if (canvasContainer && canvas) {
                const rect = canvas.getBoundingClientRect();
                canvasContainer.style.width = `${rect.width}px`;
                canvasContainer.style.height = `${rect.height}px`;
            }
        }
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div className="px-3 flex">
            <div className="flex flex-col">
                <div className="relative" ref={canvasContainerRef}>
                    <canvas
                        className="w-full h-auto cursor-crosshair max-w-[1280px] max-h-[720px]"
                        ref={canvasRef}
                        onPointerDown={(e) => {
                            (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
                            const rect = (
                                e.target as HTMLCanvasElement
                            ).getBoundingClientRect();
                            const startX = ((e.clientX - rect.left) / rect.width) * 100;
                            const startY = ((e.clientY - rect.top) / rect.height) * 100;
                            startDragRef.current = { x: startX, y: startY };
                            setCropBox({
                                x: startX,
                                y: startY,
                                width: 0,
                                height: 0,
                            });
                        }}
                        onPointerMove={(e) => {
                            if (startDragRef.current) {
                                const rect = (
                                    e.target as HTMLCanvasElement
                                ).getBoundingClientRect();
                                const currentX = ((e.clientX - rect.left) / rect.width) * 100;
                                const currentY = ((e.clientY - rect.top) / rect.height) * 100;
                                const minX = Math.max(
                                    0,
                                    Math.min(startDragRef.current.x, currentX)
                                );
                                const minY = Math.max(
                                    0,
                                    Math.min(startDragRef.current.y, currentY)
                                );
                                const maxX = Math.min(
                                    100,
                                    Math.max(startDragRef.current.x, currentX)
                                );
                                const maxY = Math.min(
                                    100,
                                    Math.max(startDragRef.current.y, currentY)
                                );
                                const width = maxX - minX;
                                const height = maxY - minY;
                                setCropBox({
                                    x: minX,
                                    y: minY,
                                    width: width,
                                    height: height,
                                });
                            }
                        }}
                        onPointerUp={() => {
                            if (startDragRef.current) {
                                const minSize = 8;
                                if (Math.abs(cropBox!.width) < minSize ||
                                    Math.abs(cropBox!.height) < minSize) {
                                    setCropBox(null);
                                }
                                startDragRef.current = null;
                            }
                        }} />
                    {cropBox && videoSize ? (
                        <div
                            className="absolute border-2 border-blue-500 pointer-events-none"
                            style={{
                                left: cropBox.x + "%",
                                top: cropBox.y + "%",
                                width: cropBox.width + "%",
                                height: cropBox.height + "%",
                            }} />
                    ) : null}
                </div>
                <div className="flex py-2 gap-4 items-center justify-start">
                    {cropBox ? (
                        <>
                            <div className="text-blue-500">
                                Only the cropped area will be sent
                            </div>
                            <button
                                className="px-3 py-2 text-red-500 underline "
                                onClick={() => {
                                    setCropBox(null);
                                }}
                            >
                                Clear crop area
                            </button>
                        </>
                    ) : (
                        <div className="py-2">Click and drag on video to set a crop</div>
                    )}
                </div>
            </div>
        </div>
    );
}

