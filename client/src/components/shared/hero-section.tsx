import { Button } from "@/components/ui/button";
import React from "react";
import Link from "next/link";
import FlashcardUIMockup from "./flashcard-ui-mockup";

const HeroSection = () => {
  return (
    <div className="bg-background pt-4">
      <div className="relative flex max-w-7xl mx-auto flex-col items-center justify-center pt-16 px-4 md:px-8 pb-20">
        <div className="text-balance relative z-20 mx-auto mb-4 max-w-6xl text-center text-4xl font-semibold tracking-tight text-foreground md:text-7xl">
          <span
            data-br=":R4btfb:"
            data-brr={1}
            style={{
              display: "inline-block",
              verticalAlign: "top",
              textDecoration: "inherit",
              textWrap: "balance",
            }}
          >
            <h2
              className="inline-block bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent"
              style={{ opacity: 1 }}
            >
              Where Your {/* */}{" "}
              <span className="bg-gradient-to-b from-primary to-primary/80 bg-clip-text text-transparent">
                Dreams 
              </span>
            </h2>
            <h2
              className="inline-block bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent py-2"
              style={{ opacity: 1 }}
            >
              Become {/* */}{" "}
              <span className="bg-gradient-to-b from-primary to-primary/80 bg-clip-text text-transparent">
                Reality
              </span>
            </h2>
          </span>
        </div>
        <p
          className="relative z-20 mx-auto mt-4 max-w-2xl px-4 text-center text-base/6 text-muted-foreground sm:text-base"
          style={{ opacity: 1, transform: "none" }}
        >
          Discover breathtaking destinations and seamless travel planning with
          our expert guidance. Unforgettable experiences await—book your journey
          today!
        </p>
        <div
          className="mb-8 mt-6 z-10 sm:mb-10 sm:mt-8 flex w-full flex-col items-center justify-center gap-4 px-4 sm:px-8 sm:flex-row md:mb-20"
          style={{ opacity: 1, transform: "none" }}
        >
          <Button asChild size="lg" className="w-full sm:w-40 h-12">
            <Link href="/login">Get Started</Link>
          </Button>
        </div>
        <div className="pt-[2rem] w-full relative">
          <div
            className="relative z-10"
            style={{ opacity: 1, transform: "none" }}
          >
            <div className="relative mx-auto h-[600px] w-[300px] md:h-[680px] md:w-[340px]">
              <div className="absolute inset-0 rounded-[50px] border-[14px] border-black bg-black shadow-xl">
                <div className="absolute left-1/2 top-[0.5rem] h-[1.8rem] w-[6rem] -translate-x-1/2 rounded-full bg-black z-10">
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 w-[0.6rem] h-[0.6rem] rounded-full bg-[#1a1a1a] ring-[1.5px] ring-[#2a2a2a]">
                    <div className="absolute inset-[1.5px] rounded-full bg-[#0f0f0f]">
                      <div className="absolute inset-[1.5px] rounded-full bg-[#151515] ring-[0.75px] ring-[#202020]" />
                    </div>
                  </div>
                </div>
                <div className="relative h-full w-full overflow-hidden rounded-[35px] bg-background">
                  <FlashcardUIMockup />
                </div>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 z-0 flex items-center justify-center">
            <div
              className="absolute z-0 rounded-full border border-foreground/10"
              style={{ width: 1400, height: 1400 }}
            />
            <div
              className="absolute z-0 rounded-full border border-foreground/20"
              style={{
                width: 1100,
                height: 1100,
                clipPath: "circle(50% at 50% 50%)",
                background:
                  "radial-gradient(circle, var(--primary-foreground) 0%, rgba(255, 255, 255, 0.8) 20%, rgba(255, 255, 255, 0.4) 40%, rgba(255, 255, 255, 0) 60%)",
                transform: "translateY(-1.65972px) scale(1.00664)",
              }}
            />
            <div
              className="absolute bg-primary/10 z-2  rounded-full  border border-primary/20 shadow-[0_0_200px_80px_var(--primary-foreground)]"
              style={{
                width: 800,
                height: 800,
                transform: "translateY(-6.79899px) scale(1.02914)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Exporting named component for consistency with previous structure if needed elsewhere.
export default HeroSection;
