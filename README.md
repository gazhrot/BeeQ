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

### Important: Connecting Docker to Minikube

To build Docker images directly into Minikube's environment and avoid `ImagePullBackOff` errors, your Docker CLI must be connected to the Minikube Docker daemon.

#### On Windows (PowerShell)

You must run the following command **once per new PowerShell session** where you intend to build images. This connection is not permanent and is lost when you close the terminal.

```powershell
minikube -p minikube docker-env | Invoke-Expression
```

#### On macOS / Linux (Bash/Zsh)

```bash
eval $(minikube -p minikube docker-env)
```

## ⚡ Fast Development Workflow (for Code Changes)

When you only change the application code (e.g., in `.ts` files), you don't need to run `terraform apply`. Use this much faster workflow to see your changes in seconds.

1.  **Modify your application code** in the `src/` directory.

2.  **Re-build the Docker image.** Make sure you are in the correct terminal session where you have already pointed your Docker CLI to Minikube (using `eval $(minikube ...)` or `Invoke-Expression`).

    ```bash
    # Use the exact same image name and tag
    docker build -t gazhrot/beeq:latest .
    ```

3.  **Trigger a rolling restart of the deployment.** This tells Kubernetes to gracefully replace the old pods with new ones using your updated image.

    ```bash
    kubectl rollout restart deployment beeq-app -n beeq
    ```

## 📄 API Documentation

The OpenAPI documentation is automatically generated and available at the API root, on the `/api` endpoint.
