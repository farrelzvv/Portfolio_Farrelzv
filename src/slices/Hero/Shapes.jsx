"use client";

import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber"; // Impor kembali useFrame
import {
  ContactShadows,
  Environment,
  useGLTF,
} from "@react-three/drei";
import { Suspense, useRef } from "react";

// Komponen Model tidak berubah, hanya menampilkan scene
function Model() {
  const { scene } = useGLTF("/farrelzv.glb");
  // Sesuaikan skala dan posisi di sini. Posisi Y diubah dari -0.8 menjadi -0.5
  return <primitive object={scene} scale={1.8} position={[0, -0, 0]} />;
}

// Komponen baru untuk menangani logika animasi yang efisien
function ModelAnimator() {
  const groupRef = useRef();

  // useFrame akan berjalan di setiap frame yang di-render
  useFrame((state) => {
    // Dapatkan posisi mouse yang sudah dinormalisasi (-1 s/d 1) dari state
    const { x, y } = state.mouse;

    // Gunakan lerp (linear interpolation) untuk menggerakkan rotasi secara halus
    // Ini jauh lebih ringan daripada memanggil GSAP di setiap pergerakan mouse
    if (groupRef.current) {
      // Interpolasi rotasi sumbu Y (kiri-kanan)
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        x * 0.5, // Target rotasi
        0.05     // Kecepatan interpolasi (semakin kecil semakin smooth)
      );
      
      // Interpolasi rotasi sumbu X (atas-bawah)
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -y * 0.5, // Target rotasi
        0.05      // Kecepatan interpolasi
      );
    }
  });

  // Bungkus model di dalam group yang akan kita animasikan
  return (
    <group ref={groupRef}>
      <Model />
    </group>
  );
}

export function Shapes() {
  return (
    // Margin atas negatif (-mt-9) dihapus dari sini untuk memberi lebih banyak ruang
    <div className="row-span-1 row-start-1 aspect-square md:col-span-1 md:col-start-2 md:mt-0">
      <Canvas
        className="z-0"
        shadows
        gl={{ antialias: false, powerPreference: "low-power" }} // Optimasi WebGL
        dpr={[1, 1.5]} // Mengatur Device Pixel Ratio untuk performa
        camera={{ position: [0, 0, 8], fov: 30, near: 1, far: 40 }}
        // Event listener onPointerMove dan onPointerOut dihapus dari sini
      >
        <Suspense fallback={null}>
          <ModelAnimator /> {/* Gunakan komponen animator yang baru */}
          
          {/* OPTIMASI: ContactShadows dinonaktifkan.
            Bayangan bisa sangat berat untuk performa. Coba aktifkan kembali
            jika performa sudah baik dan Anda benar-benar membutuhkannya.
          */}
          {/* <ContactShadows
            position={[0, -3.5, 0]}
            opacity={0.65}
            scale={40}
            blur={1}
            far={9}
          /> */}

          <Environment preset="studio" />
        </Suspense>
      </Canvas>
    </div>
  );
}

// Preload model agar tidak ada jeda saat pertama kali ditampilkan
useGLTF.preload("/farrelzv.glb");
