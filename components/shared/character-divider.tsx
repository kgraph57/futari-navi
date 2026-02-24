import Image from "next/image";
import { withBasePath } from "@/lib/image-path";

interface CharacterDividerProps {
  className?: string;
  variant?: "walk" | "peek";
}

const WALKING_CHARS = [
  { src: "/characters/poses/konkon_wave.png", alt: "コンコン先生", size: 56 },
  { src: "/characters/poses/usagi_running.png", alt: "うさぎーさん", size: 48 },
  { src: "/characters/poses/pankun_happy.png", alt: "ぱんくん", size: 44 },
  { src: "/characters/poses/tama_happy.png", alt: "たま", size: 42 },
  { src: "/characters/poses/haruto_running.png", alt: "ハルト", size: 46 },
  { src: "/characters/poses/mia_waving.png", alt: "ミア", size: 44 },
  { src: "/characters/poses/kuma_gentle.png", alt: "くまくん", size: 50 },
  { src: "/characters/poses/risu_cheerful.png", alt: "りすちゃん", size: 42 },
];

export function CharacterDivider({ className = "", variant = "walk" }: CharacterDividerProps) {
  if (variant === "peek") {
    return (
      <div className={`relative flex items-end justify-center gap-4 overflow-hidden py-2 ${className}`}>
        {WALKING_CHARS.slice(0, 5).map((char, i) => (
          <div
            key={char.src}
            className="opacity-70 transition-opacity hover:opacity-100"
            style={{ marginTop: i % 2 === 0 ? "0px" : "8px" }}
          >
            <Image
              src={withBasePath(char.src)}
              alt={char.alt}
              width={char.size}
              height={char.size}
              className="drop-shadow-sm"
              unoptimized
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden py-4 ${className}`}>
      <div className="flex items-end gap-6 px-8">
        {WALKING_CHARS.map((char, i) => (
          <div
            key={char.src}
            className="shrink-0 opacity-75 transition-opacity hover:opacity-100"
            style={{
              marginTop: i % 2 === 0 ? "0px" : "6px",
            }}
          >
            <Image
              src={withBasePath(char.src)}
              alt={char.alt}
              width={char.size}
              height={char.size}
              className="drop-shadow-sm"
              unoptimized
            />
          </div>
        ))}
      </div>
    </div>
  );
}
