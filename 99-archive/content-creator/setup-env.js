// Simple script to set up environment variables for the build process
const fs = require('fs');

// Create .env.local file with the OpenAI API key
try {
  const apiKey = process.env.OPENAI_API_KEY || '';

  fs.writeFileSync('.env.local', `OPENAI_API_KEY=${apiKey}\n`);

  console.log('Environment variables set up successfully.');
  console.log('- OPENAI_API_KEY configured:', !!apiKey);
} catch (error) {
  console.error('Error setting up environment variables:', error);
}
