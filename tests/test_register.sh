#!/bin/bash

# Define the base URL of your API
BASE_URL="http://localhost:8000/auth/register" # Adjust the endpoint if needed

# Define the base body template (same for both tests)
BODY='{
  "email": "test@gmail.com",
  "username": "test",
  "password": "password123",
  "position": "Developer",
  "department": "Engineering"
}'

# Test the employee registration endpoint
echo "Testing employee registration endpoint..."

# Valid registration test
STATUS=$(curl -s -o response_body.txt -w "%{http_code}" -X POST "$BASE_URL" -H "Content-Type: application/json" -d "$BODY")
BODY=$(<response_body.txt)  # Read the response body from the file

# Check if the status code is 200 or 201
if [ "$STATUS" -eq 200 ] || [ "$STATUS" -eq 201 ]; then
    echo "Success: Valid registration test passed."
else
    echo "Fail: Valid registration test failed with response code $STATUS."
    echo "Response body: $BODY"
fi

# Invalid registration test (duplicate email)
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL" -H "Content-Type: application/json" -d "$BODY")

if [ "$RESPONSE" -eq 400 ]; then
    echo "Success: Duplicate email registration test passed."
else
    echo "Fail: Duplicate email registration test failed with response code $RESPONSE."
fi

# Invalid registration test (missing fields)
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL" -H "Content-Type: application/json" -d '{
  "email": "invaliduser@example.com",
  "username": "invaliduser"
}')

if [ "$RESPONSE" -eq 400 ]; then
    echo "Success: Missing fields registration test passed."
else
    echo "Fail: Missing fields registration test failed with response code $RESPONSE."
fi
