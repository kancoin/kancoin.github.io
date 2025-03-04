"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useState } from "react";
import { Group, Mesh } from "three";

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
      <ambientLight intensity={1} />
      <directionalLight position={[-5, -15, -5]} intensity={1} />
      <directionalLight position={[5, 15, 5]} intensity={2} />
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
        <div className="text-8xl font-bold">kancoin</div>
        <div className="">A digital currency for the future</div>
      </div>

      <Canvas
        camera={{
          position: [50, -10, 0],
          fov: 15,
          near: 20,
          far: 100,
          focus: 100,
        }}
        gl={{ toneMappingExposure: 0.5 }}
      >
        <Environment preset="studio" background blur={0.1} />

        <Suspense fallback={null}>
          <Model />
        </Suspense>
        {/* <OrbitControls enableZoom={true} /> */}
      </Canvas>
    </div>
  );
}
