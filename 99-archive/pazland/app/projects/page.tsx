import React from "react";
import type { Metadata } from "next";
import { projects } from "./project-data";

export const metadata: Metadata = {
  title: "Projects",
  description: "My Projects",
};

export default function Projects() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-medium tracking-tight">Projects</h1>
      <div className="space-y-6">
        {projects.map((project, index) => (
          <div
            key={index}
            className="block group rounded-xl p-4 hover:bg-[papayawhip] dark:hover:bg-[#1f1f1f] transition-colors duration-200"
          >
            <div className="flex flex-col">
              <div className="w-full flex justify-between items-baseline">
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black dark:text-white font-medium tracking-tight hover:opacity-80 transition-opacity duration-200"
                >
                  {project.title}
                </a>
                <span className="text-neutral-600 dark:text-neutral-400 tabular-nums text-sm">
                  {project.year}
                </span>
              </div>
              <p className="prose prose-neutral dark:prose-invert pt-3">
                {project.description}
              </p>
              {project.blog && (
                <a
                  href={`/blog/${project.blog}`}
                  className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors duration-200 mt-2 inline-block"
                >
                  Read blog post →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
