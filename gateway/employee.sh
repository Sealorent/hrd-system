#!/bin/bash

BASE_URL="http://localhost:8001"  # Adjust this if Kong is running on a different host or port
SERVICE_NAME="employee-microservice"
EMPLOYEE_SERVICE_URL="http://employee-microservice:3000"

# Function to add a service to Kong and retrieve the service ID
add_service() {
  echo "Adding service to Kong..."
  response=$(curl -s -X POST "$BASE_URL/services/" \
    --data "name=$SERVICE_NAME" \
    --data "url=$EMPLOYEE_SERVICE_URL")

  # Extract the service ID from the response
  SERVICE_ID=$(echo "$response" | jq -r '.id')
  echo "Service added with ID: $SERVICE_ID"
}

# Function to add a route for a service using the service ID
add_route() {
  local path="$1"
  local methods="$2"

  echo "Adding route for $path with methods $methods..."
  curl -i -X POST "$BASE_URL/services/$SERVICE_ID/routes" \
    --data "paths[]=$path" \
    --data "methods[]=$methods"
}

# Add the service to Kong and retrieve the service ID
add_service

# Check if the service ID was retrieved successfully
if [[ -n "$SERVICE_ID" ]]; then
  # Add routes to the service using the service ID
  add_route "/employee" "GET,POST"
  add_route "/auth/register" "POST"
  add_route "/auth/login" "POST"
  
  echo "Routes added successfully to Kong!"
else
  echo "Failed to add service or retrieve service ID."
fi
