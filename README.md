# notes-api-microservice
crud operations on notes using microservcies
Microservices-based API for Note Management
This project implements a microservices-based API that allows users to create, read, update and delete notes. It is built using Nest.js, a progressive Node.js web framework that provides a more structured approach to building APIs.

Architecture
This project uses a microservices architecture to improve scalability, maintainability, and fault tolerance. Breaking down the application into smaller services allows each service to be developed, tested, and deployed independently, making it easier to manage the codebase. The "notes" microservice handles all CRUD operations for notes, and communication between the API gateway and the "notes" microservice is handled by a message broker, RabbitMQ.

Features
Create, read, update and delete notes
NoSQL database (MongoDB) for storing notes
Authentication and authorization using JWT tokens
Typescript support
Error logging support using Sentry
API Endpoints
The following endpoints are available in the API:

POST /notes - Creates a new note
GET /notes - Retrieves all notes
GET /notes/:id - Retrieves a single note by id
PUT /notes/:id - Updates a note by id
DELETE /notes/:id - Deletes a note by id
Getting Started
To set up and run the project:

Clone the repository from Github.
Install the dependencies by running the command npm install.
Set up a MongoDB database and update the connection string in the .env file.
Set up a RabbitMQ server and update the connection details in the .env file.
Generate a secret key for JWT token and update the .env file.
Start the application by running the command npm run start:dev.
The application should now be running on http://localhost:3000.
Conclusion
This microservices-based API for note management provides a scalable and maintainable solution for handling CRUD operations on notes. The use of Nest.js, MongoDB, RabbitMQ, JWT tokens, Typescript, and Sentry provide a robust and reliable solution for building APIs that can handle large amounts of data and traffic.
