

import Link from "next/link";
import Image from "next/image";
import React from "react";
import Particles from "../landingpage/app/components/particles";


export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen overflow-hidden bg-gradient-to-tl from-black via-zinc-600/20 to-black">
      <nav className="my-16 animate-fade-in">
          <h2 className="text-sm duration-500 text-zinc-500 hover:text-zinc-300">
            Simplifying payments, one transaction at a time.
            </h2>
      </nav>

      {/* Top Glow */}
      <div className="hidden w-screen h-px animate-glow md:block animate-fade-left bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />
      
      {/* Particles */}
      <Particles className="absolute inset-0 -z-10 animate-fade-in" quantity={100} />

      {/* Title */}
      <h1 className="py-3.5 px-0.5 z-10 text-4xl text-transparent duration-1000 bg-white cursor-default text-edge-outline animate-title font-display sm:text-6xl md:text-9xl whitespace-nowrap bg-clip-text">
        cashpay
      </h1>

      {/* Bottom Glow */}
      <div className="hidden w-screen h-px animate-glow md:block animate-fade-right bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />
 <Link href="/privacy">
            <span className="text-xs text-zinc-500 hover:text-zinc-300 underline">
              Privacy Policy
            </span>
          </Link>
      {/* Subtitle + Android App Button */}
     {/* Subtitle + Android + App Store Buttons */}
<div className="my-16 text-center animate-fade-in flex flex-col items-center gap-4">
  <b><h2 className="text-sm text-zinc-500">
    Download Now
  </h2></b>

  {/* Flex container untuk kedua badge */}
  <div className="flex gap-4">
    {/* Android App Google Play Badge */}
    <Link
      href="https://play.google.com/store/apps/details?id=com.app.cashpay" // Ganti dengan link asli
      target="_blank"
      rel="noopener noreferrer"
    >
      <Image
        src="/google-play-app-store.png" // Pastikan file ini ada di /public
        alt="Get it on Google Play"
        width={160}
        height={60}
        className="hover:opacity-80"
      />
    </Link>

    {/* iOS App Store Badge */}
    <Link
    href = '/ios'
      // href="https://apps.apple.com/us/app/your-app-id" 
      target="_blank"
      rel="noopener noreferrer"
    >
      <Image
        src="/app-store.png" // Pastikan file ini ada di /public
        alt="Download on the App Store"
        width={160}
        height={40}
        className="hover:opacity-80"
      />
    </Link>
  </div>
  </div>
  </div>
  );
}
