import React from "react";
import { Link } from "react-router-dom";
import { Home, ArrowLeft, Search } from "lucide-react";
import Header from "../components/Header";

export default function NotFoundPage() {
  return (
    <>
    <Header />
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center px-6">

      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-cyan-500/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-600/20 blur-[140px] rounded-full"></div>

      {/* Floating Orbs */}
      <div className="absolute top-20 right-20 w-5 h-5 rounded-full bg-cyan-400 animate-pulse"></div>
      <div className="absolute bottom-24 left-16 w-3 h-3 rounded-full bg-blue-400 animate-bounce"></div>

      {/* Main Content */}
      <div className="relative z-10 max-w-3xl text-center">

        {/* 404 Number */}
        <div className="relative inline-block">
          <h1
            className="
              text-[120px] sm:text-[180px] lg:text-[240px]
              font-black
              leading-none
              tracking-[-0.08em]
              text-transparent
              bg-clip-text
              bg-gradient-to-r
              from-white
              via-cyan-300
              to-blue-500
              drop-shadow-[0_0_35px_rgba(59,130,246,0.45)]
            "
          >
            404
          </h1>

          {/* Glow Ring */}
          <div className="absolute inset-0 blur-3xl opacity-30 bg-cyan-400 rounded-full scale-75"></div>
        </div>

        {/* Heading */}
        <h2 className="mt-2 text-3xl sm:text-5xl font-black text-white">
          Lost In The Digital Cosmos
        </h2>

        {/* Description */}
        <p className="mt-6 text-slate-300 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto">
          The page you’re looking for drifted into another
          dimension, vanished into cyberspace, or never existed
          in this universe.
        </p>

        {/* Search Box */}
        <div className="mt-10 max-w-xl mx-auto">
          <div
            className="
              flex items-center gap-3
              bg-white/10 backdrop-blur-xl
              border border-white/10
              rounded-2xl
              px-5 py-4
              shadow-[0_10px_40px_rgba(0,0,0,0.25)]
            "
          >
            <Search className="text-cyan-300" size={22} />

            <input
              type="text"
              placeholder="Search the galaxy..."
              className="
                flex-1 bg-transparent outline-none
                text-white placeholder:text-slate-400
              "
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mt-10">

          <Link
            to="/home"
            className="
              inline-flex items-center gap-2
              px-7 py-4 rounded-2xl
              bg-gradient-to-r from-cyan-500 to-blue-600
              text-white font-semibold
              shadow-[0_10px_40px_rgba(59,130,246,0.35)]
              hover:scale-105 hover:shadow-cyan-500/30
              transition-all duration-300
            "
          >
            <Home size={20} />
            Back To Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="
              inline-flex items-center gap-2
              px-7 py-4 rounded-2xl
              bg-white/10 backdrop-blur-md
              border border-white/10
              text-white font-semibold
              hover:bg-white/20
              transition-all duration-300
            "
          >
            <ArrowLeft size={20} />
            Go Back
          </button>
        </div>

        {/* Bottom Text */}
        <p className="mt-14 text-sm text-slate-500 tracking-wide">
          ERROR_CODE: PAGE_NOT_FOUND
        </p>
      </div>
    </div>
    </>
  );
}