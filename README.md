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

3. **Setup Environment Files**

    Create a `.env` file in the root directory of the project and add the required environment variables. Refer to the `.env.example` file for the required variables.

    **Note:** Depending on your development setup (local or Docker), you might need to update the `MONGO_URL` in your `.env` file.

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

### Running Tests

To run the tests, use:

```bash
npm run test
```

For watch mode:

```bash
npm run test:watch
```

## API Documentation

API documentation is available at the `/docs` API endpoint of the project. You can find detailed information about the API endpoints and usage there.
