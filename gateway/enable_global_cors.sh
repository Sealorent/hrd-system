#!/bin/bash

# Enable CORS globally in Kong for all services using JSON data
curl -i -X POST http://localhost:8001/plugins \
--header "Content-Type: application/json" \
--data '{
  "name": "cors",
  "config": {
    "origins": ["*"],
    "methods": ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS", "TRACE", "CONNECT"],
    "headers": ["Accept", "Authorization", "Content-Type"],
    "credentials": true,
    "preflight_continue": false
  }
}'

# Print a success message
echo "CORS has been enabled globally for all services in Kong."


# curl -i -X POST http://localhost:8001/services/employee-microservice/plugins \
# --header "Content-Type: application/json" \
# --data '{
#   "name": "cors",
#   "config": {
#     "origins": ["*"],
#     "methods": ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS", "TRACE", "CONNECT"],
#     "headers": ["Accept", "Authorization", "Content-Type"],
#     "credentials": true,
#     "preflight_continue": false
#   }
# }'
