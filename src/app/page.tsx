"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useState } from "react";
import { Group, Mesh, WebGLRenderer } from "three";
import { VRButton } from "three/examples/jsm/webxr/VRButton.js";

function Model() {
  const { scene } = useGLTF("/models/untitled.glb") as { scene: Group };
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const material = (child as Mesh).material;
        if (Array.isArray(material)) {
          material.forEach((mat) => (mat.needsUpdate = true));
        } else {
          material.needsUpdate = true;
        }
      }
    });
  }, [scene]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => prev + 0.01);
    }, 32);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* ✅ Lowercase light elements to avoid TypeScript errors */}
      <ambientLight intensity={1} />
      <directionalLight position={[-5, -15, -5]} intensity={1} />
      <directionalLight position={[15, 5, 5]} intensity={2} />
      <pointLight position={[0, 5, 1]} intensity={10} />

      <primitive
        object={scene}
        scale={1.6}
        position={[0, 0, 0]}
        rotation={[0, rotation, 0]}
      />
    </>
  );
}

function VRSetup() {
  const { gl } = useThree();

  useEffect(() => {
    const renderer = gl as WebGLRenderer;
    renderer.xr.enabled = true;

    const vrButton = VRButton.createButton(renderer);
    document.body.appendChild(vrButton);

    return () => {
      document.body.removeChild(vrButton);
    };
  }, [gl]);

  return null;
}

export default function ThreeModel() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
      <div className="z-10 text-gray-500 absolute left-[20%] top-[30vh]">
        <div className="text-[10vmin] font-bold">kancoin</div>
        <div className="">A digital currency for the future</div>
      </div>

      <Canvas
        camera={{
          position: [50, -5, 20],
          fov: 12,
          near: 20,
          far: 80,
        }}
        gl={{ toneMappingExposure: 1.5 }}
      >
        <VRSetup />
        <Environment files={"/bg.jpg"} background blur={0.1} />

        <Suspense fallback={"loading.."}>
          <Model />
        </Suspense>

        {/* Disable OrbitControls in VR mode */}
        <OrbitControls enableZoom={true} />
      </Canvas>
    </div>
  );
}
