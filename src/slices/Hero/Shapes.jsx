"use client";

import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  useGLTF,
} from "@react-three/drei";
import { Suspense, useRef } from "react";
import { gsap } from "gsap";

// Komponen Model sekarang lebih sederhana, hanya menampilkan scene
function Model() {
  const { scene } = useGLTF("/farrelzv.glb");
  return <primitive object={scene} scale={1.8} position={[0, -1.2, 0]} />;
}

export function Shapes() {
  const modelGroupRef = useRef(); // Ref untuk group yang berisi model

  // Fungsi ini akan dipanggil saat kursor bergerak di atas canvas
  const handlePointerMove = (event) => {
    const { clientX, clientY } = event;
    // Mendapatkan ukuran viewport
    const x = (clientX / window.innerWidth) * 2 - 1;
    const y = -(clientY / window.innerHeight) * 2 + 1;

    // Animasikan rotasi model hanya saat mouse bergerak
    if (modelGroupRef.current) {
      gsap.to(modelGroupRef.current.rotation, {
        y: x * 0.5,
        x: -y * 0.5,
        duration: 1, // Durasi bisa disesuaikan
        ease: "power2.out",
      });
    }
  };

  // Fungsi ini akan dipanggil saat kursor meninggalkan area canvas
  const handlePointerOut = () => {
    // Kembalikan rotasi model ke posisi semula secara perlahan
    if (modelGroupRef.current) {
      gsap.to(modelGroupgRef.current.rotation, {
        x: 0,
        y: 0,
        duration: 1.5,
        ease: "elastic.out(1, 0.3)",
      });
    }
  };

  return (
    <div className="row-span-1 row-start-1 -mt-9 aspect-square md:col-span-1 md:col-start-2 md:mt-0">
      <Canvas
        className="z-0"
        shadows
        gl={{ antialias: false, powerPreference: "low-power" }} // Optimasi WebGL
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 8], fov: 30, near: 1, far: 40 }}
        // Tambahkan event listener di sini
        onPointerMove={handlePointerMove}
        onPointerOut={handlePointerOut}
      >
        <Suspense fallback={null}>
          <group ref={modelGroupRef}> {/* Bungkus Model dengan group untuk dianimasikan */}
            <Model />
          </group>
          <ContactShadows
            position={[0, -3.5, 0]}
            opacity={0.65}
            scale={40}
            blur={1}
            far={9}
          />
          <Environment preset="studio" />
        </Suspense>
      </Canvas>
    </div>
  );
}

// Preload model agar tidak ada jeda saat pertama kali ditampilkan
useGLTF.preload("/farrelzv.glb");
