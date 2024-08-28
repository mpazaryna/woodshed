async function callOpenAI(prompt: string) {
    const apiKey = Deno.env.get("OPENAI_API_KEY"); // Get the API key from environment variables

    if (!apiKey) {
        throw new Error("API key is not set in the environment variables.");
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo", // Specify the model
            messages: [{ role: "user", content: prompt }],
        }),
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content; // Return the response content
}

// Example usage
const prompt = "What is the capital of France?";
callOpenAI(prompt)
    .then(response => console.log(response))
    .catch(error => console.error(error));

export { callOpenAI }; // Add this line to export the function