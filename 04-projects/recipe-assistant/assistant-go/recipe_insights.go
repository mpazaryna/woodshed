package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"strings"
	"time"

	"github.com/sashabaranov/go-openai"
)

// logger is a package-level variable for logging
var logger *log.Logger

// init initializes the logger
func init() {
	// Configure logging to write to a file
	file, err := os.OpenFile("app.log", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		log.Fatal(err)
	}

	logger = log.New(file, "", log.LstdFlags)
}

// GenerateInsights takes a string of recipe data and returns a map of insights
// It orchestrates the entire process of generating insights
func GenerateInsights(recipes string) (map[string]string, error) {
	start := time.Now()
	logger.Println("Starting GenerateInsights function")
	
	// Create OpenAI client
	client := createOpenAIClient()
	
	// Create prompt for OpenAI
	prompt := createPrompt(recipes)
	
	// Get insights from OpenAI
	insights, err := getInsightsFromOpenAI(client, prompt)
	if err != nil {
		return nil, err
	}
	
	// Parse the insights into a map
	parsedInsights := parseInsights(insights)
	
	// Ensure we have at least 3 insights
	ensureMinimumInsights(parsedInsights, 3)
	
	// Log the results and execution time
	logResults(parsedInsights, start)
	
	return parsedInsights, nil
}

// createOpenAIClient creates and returns an OpenAI client
func createOpenAIClient() *openai.Client {
	clientStart := time.Now()
	client := openai.NewClient(os.Getenv("OPENAI_API_KEY"))
	logger.Printf("Client creation took: %v", time.Since(clientStart))
	return client
}

// createPrompt generates the prompt for OpenAI based on the recipe data
func createPrompt(recipes string) string {
	promptStart := time.Now()
	prompt := fmt.Sprintf("Based on the following recipe data summary, please provide exactly 5 concise insights about trends in cuisine types, popular ingredients, and cooking methods. Format each insight as 'Insight X: Your insight here', where X is the number of the insight.\n\n%s", recipes)
	logger.Printf("Prompt creation took: %v", time.Since(promptStart))
	return prompt
}

// getInsightsFromOpenAI sends a request to OpenAI and returns the response
func getInsightsFromOpenAI(client *openai.Client, prompt string) (string, error) {
	logger.Println("Sending request to OpenAI")
	apiCallStart := time.Now()
	
	// Create a chat completion request
	resp, err := client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: openai.GPT4TurboPreview,
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleUser,
					Content: prompt,
				},
			},
		},
	)
	apiCallDuration := time.Since(apiCallStart)
	logger.Printf("OpenAI API call took %v", apiCallDuration)

	if err != nil {
		logger.Printf("Error from OpenAI: %v", err)
		return "", err
	}

	response := resp.Choices[0].Message.Content
	logger.Printf("Generated insights from OpenAI: %s", response)
	return response, nil
}

// parseInsights converts the OpenAI response into a map of insights
func parseInsights(response string) map[string]string {
	insights := make(map[string]string)
	for _, line := range strings.Split(response, "\n") {
		if strings.HasPrefix(line, "Insight") {
			parts := strings.SplitN(line, ":", 2)
			if len(parts) == 2 {
				key := strings.ToLower(strings.ReplaceAll(strings.TrimSpace(parts[0]), " ", "_"))
				insights[key] = strings.TrimSpace(parts[1])
			}
		}
	}
	return insights
}

// ensureMinimumInsights makes sure we have at least the specified number of insights
func ensureMinimumInsights(insights map[string]string, minimum int) {
	for i := 1; len(insights) < minimum; i++ {
		insights[fmt.Sprintf("insight_%d", i)] = "No insight provided"
	}
}

// logResults logs the final insights and execution time
func logResults(insights map[string]string, start time.Time) {
	insightsJSON, _ := json.Marshal(insights)
	logger.Printf("Parsed insights: %s", string(insightsJSON))
	logger.Println("Finished GenerateInsights function")
	logger.Printf("GenerateInsights function took %v", time.Since(start))
}

func main() {
	// Main function can be implemented here if needed
}