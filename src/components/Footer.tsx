import { Github, Instagram } from "lucide-react";
import { contact } from "../data/site";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#0B0B0B] py-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 sm:px-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[15px] font-bold text-white">
            LIKELION <span className="font-medium text-bear-light">DANKOOK UNIV.</span>
          </p>
          <p className="mt-2 text-sm text-white/50">
            © {new Date().getFullYear()} 멋쟁이사자처럼 단국대학교. All rights reserved.
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href={contact.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="인스타그램"
            className="flex h-10 w-10 items-center justify-center rounded-full text-white/60 ring-1 ring-inset ring-white/10 transition-colors hover:bg-white hover:text-[#0B0B0B]"
          >
            <Instagram className="h-4 w-4" />
          </a>
          <a
            href={contact.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="flex h-10 w-10 items-center justify-center rounded-full text-white/60 ring-1 ring-inset ring-white/10 transition-colors hover:bg-white hover:text-[#0B0B0B]"
          >
            <Github className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
