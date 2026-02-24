"use client";

import Image from "next/image";
import { withBasePath } from "@/lib/image-path";

interface FloatingCharacterProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  floatDelay?: number;
  floatDuration?: number;
}

export function FloatingCharacter({
  src,
  alt,
  width,
  height,
  className = "",
  floatDelay = 0,
  floatDuration = 3,
}: FloatingCharacterProps) {
  return (
    <div
      className={`pointer-events-none select-none ${className}`}
      style={{
        animation: `float ${floatDuration}s ease-in-out ${floatDelay}s infinite`,
      }}
    >
      <Image
        src={withBasePath(src)}
        alt={alt}
        width={width}
        height={height}
        className="drop-shadow-md"
        unoptimized
      />
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}
