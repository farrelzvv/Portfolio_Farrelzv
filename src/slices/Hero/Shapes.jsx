"use client";

import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber"; // Impor useFrame
import {
  ContactShadows,
  Environment,
  useGLTF,
} from "@react-three/drei";
import { Suspense, useRef } from "react"; // Hapus useState dan useEffect, impor useRef
import { gsap } from "gsap";

// Komponen untuk me-load dan menampilkan model 3D Anda
function Model() {
  // Me-load file 3D wajah Anda dari folder public
  const { scene } = useGLTF("/farrelzv.glb");
  const modelRef = useRef(); // Membuat ref untuk model

  // Gunakan useFrame untuk menjalankan kode pada setiap frame
  useFrame((state) => {
    // Dapatkan posisi mouse dari state canvas
    const { x, y } = state.mouse;

    // Gunakan GSAP untuk menganimasikan rotasi model secara mulus
    // Model akan berputar mengikuti posisi kursor
    if (modelRef.current) {
      gsap.to(modelRef.current.rotation, {
        y: x * 0.5, // Rotasi sumbu Y mengikuti mouse X
        x: -y * 0.5, // Rotasi sumbu X mengikuti mouse Y (diberi minus agar natural)
        duration: 0.5, // Durasi animasi agar terasa halus
        ease: "power2.out", // Efek easing untuk pergerakan yang lebih natural
      });
    }
  });

  // Anda bisa mengatur skala dan posisi awal model di sini
  // Posisi Y diubah dari -1.5 menjadi -1.2 untuk menaikkannya
  return <primitive ref={modelRef} object={scene} scale={1.8} position={[0, -0.2, 0]} />;
}

export function Shapes() {
  return (
    <div className="row-span-1 row-start-1 -mt-9 aspect-square md:col-span-1 md:col-start-2 md:mt-0">
      <Canvas
        className="z-0"
        shadows
        gl={{ antialias: false }}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 8], fov: 30, near: 1, far: 40 }}
      >
        <Suspense fallback={null}>
          {/* Komponen Float dan OrbitControls dihapus */}
          <Model />
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
