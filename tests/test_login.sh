#!/bin/bash

BASE_URL="http://localhost:8000/" # Adjust the port if needed

# Test login endpoint
echo "Testing login endpoint..."

# Successful login test
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/auth/login" -H "Content-Type: application/json" -d '{"email": "testuser@example.com", "password": "password123"}')

if [ "$RESPONSE" -eq 200 ]; then
    echo "Success: Login test passed."
else
    echo "Fail: Login test failed with response code $RESPONSE."
fi

# Invalid login test
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/auth/login" -H "Content-Type: application/json" -d '{"email": "invaliduser", "password": "wrongpassword"}')

if [ "$RESPONSE" -eq 401 ]; then
    echo "Success: Invalid login test passed."
else
    echo "Fail: Invalid login test failed with response code $RESPONSE."
fi

# Add more tests as needed
