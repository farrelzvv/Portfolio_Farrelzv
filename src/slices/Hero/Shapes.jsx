"use client";

import * as THREE from "three";
import { Canvas, useThree } from "@react-three/fiber";
import {
  Environment,
  useGLTF,
} from "@react-three/drei";
import { Suspense, useRef, useEffect, useState } from "react"; // Impor useState
import { gsap } from "gsap";

// Custom hook untuk mendeteksi ukuran layar (media query)
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Pastikan kode ini hanya berjalan di sisi client (browser)
    if (typeof window !== 'undefined') {
      const media = window.matchMedia(query);
      if (media.matches !== matches) {
        setMatches(media.matches);
      }
      const listener = () => setMatches(media.matches);
      window.addEventListener('resize', listener);
      return () => window.removeEventListener('resize', listener);
    }
  }, [matches, query]);

  return matches;
};


// Komponen Model tidak berubah, hanya menampilkan scene
function Model() {
  const { scene } = useGLTF("/farrelzv.glb");
  // Posisi Y diatur ke -0.5 untuk menaikkannya
  return <primitive object={scene} scale={1.5} position={[0, -0, 0]} />;
}

// Komponen baru yang berisi semua logika interaksi dan rendering
function InteractiveScene() {
  const modelGroupRef = useRef();
  // useThree memberikan akses ke state Three.js, termasuk fungsi invalidate
  const { invalidate } = useThree();

  useEffect(() => {
    // Fungsi ini akan dijalankan saat mouse bergerak
    const handleMouseMove = (event) => {
      // Menghitung posisi mouse yang dinormalisasi (-1 sampai 1)
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;

      // Animasikan rotasi model menggunakan GSAP
      if (modelGroupRef.current) {
        gsap.to(modelGroupRef.current.rotation, {
          y: x * 0.25, // Mengurangi intensitas rotasi agar lebih subtil
          x: -y * 0.25,
          duration: 1.5,
          ease: "power2.out",
          // Setiap kali GSAP mengupdate animasi, panggil invalidate
          onUpdate: () => {
            invalidate();
          },
        });
      }
    };

    // Tambahkan event listener ke window
    window.addEventListener("mousemove", handleMouseMove);

    // Cleanup function untuk menghapus listener saat komponen di-unmount
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [invalidate]); // Jalankan effect ini hanya sekali

  return (
    <group ref={modelGroupRef}>
      <Model />
    </group>
  );
}

export function Shapes() {
  // Gunakan hook untuk mengecek apakah layar lebih besar dari 1024px (desktop)
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  // Hanya render komponen jika isDesktop bernilai true
  return isDesktop ? (
    // Mengubah breakpoint dari md menjadi lg agar hanya muncul di layar besar
    <div className="row-span-1 row-start-1 aspect-square lg:col-span-1 lg:col-start-2 lg:mt-0">
      <Canvas
        // INI KUNCINYA: Menghentikan render loop otomatis
        frameloop="demand"
        className="z-0"
        shadows
        gl={{ antialias: false, powerPreference: "low-power" }}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 8], fov: 30, near: 1, far: 40 }}
      >
        <Suspense fallback={null}>
          <InteractiveScene />
          <Environment preset="studio" />
        </Suspense>
      </Canvas>
    </div>
  ) : null; 
}

useGLTF.preload("/farrelzv.glb");
