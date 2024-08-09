export type MovieInfo = {
  fps: number;
  width: number;
  height: number;
  startingWait: number;
  endingWait: number;
  panTime: number;
}

export function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
} 

export function generateScenes(img: HTMLImageElement, info: MovieInfo): HTMLCanvasElement[] {
  let cursor = 0;
  const canvases: HTMLCanvasElement[] = [];
  const length = info.startingWait + info.panTime + info.endingWait;
  while (cursor < length) {
    const canvas = document.createElement("canvas");
    canvas.width = info.width;
    canvas.height = info.height;
    const ctx = canvas.getContext("2d")!;

    let top = 0;
    if (cursor < info.startingWait) {
    } else if (cursor < info.startingWait + info.panTime) {
      const t = easeInOut((cursor - info.startingWait) / info.panTime);
      top = (img.height - info.height) * t;
    } else {
      top = img.height - info.height;
    }
    ctx.drawImage(img, 0, -top);

    canvases.push(canvas);
    cursor += 1 / info.fps;
  }
  return canvases;
}