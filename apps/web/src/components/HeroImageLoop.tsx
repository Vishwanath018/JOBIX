"use client";

import { useEffect } from "react";

const images = [
  "/hero/1.png",
  "/hero/2.png",
  "/hero/3.png",
  "/hero/4.png",
];

export default function HeroImageLoop() {
  useEffect(() => {
    const setup = () => {
      const nodes = Array.from(document.querySelectorAll("body *"));

      const welcome = nodes.find(
        (element) =>
          element.children.length === 0 &&
          element.textContent?.trim() === "WELCOME TO JOBIX"
      );

      if (!welcome) return false;

      let hero: HTMLElement | null = welcome.parentElement;

      while (hero) {
        const rect = hero.getBoundingClientRect();

        if (rect.width >= 900 && rect.height >= 250) {
          break;
        }

        hero = hero.parentElement;
      }

      if (!hero) return false;

      if (hero.dataset.jobixHeroLoop === "true") {
        return true;
      }

      hero.dataset.jobixHeroLoop = "true";

      hero.style.position = "relative";
      hero.style.overflow = "hidden";
      hero.style.backgroundColor = "transparent";

      const image = document.createElement("img");

      image.src = images[0];
      image.alt = "";
      image.setAttribute("aria-hidden", "true");

      image.style.position = "absolute";
      image.style.inset = "0";
      image.style.width = "100%";
      image.style.height = "100%";
      image.style.objectFit = "cover";
      image.style.objectPosition = "center";
      image.style.zIndex = "0";
      image.style.opacity = "1";
      image.style.transition = "opacity 700ms ease";
      image.style.pointerEvents = "none";

      const darkOverlay = document.createElement("div");

      darkOverlay.style.position = "absolute";
      darkOverlay.style.inset = "0";
      darkOverlay.style.zIndex = "1";
      darkOverlay.style.background =
        "linear-gradient(90deg, rgba(4,18,55,0.82) 0%, rgba(4,18,55,0.58) 48%, rgba(4,18,55,0.22) 100%)";
      darkOverlay.style.pointerEvents = "none";

      hero.insertBefore(image, hero.firstChild);
      hero.insertBefore(darkOverlay, image.nextSibling);

      Array.from(hero.children).forEach((child) => {
        const element = child as HTMLElement;

        if (element !== image && element !== darkOverlay) {
          element.style.position = "relative";
          element.style.zIndex = "2";
        }
      });

      let current = 0;

      const preload = images.map((src) => {
        const img = new Image();
        img.src = src;
        return img;
      });

      const timer = window.setInterval(() => {
        image.style.opacity = "0";

        window.setTimeout(() => {
          current = (current + 1) % images.length;
          image.src = images[current];
          image.style.opacity = "1";
        }, 350);
      }, 3000);

      (hero as HTMLElement).dataset.jobixHeroTimer = String(timer);

      return true;
    };

    if (setup()) {
      return;
    }

    const observer = new MutationObserver(() => {
      if (setup()) {
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    const retryTimer = window.setTimeout(() => {
      setup();
    }, 1000);

    return () => {
      observer.disconnect();
      window.clearTimeout(retryTimer);
    };
  }, []);

  return null;
}
