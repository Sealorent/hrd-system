# HR System Project

This is a microservice-based HR System consisting of various components, including employee and leave management services, a gateway, and a frontend. The project uses the following stack:

- **Backend Services**: `employee-microservice` (Express), `leave-microservice` (Express)
- **Gateway**: `kong` (API Gateway)
- **Frontend**: `Next.js`

## Project Structure

- **employee-microservice**: Manages employee-related operations (e.g., registration, profile management).
- **leave-microservice**: Manages leave requests and tracking for employees.
- **gateway**: API gateway using Kong to route requests to different microservices.
- **frontend**: User interface built with Next.js for interacting with the system.


## How To Run
- chmod +x ./gateway/*
- ./gateway/add_all_service.sh
- ./gateway/enable_global_cors.sh

## Backend Test Instructions

To run the backend tests for `employee-microservice`, use the following commands:

```sh
# Navigate to the employee-microservice directory and run tests
cd employee-microservice && npm run test
```

To run the backend tests for `leave-microservice`, use the following commands:

```sh
# Navigate to the employee-microservice directory and run tests
cd leave-microservice && npm run test
```

Make sure all dependencies are installed by running `npm install` in the all service directory before executing the tests.

## Example Kong Gateway Setup

To register the `employee-microservice` with Kong as a service, use the following command:

```sh
curl -i -X POST http://localhost:8001/services/ \
  --data "name=employee-microservice" \
  --data "url=http://testlnk-employee-microservice-1:3000"
```

To add a route to this service, run:

```sh
curl -i -X POST http://localhost:8001/services/employee-microservice/routes \
  --data "paths[]=/employee" \
  --data "methods[]=GET" \
  --data "methods[]=POST"
```

These commands register the `employee-microservice` with the gateway and define the available routes for accessing employee operations.

## File Permissions

To ensure that all necessary scripts and services have the appropriate permissions, run the following `chmod` commands:

```sh
# Grant execute permission to all files in the gateway and tests folders
chmod +x ./gateway/*
chmod +x ./tests/*
```

## Kong Parameter Guide

If you need more information about Kong parameters, you can refer to the following Google search link for documentation and examples:

[Google Search: Kong with Parameters](https://www.google.com/search?q=kong+with+param&oq=kong+with+param+&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIHCAEQIRigATIHCAIQIRigATIHCAMQIRigAdIBCDU2MTRqMGo3qAIAsAIA&sourceid=chrome&ie=UTF-8)

## Running the Project

### Backend

1. **Install Dependencies**: For each microservice (`employee-microservice` and `leave-microservice`), navigate to the respective folder and run:
   ```sh
   npm install
   ```

2. **Start Services**: Start each microservice using:
   ```sh
   npm start
   ```

### Gateway (Kong)

- **Setup Kong**: Use the provided `docker-compose.yml` file to set up Kong and the associated services. Ensure Kong is running before attempting to register the services.

### Frontend

1. **Navigate to the Frontend Directory**:
   ```sh
   cd frontend
   ```
2. **Install Dependencies**:
   ```sh
   npm install
   ```
3. **Run the Frontend**:
   ```sh
   npm run dev
   ```

### Summary
This project leverages a microservice architecture to modularize the HR system into manageable components, making it scalable and easy to maintain. The API gateway (`Kong`) centralizes access, while the frontend (`Next.js`) provides a user-friendly interface for employees to interact with the system.

Please refer to individual service README files for more detailed instructions and API documentation.