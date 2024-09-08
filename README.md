# TaskMaster API

## Overview

The Task Management API is a RESTful API designed to manage and organize tasks efficiently. This project leverages Express.js, TypeScript and MongoDB.

## Prerequisites

-   **Node.js**: Version 18
-   **Docker** (optional for containerization)

## Setup with Docker

1. **Clone the Repository**

    ```bash
    git clone https://github.com/MyoHsat27/TaskMaster-API.git
    cd TaskMaster-API
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Create Environment Files**

    Make sure to create the required `.env` files in the root directory of your project:

    - **`.env`**: Default environment settings (if needed).
    - **`.env.development`**: Settings for local development.
    - **`.env.production`**: Settings for production environment.

    **Note:** If you are using local development, you might need to configure your application to connect to an online MongoDB service. Update the `MONGO_URL` string in your `.env.development` file with the URL of the online MongoDB service.

4. **Run the Application**

    **For local development, use the following command:**

    ```bash
    npm run dev
    ```

    **For Docker deployment, use the following commands:**

    To build and start the Docker containers:

    ```bash
    npm run docker:up
    ```

    To stop and remove the Docker containers, use:

    ```bash
    npm run docker:down
    ```

    If you need to rebuild the Docker images, run:

    ```bash
    npm run docker:build
    ```

## API Documentation

API documentation is available at the `/docs` API endpoint of the project. You can find detailed information about the API endpoints and usage there.
