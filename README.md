# REGISTER MICROSERVICE 
curl -i -X POST http://localhost:8001/services/ \
  --data "name=employee-microservice" \
  --data "url=http://testlnk-employee-microservice-1:3000"

# ADD ROUTE
curl -i -X POST http://localhost:8001/services/employee-microservice/routes \
  --data "paths[]=/employee" \
  --data "methods[]=GET" \
  --data "methods[]=POST"cl