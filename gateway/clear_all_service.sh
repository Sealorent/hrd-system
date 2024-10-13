#!/bin/bash

BASE_URL="http://localhost:8001"  # Adjust this if Kong is running on a different host or port

# Function to delete all routes
delete_routes() {
  echo "Fetching all routes..."
  ROUTES=$(curl -s "$BASE_URL/routes")

  # Check if there are any routes
  if [ "$(echo "$ROUTES" | jq '.data | length')" -gt 0 ]; then
    for row in $(echo "${ROUTES}" | jq -r '.data[] | @base64'); do
      _jq() {
        echo ${row} | base64 --decode | jq -r ${1}
      }

      ROUTE_ID=$(_jq '.id')
      echo "Deleting route with ID: $ROUTE_ID"
      curl -i -X DELETE "$BASE_URL/routes/$ROUTE_ID"
    done
  else
    echo "No routes to delete."
  fi
}

# Function to delete all services
delete_services() {
  echo "Fetching all services..."
  SERVICES=$(curl -s "$BASE_URL/services")

  # Check if there are any services
  if [ "$(echo "$SERVICES" | jq '.data | length')" -gt 0 ]; then
    for row in $(echo "${SERVICES}" | jq -r '.data[] | @base64'); do
      _jq() {
        echo ${row} | base64 --decode | jq -r ${1}
      }

      SERVICE_ID=$(_jq '.id')
      echo "Deleting service with ID: $SERVICE_ID"
      curl -i -X DELETE "$BASE_URL/services/$SERVICE_ID"
    done
  else
    echo "No services to delete."
  fi
}

# Execute functions
delete_routes
delete_services

echo "All routes and services deleted."
