import Image from "next/image";
import { socialLinks } from "./config";

const introParagraphs = [
  "I develop thoughtful applications, capture quiet moments through photography, and guide others in finding balance through yoga. My work seeks to blend technology with mindfulness, creating space for both innovation and stillness.",
  "As a full-stack developer, I craft applications that merge form and function. My approach combines technical expertise with an eye for design, ensuring solutions that are both powerful and elegant.",
  "Through my lens as both engineer and artist, I create applications that resonate with users on multiple levels. My work is driven by a passion for clean code, intuitive design, and meaningful user experiences.",
];

export default function Page() {
  // Get a random paragraph on each page load
  const randomParagraph = introParagraphs[Math.floor(Math.random() * introParagraphs.length)];

  return (
    <section>
      <h1 className="mb-8 text-2xl font-medium tracking-tight">
        Portfolio, made simple!
      </h1>
      <div className="prose prose-neutral dark:prose-invert">
        <p>{randomParagraph}</p>
      </div>
    </section>
  );
}
