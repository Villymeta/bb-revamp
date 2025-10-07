'use client';

import { motion } from "framer-motion";
import Image from "next/image";
import { HiXMark, HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import {
  FaXTwitter,
  FaInstagram,
  FaRedditAlien,
  FaMedium,
  FaQuora,
  FaGlobe,
} from "react-icons/fa6";

export default function MemberModal({
  member,
  onClose,
  onNext,
  onPrev,
  onTouchStart,
  onTouchEnd,
}) {
  if (!member) return null;

  return (
    <motion.div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm pointer-events-none"
    onTouchStart={onTouchStart}
    onTouchEnd={onTouchEnd}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    {/* Modal Content */}
    <motion.div
      className="relative pointer-events-auto bg-black/90 border border-[#F8E49F]/50 rounded-2xl shadow-[0_0_30px_rgba(248,228,159,0.3)] w-[90%] max-w-md mx-auto p-6 text-center transition-all duration-300"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 15 }}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-[#F8E49F] hover:text-[#fff5c2] transition z-50"
        aria-label="Close modal"
      >
        <HiXMark size={26} />
      </button>

        {/* PFP */}
        <div className="mb-4 flex justify-center">
          <div className="rounded-full border-4 border-[#F8E49F] shadow-[0_0_35px_rgba(248,228,159,0.7)] p-1">
            <Image
              src={member.src}
              alt={member.name}
              width={150}
              height={150}
              className="rounded-full"
            />
          </div>
        </div>

        {/* Name */}
        <h2 className="text-2xl font-extrabold text-[#F8E49F] mb-2 drop-shadow-[0_0_10px_rgba(248,228,159,0.6)]">
          {member.name}
        </h2>

        {/* Role / Bio */}
        {member.role && (
          <p className="text-sm text-[#fef9d8] italic mb-3">
            {member.role}
          </p>
        )}
        {member.bio && (
          <p className="text-gray-200 text-base leading-relaxed">{member.bio}</p>
        )}

        {/* 🔗 Social Links */}
        {member.socials && (
          <div className="flex justify-center space-x-6 mt-6">
            {member.socials.x && (
              <a
                href={member.socials.x}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="text-[#F8E49F] hover:text-[#fff5c2] transition-transform transform hover:scale-110 drop-shadow-[0_0_10px_rgba(248,228,159,0.6)]"
              >
                <FaXTwitter size={22} />
              </a>
            )}
            {member.socials.instagram && (
              <a
                href={member.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-[#F8E49F] hover:text-[#fff5c2] transition-transform transform hover:scale-110 drop-shadow-[0_0_10px_rgba(248,228,159,0.6)]"
              >
                <FaInstagram size={22} />
              </a>
            )}
            {member.socials.reddit && (
              <a
                href={member.socials.reddit}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Reddit"
                className="text-[#F8E49F] hover:text-[#fff5c2] transition-transform transform hover:scale-110 drop-shadow-[0_0_10px_rgba(248,228,159,0.6)]"
              >
                <FaRedditAlien size={22} />
              </a>
            )}
            {member.socials.medium && (
              <a
                href={member.socials.medium}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Medium"
                className="text-[#F8E49F] hover:text-[#fff5c2] transition-transform transform hover:scale-110 drop-shadow-[0_0_10px_rgba(248,228,159,0.6)]"
              >
                <FaMedium size={22} />
              </a>
            )}
            {member.socials.quora && (
              <a
                href={member.socials.quora}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Quora"
                className="text-[#F8E49F] hover:text-[#fff5c2] transition-transform transform hover:scale-110 drop-shadow-[0_0_10px_rgba(248,228,159,0.6)]"
              >
                <FaQuora size={22} />
              </a>
            )}
            {member.socials.website && (
              <a
                href={member.socials.website}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Website"
                className="text-[#F8E49F] hover:text-[#fff5c2] transition-transform transform hover:scale-110 drop-shadow-[0_0_10px_rgba(248,228,159,0.6)]"
              >
                <FaGlobe size={22} />
              </a>
            )}
          </div>
        )}

        {/* Navigation Arrows */}
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          <button
            onClick={onPrev}
            className="text-[#F8E49F] hover:text-[#fff5c2] transition"
            aria-label="Previous member"
          >
            <HiChevronLeft size={28} />
          </button>
        </div>

        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <button
            onClick={onNext}
            className="text-[#F8E49F] hover:text-[#fff5c2] transition"
            aria-label="Next member"
          >
            <HiChevronRight size={28} />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}