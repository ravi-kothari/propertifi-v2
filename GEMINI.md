# Propertifi

This is a web application for real estate called Propertifi. It consists of a Laravel-based backend and a frontend that is in the process of being migrated from Angular to Next.js.

## Project Overview

*   **Backend:** The backend is a Laravel project located in the `propertifi-backend` directory. It serves a RESTful API for the frontend applications.
*   **Frontend:** The frontend is located in the `propertifi-frontend` directory and contains two applications:
    *   An Angular application which is the original frontend.
    *   A Next.js application in the `nextjs-app` subdirectory, which is part of a modernization effort.
*   **Database:** The backend is configured to use a MySQL database by default. The database connection details are stored in the `.env` file in the `propertifi-backend` directory.

## Building and Running

### Backend (Laravel)

1.  **Navigate to the backend directory:**
    ```bash
    cd propertifi-backend
    ```
2.  **Install dependencies:**
    ```bash
    composer install
    ```
3.  **Create a copy of the `.env.example` file and name it `.env`:**
    ```bash
    cp .env.example .env
    ```
4.  **Generate an application key:**
    ```bash
    php artisan key:generate
    ```
5.  **Configure your database credentials in the `.env` file.**
6.  **Run database migrations:**
    ```bash
    php artisan migrate
    ```
7.  **Start the development server:**
    ```bash
    php artisan serve
    ```
    The backend will be available at `http://localhost:8000`.

### Frontend (Angular)

1.  **Navigate to the frontend directory:**
    ```bash
    cd propertifi-frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start the development server:**
    ```bash
    ng serve
    ```
    The Angular application will be available at `http://localhost:4200`.

### Frontend (Next.js)

1.  **Navigate to the Next.js application directory:**
    ```bash
    cd propertifi-frontend/nextjs-app
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The Next.js application will be available at `http://localhost:3000`.

## Development Conventions

*   The backend follows the standard Laravel project structure and conventions.
*   The frontend is transitioning from Angular to Next.js. New features should be developed in the Next.js application.
*   API routes are defined in `propertifi-backend/routes/api.php`.
