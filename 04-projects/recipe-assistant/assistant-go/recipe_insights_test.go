package main

import (
	"fmt"
	"strings"
	"testing"
	"time"
)

func TestGenerateInsights(t *testing.T) {
	testCases := []struct {
		name        string
		recipes     string
		expectedMin int
		expectedMax int
	}{
		{"returns at least 3 insights", "Sample recipe data including pasta dishes, grilled meats, and vegetarian salads.", 3, 5},
		{"handles up to 5 insights correctly", "Extensive recipe data covering various cuisines, including Italian, Mexican, Chinese, and Indian dishes, with a mix of vegetarian and meat-based options.", 3, 5},
		{"handles empty input", "", 3, 5},
		{"handles long input", strings.Repeat("A very long and detailed description of numerous recipes, including ingredients, cooking methods, and cuisine types...", 50), 3, 5},
	}

	testStart := time.Now()
	for _, tc := range testCases {
		runTest(t, tc.name, tc.recipes, tc.expectedMin, tc.expectedMax)
	}
	t.Logf("Total test suite time: %v", time.Since(testStart))
}

func runTest(t *testing.T, name string, recipes string, expectedMin, expectedMax int) {
	t.Run(name, func(t *testing.T) {
		start := time.Now()
		
		insights, err := GenerateInsights(recipes)
		
		if err != nil {
			t.Fatalf("GenerateInsights returned an error: %v", err)
		}

		validateInsights(t, insights, expectedMin, expectedMax)
		
		logTimings(t, name, start)
	})
}

func validateInsights(t *testing.T, insights map[string]string, expectedMin, expectedMax int) {
	if len(insights) < expectedMin || len(insights) > expectedMax {
		t.Errorf("Expected between %d and %d insights, got %d", expectedMin, expectedMax, len(insights))
	}

	for i := 1; i <= expectedMin; i++ {
		key := fmt.Sprintf("insight_%d", i)
		if _, exists := insights[key]; !exists {
			t.Errorf("Expected insight '%s' to exist", key)
		}
	}
}

func logTimings(t *testing.T, name string, start time.Time) {
	totalDuration := time.Since(start)
	t.Logf("Test '%s' total time: %v", name, totalDuration)
}