import { Twitter, Github } from "lucide-react";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="relative z-40 bg-background border-t border-border w-full">
      <div className="container mx-auto py-4 px-4 md:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <Link href="/" className="font-bold text-lg text-foreground">
              FlashCard
              <span className="ml-1 bg-gradient-to-r from-primary to-teal-400 bg-clip-text text-transparent">
                Pro
              </span>
            </Link>
            <p className="text-muted-foreground text-xs mt-1">
              Cement your knowledge, one card at a time.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>&copy; {new Date().getFullYear()}</span>
            <div className="flex gap-3">
              <Link
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5 hover:text-primary transition-colors" />
              </Link>
              <Link
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5 hover:text-primary transition-colors" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
