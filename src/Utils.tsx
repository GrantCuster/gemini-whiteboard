// load image as promise
export const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

function isIOS() {
  // @ts-ignore
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

export async function shareOrDownload(canvas: HTMLCanvasElement) {
  const blob = await new Promise<Blob>(resolve =>
    canvas.toBlob(blob => resolve(blob!), "image/png")
  );
  const file = new File([blob], "image.png", { type: "image/png" });

  if (
    isIOS() &&
    navigator.canShare &&
    navigator.canShare({ files: [file] })
  ) {
    try {
      await navigator.share({
        title: "Image",
        files: [file],
      });
    } catch (err) {
      console.error("Share failed:", err);
    }
  } else {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const timestamp = new Date().toISOString().replace(/[:.T]/g, "-").replace('Z','').split('-').slice(0, 5).join('-');
    link.download = `image-paint-${timestamp}.png`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export function extractJSONFromBackticks(
  text: string,
): { [key: string]: string } | null {
  const match = text.match(/```json\n([\s\S]*?)\n```/);
  if (match && match[1]) {
    try {
      return JSON.parse(match[1]);
    } catch (error) {
      console.error("Failed to parse JSON from backticks:", error);
    }
  }
  return null;
}
