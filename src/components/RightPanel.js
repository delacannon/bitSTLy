import { Suspense, useRef, useEffect } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import {
  OrbitControls,
  AdaptiveDpr,
  Loader,
  AdaptiveEvents,
  Environment,
} from "@react-three/drei";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";
import { useStore } from "../store";
import * as THREE from "three";
import useClipboard from "react-use-clipboard";

const Face = () => {
  const { svg, depth, support, setMesh } = useStore((state) => state);
  const ref = useRef();
  const { paths } = useLoader(
    SVGLoader,
    `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`
  );

  useEffect(() => {
    setMesh(ref);
    console.log(ref);
  }, [ref]);

  return (
    <group ref={ref}>
      <group
        rotation={[Math.PI * 0.5, 0, -Math.PI * 0.5]}
        position={[-4, depth, 4]}
        scale={[1, 1, 1]}
      >
        {paths.map((path) => {
          const shapes = path.toShapes();
          return shapes.map((shape, i) => {
            const geometry = new THREE.ExtrudeGeometry(shape, {
              depth: depth,
              steps: 1,
              bevelEnabled: false,
            });

            return (
              <mesh key={i} args={[geometry]}>
                <meshPhysicalMaterial
                  roughness={0.8}
                  clearcoat={0.5}
                  clearcoatRoughness={0.2}
                  color={"#fecaca"}
                />
              </mesh>
            );
          });
        })}
      </group>
      {support && (
        <mesh position={[0, -0.25 + depth / 4, 0]}>
          <boxGeometry args={[8.1, 0.5, 8.1]} />{" "}
          <meshPhysicalMaterial
            roughness={0.8}
            clearcoat={0.5}
            clearcoatRoughness={0.2}
            color={"#c8daf5"}
          />{" "}
        </mesh>
      )}
    </group>
  );
};

function RightPanel() {
  const { svg, depth, setDepth, support, setSupport, mesh, exportSTL } =
    useStore((state) => state);
  const [isCopied, setCopied] = useClipboard(svg, { successDuration: 1000 });

  return (
    <div className="flex-1 z-10 relative">
      <div className="w-full h-screen bg-yellow-200  p-2">
        <Canvas camera={{ position: [6, 4, 6] }}>
          <gridHelper args={[8, 8, 0xff00e4, 0xff00e4]} />
          <OrbitControls />
          <AdaptiveDpr pixelated />
          <AdaptiveEvents />
          <Suspense fallback={null}>
            <Environment background={false} preset={"apartment"} />
            <Face />
          </Suspense>
        </Canvas>
        <Loader />
      </div>
      {svg !== "" && (
        <>
          <div
            onClick={setCopied}
            className="absolute hover:bg-black hover:text-white left-16 top-4 text-2xl text-gray-900 bg-pink-200 p-1 rounded-lg uppercase"
          >
            {isCopied ? "Copied! 👍" : "Save as SVG"}
          </div>

          <div
            onClick={() => exportSTL(mesh)}
            className="absolute hover:bg-black hover:text-white left-48 top-4 text-2xl text-gray-900 bg-pink-400 p-1 rounded-lg uppercase"
          >
            Export as STL
          </div>

          <div className="absolute left-16 top-16 text-2xl text-gray-900">
            {svg}
          </div>

          <div
            onClick={() => setSupport(support)}
            className="absolute hover:bg-black p-2 hover:text-white left-16 bottom-8 text-2xl text-gray-900 bg-pink-200 p-1 rounded-lg uppercase"
          >
            {support ? "Remove Support" : "Add Support"}
          </div>
          <div className="absolute bottom-8 right-4">
            <label className="p-2 text-2xl">GRAPHIC DEPTH {depth}</label>
            <input
              onChange={(e) => setDepth(e.target.value)}
              type="range"
              defaultValue={depth}
              step="0.1"
              max="2.0"
              min={0.1}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default RightPanel;
