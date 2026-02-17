#!/bin/bash
# Safe API caller with error handling

# Usage: api_get <url> <jq_filter>
# Example: api_get "https://api.github.com/repos" ".[0].name"

URL="$1"
FILTER="$2"

response=$(curl -s "$URL" 2>/dev/null)

if [ -z "$response" ]; then
  echo "ERROR: Empty response from $URL"
  exit 1
fi

# Check for GitHub API errors
if echo "$response" | jq -e '.message' >/dev/null 2>&1; then
  echo "ERROR: $(echo "$response" | jq -r '.message')"
  exit 1
fi

# Apply filter if provided
if [ -n "$FILTER" ]; then
  echo "$response" | jq -r "$FILTER" 2>/dev/null || echo "ERROR: jq filter failed"
else
  echo "$response"
fi
