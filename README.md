# Invoice Manager

Invoice Manager is a full-stack web application built with Next.js and Node.js, allowing users to manage their invoices efficiently.

## Features

- Create, view, update, and delete invoices.
- Export invoices as PDF or Excel files.
- Responsive design for desktop and mobile devices.
- Secure authentication for user management.

## Technologies Used

- Frontend: Next.js
- Backend: Node.js
- Database: Postgres with Prisma
- Deployment: soon

## Getting Started

1. **Clone the repository:**
    ```bash
    git clone https://github.com/brhan-kbt/Invoice-Manager.git
    ```

2. **Change directory to the project:**
    ```bash
    cd <project_directory>
    ```

3. **Build Docker containers:**
    ```bash
    docker-compose build
    ```

4. **Start Docker containers:**
    ```bash
    docker-compose up
    ```

5. **Run Prisma migrations:**
    ```bash
    docker exec -it backend npx prisma migrate dev --name init
    ```
6. **Create an admin user using the backend API on POSTMAN:**
   - **Endpoint:** `POST http://localhost:4000/users`
   - **Body:**
     ```json
     {
       "name": "Admin User",
       "email": "admin@admin.com",
       "password": "12345678",
       "role": "ADMIN"
     }
     ```
   This step creates an admin user with the provided details (name, email, password, role) using a POST request to the `/users` endpoint.


7. **Access the backend:**
   - URL: `http://localhost:4000`

8. **Access the frontend:**
   - URL: `http://localhost:3000`

Note: Make sure the ports are not taken by another services (port : 3000 and 4000)
These steps guide you through setting up the project, building and starting the Docker containers, executing Prisma migrations, seeding the database (if needed), and accessing both the backend and frontend applications locally.

