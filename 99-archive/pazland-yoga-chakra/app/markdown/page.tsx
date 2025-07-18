"use client"

import React from 'react';
import Markdown from 'react-markdown';

export default function MarkdownPage() {
  const markdown = `
  # Hello World

This is the hello world you should be able to link to [google](http://www.google.com) this way
and avoid all the funky stuff in code.
  `;

  return (
    <div>
      <h1>This is a React app</h1>
      <p><Markdown>{markdown}</Markdown></p>
    </div>
  );
  
}

