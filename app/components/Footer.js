'use client';
import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#F8E7A1] text-black py-10 mt-16 border-t border-gray-800">
      <div className="max-w-7xl mx-auto flex flex-col items-center space-y-6 px-6 text-center">
        
        {/* Call to Action */}
        <p className="text-2xl font-extrabold text-black drop-shadow-[0_0_8px_#FFD54F]">
          Join the Pack
        </p>

        {/* Footer Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="https://doge-labs.com/collectible/doginal-dogs"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-full font-semibold text-black 
                       bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500
                       hover:from-yellow-200 hover:via-yellow-300 hover:to-yellow-400
                       transition-transform transform hover:scale-105 shadow-[0_0_10px_#FFD54F]"
          >
            Doge Labs
          </a>
          <a
            href="https://doggy.market/nfts/doginaldogs"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-full font-semibold text-black 
                       bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500
                       hover:from-yellow-200 hover:via-yellow-300 hover:to-yellow-400
                       transition-transform transform hover:scale-105 shadow-[0_0_10px_#FFD54F]"
          >
            Doggy Market
          </a>
        </div>

        {/* Icons Row - Dogs left, socials right */}
        <div className="flex justify-between items-center w-full px-6 max-w-4xl">
          {/* Left Side - Dogs */}
          <div className="flex space-x-4">
            <a
              href="https://www.doginaldogs.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/DoginalIcon.gif"
                alt="Doginal Dogs"
                className="h-8 w-8 hover:scale-105 transition-transform duration-200"
              />
            </a>
            <a
              href="https://x.com/doginaldogsx"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/DoginalDogXicon.gif"
                alt="Doginal Dogs X"
                className="h-10 w-10 hover:scale-105 transition-transform duration-200"
              />
            </a>
          </div>

          {/* Right Side - X, Discord, Instagram */}
          <div className="flex space-x-4">
            {/* X Icon */}
            <a
              href="https://x.com/BeanieDaoX"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/Xiconweb.png"
                alt="Follow on X"
                className="h-8 w-8 hover:scale-110 transition-transform duration-200"
                style={{
                  filter:
                    "drop-shadow(0 0 4px #FFD54F) drop-shadow(0 0 10px #FFEB3B)",
                }}
              />
            </a>

            {/* Discord */}
            <a
              href="https://discord.gg/8au8eZx6"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/Discord.png"
                alt="Join us on Discord"
                className="h-8 w-8 hover:scale-110 transition-transform duration-200"
                style={{
                  filter:
                    "drop-shadow(0 0 4px #FFD54F) drop-shadow(0 0 10px #FFEB3B)",
                }}
              />
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/beaniedaox/?igsh=aHp4eDhiMG8xemN5&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/Instagram logo.png"
                alt="Follow on Instagram"
                className="h-8 w-8 hover:scale-110 transition-transform duration-200"
                style={{
                  filter:
                    "drop-shadow(0 0 4px #FFD54F) drop-shadow(0 0 10px #FFEB3B)",
                }}
              />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 text-center text-sm text-black-100 leading-tight">
          <p>© {new Date().getFullYear()} Beanies On Business.</p>
          <p>All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}