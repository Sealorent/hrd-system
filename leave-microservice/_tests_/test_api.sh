#!/bin/bash

# Log in and get JWT token
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "hr.manager@example.com",
    "password": "password123"
  }')

# Extract JWT token from the login response
JWT_TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.data.token')

if [ "$JWT_TOKEN" == "null" ] || [ -z "$JWT_TOKEN" ]; then
  echo "Login failed. Please check your credentials."
  exit 1
fi

echo "Login successful. JWT token: $JWT_TOKEN"


BODY='{
  "email": "test2@gmail.com",
  "username": "test2",
  "password": "password123",
  "position": "Developer",
  "department": "Engineering"
}'

# Register a new employee
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d "$BODY")

# Display the registration response
echo "Registration Response:"
echo $REGISTER_RESPONSE

# Extract specific fields from the response (optional)
REGISTRATION_STATUS=$(echo $REGISTER_RESPONSE | jq -r '.success')
EMPLOYEE_ID=$(echo $REGISTER_RESPONSE | jq -r '.data._id')

if [ "$REGISTRATION_STATUS" == "true" ]; then
  echo "Employee registered successfully with ID: $EMPLOYEE_ID"
else
  echo "Employee registration failed."
fi

# Define the new status
NEW_STATUS=$(cat <<EOF
{
  "status": "Accepted",
  "id": "$EMPLOYEE_ID"
}
EOF
)

# Update the status of the employee
UPDATE_STATUS_RESPONSE=$(curl -s -X PUT http://localhost:3000/employees/status \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d "$NEW_STATUS")

# Display the status update response
echo "Status Update Response:"
echo $UPDATE_STATUS_RESPONSE





