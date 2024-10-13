#!/bin/bash

# Call clear_all_service.sh
./gateway/clear_all_service.sh


BASE_URL="http://localhost:8001"  # Adjust this if Kong is running on a different host or port
SERVICE_NAME="employee-microservice"
EMPLOYEE_SERVICE_URL="http://testlnk-employee-microservice-1:3000"

# Function to add a service to Kong
add_service() {
  echo "Adding service to Kong..."
  curl -i -X POST "$BASE_URL/services/" \
    --data "name=$SERVICE_NAME" \
    --data "url=$EMPLOYEE_SERVICE_URL"
  echo "Service added: $SERVICE_NAME"
}

add_service_leave() {
  echo "Adding service to Kong..."
  curl -i -X POST "$BASE_URL/services/" \
    --data "name=$SERVICE_NAME" \
    --data "url=$LEAVE_SERVICE_URL"
  echo "Service added: $SERVICE_NAME"
}

# Function to check if a route already exists
route_exists() {
  local path="$1"
  response=$(curl -s "$BASE_URL/routes?service=$SERVICE_NAME")
  echo "$response" | grep -q "\"paths\":[\"$path\"]"  # Check if the route exists
}

# Function to add a route for a service
add_route() {
  local path="$1"
  shift  # Remove the first argument (path)
  local methods=("$@")  # Get all remaining arguments as an array

  if route_exists "$path"; then
    echo "Route for $path already exists. Skipping addition."
  else
    echo "Adding route for $path with methods ${methods[*]}..."
    curl -i -X POST "$BASE_URL/services/$SERVICE_NAME/routes" \
      --data "paths[]=$path" \
      $(for method in "${methods[@]}"; do echo --data "methods[]=$method"; done) \
      --data "strip_path=false" \
      --data "regex_priority=300"

    echo "Route added successfully. Path: $path, Methods: ${methods[*]}"
  fi
}

# Add the service to Kong
add_service

# Add routes to the service {employee-microservice}
add_route "/employee" "GET" "POST" "OPTIONS"
add_route "/auth/register" "POST" "OPTIONS"
add_route "/auth/login" "POST" "OPTIONS"
add_route "/employees" "GET" "OPTIONS"
add_route "/employees/status" "PUT" "OPTIONS"
add_route "/employees/update-profile"  "PUT" "OPTIONS"
add_route "/employees/update-employee" "OPTIONS" "PATCH" 
add_route "/employees/delete" "OPTIONS" "DELETE"
add_route "/employees/update-leave-count" "PUT" "OPTIONS"
add_route "/employees/profile" "GET" "OPTIONS"

# Add the service to Kong {presence-microservice}

SERVICE_NAME="leave-microservice"
LEAVE_SERVICE_URL="http://testlnk-leave-microservice-1:3001"

add_service_leave

add_route "/leaves" "GET" "OPTIONS"
add_route "/leaves/status" "PUT" "OPTIONS"
add_route "/leaves/add" "POST" "OPTIONS"



echo "Configuration completed!"
