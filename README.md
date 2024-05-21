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
    git clone <repository_url>
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

6. **Seed the database (if applicable):**
    ```bash
    npx prisma db seed
    ```

7. **Access the backend:**
   - URL: `http://localhost:4000`

8. **Access the frontend:**
   - URL: `http://localhost:3000`

These steps guide you through setting up the project, building and starting the Docker containers, executing Prisma migrations, seeding the database (if needed), and accessing both the backend and frontend applications locally.

