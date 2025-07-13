# BeeQ 🐝 - Asynchronous Job Processing API

BeeQ is a "backend-as-a-service" platform that allows developers to submit long-running tasks (like web scraping or report generation) via a REST API and receive the results through webhooks.

## ✨ Features

- **REST API** for submitting and tracking jobs.
- **Asynchronous Processing** with workers decoupled via a message queue.
- **API Key Authentication**.
- **Webhook Notifications**.
- Auto-generated **OpenAPI (Swagger)** API documentation.

## 🚀 Tech Stack

- **Framework:** NestJS (TypeScript)
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Message Broker:** RabbitMQ
- **Cache:** Redis
- **Containerization:** Docker
- **Orchestration:** Kubernetes (via Minikube)
- **IaC:** Terraform
- **Monitoring:** Prometheus & Grafana

## ⚙️ Prerequisites

- Node.js (v20+)
- Docker & Docker Compose
- (For K8s deployment) Minikube, kubectl, Terraform

## 💻 Local Development

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/gazhrot/beeq.git](https://github.com/gazhrot/beeq.git)
    cd beeq
    ```

2.  **Create the environment file:**

    ```bash
    cp .env.example .env
    ```

    _Modify the variables in `.env` as needed._

3.  **Launch the Docker Compose environment:**

    ```bash
    docker-compose up --build
    ```

4.  **Apply database migrations:**
    ```bash
    docker-compose exec api npx prisma migrate dev --name init
    ```

- **API:** [http://localhost:3000](http://localhost:3000)
- **API Documentation (Swagger):** [http://localhost:3000/api](http://localhost:3000/api)
- **RabbitMQ Management:** [http://localhost:15672](http://localhost:15672) (user: `user`, pass: `password`)

## 🚢 Deployment on Kubernetes (Local)

Kubernetes resources are managed via Terraform.

1.  **Start Minikube:**

    ```bash
    minikube start
    ```

2.  **Deploy with Terraform:**
    ```bash
    cd infra/terraform
    terraform init
    terraform apply
    ```

## 📄 API Documentation

The OpenAPI documentation is automatically generated and available at the API root, on the `/api` endpoint.
