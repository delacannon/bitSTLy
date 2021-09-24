import create from "zustand";
import { optimize } from "svgo";
import { STLExporter } from "three/examples/jsm/exporters/STLExporter.js";

const [useStore] = create((set, get) => ({
  gamedata: null,
  sprites: null,
  svg: "",
  depth: 0.75,
  support: false,
  mesh: null,
  setMesh: (mesh) => set({ mesh }),
  setDepth: (depth) => set({ depth }),
  setSupport: () => set({ support: !get().support }),
  setSVG: (svg) => set({ svg }),
  exportSTL: (mesh) => {
    const exporter = new STLExporter();
    const result = exporter.parse(mesh.current);
    const blob = new Blob([result], { type: "application/octet-stream" });
    const link = document.createElement("a");
    link.style.display = "none";
    document.body.appendChild(link);
    link.href = URL.createObjectURL(blob);
    link.download = "bitsy-sprite.stl";
    link.click();
  },
  setGameData: (gamedata) => {
    let sprites = [];

    for (let img in gamedata.sprites) {
      sprites.push(generateSVGImage(gamedata.sprites, img));
    }

    for (let img in gamedata.items) {
      sprites.push(generateSVGImage(gamedata.items, img));
    }

    for (let img in gamedata.tiles) {
      sprites.push(generateSVGImage(gamedata.tiles, img));
    }

    set({
      sprites,
      gamedata,
    });
  },
}));

const generateSVGImage = (arr, img) => {
  const width = 8;
  const height = 8;

  const lines = [];
  const { graphic, name } = arr[img];

  const buffer = new Uint8ClampedArray(width * height * 4);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      var pos = (y * width + x) * 4;
      if (graphic[0][pos / 4]) {
        buffer[pos] = 0;
        buffer[pos + 1] = 0;
        buffer[pos + 2] = 0;
        buffer[pos + 3] = 255;
        lines.push(`<rect width="1" height="1" x="${x}" y="${y}" />`);
      } else {
        buffer[pos] = 255;
        buffer[pos + 1] = 255;
        buffer[pos + 2] = 255;
        buffer[pos + 3] = 255;
      }
    }
  }

  const draft = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">${lines
    .map((e) => e)
    .join("")}</svg>`;

  const result = optimize(draft, {
    convertShapeToPath: true,
    mergePaths: true,
    removeRasterImages: true,
    removeOffCanvasPaths: true,
    multipass: true,
  });

  return { svg: result.data, name };
};

export { useStore };
