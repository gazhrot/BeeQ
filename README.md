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

### Accessing the Deployed Application

Once your application is deployed on Minikube, you cannot access it directly via `localhost:3000`. You need to ask Minikube to create a network tunnel to the service.

Run the following command in a terminal:

```bash
minikube service beeq-service -n beeq
```

This command will do two things:

1.  It will print the URL to access your service in the terminal.
2.  It will automatically open this URL in your default web browser.

The URL will have a dynamic port assigned by Minikube (e.g., `http://127.0.0.1:58885`). You must use this specific URL to interact with the API running inside Kubernetes.

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

### Accessing Services with Port-Forwarding

Use these commands to access services running in your Kubernetes cluster from your local machine. **Each command needs to be run in its own separate terminal.**

#### Application Services

**1. PostgreSQL Database:**

```bash
kubectl port-forward svc/postgres-postgresql 5433:5432 -n beeq
```

_(Connects to `localhost:5433`)_

**2. Redis:**

```bash
kubectl port-forward svc/redis-master 6379:6379 -n beeq
```

_(Connects to `localhost:6379`)_

**3. RabbitMQ (for local app):**

```bash
kubectl port-forward svc/rabbitmq 5672:5672 -n beeq
```

_(Connects to `localhost:5672`)_

---

#### Monitoring & Management UIs

**4. RabbitMQ Management UI:**

```bash
kubectl port-forward svc/rabbitmq 15672:15672 -n beeq
```

- **URL:** `http://localhost:15672`
- **Login:** `user` / `password`

**5. Grafana Dashboard:**

```bash
kubectl port-forward svc/prometheus-stack-grafana 3001:80 -n beeq
```

- **URL:** `http://localhost:3001`
- **Login:** `admin` / `prom-operator`

**6. Prometheus UI:**

```bash
kubectl port-forward svc/prometheus-stack-kube-prom-prometheus 9090:9090 -n beeq
```

- **URL:** `http://localhost:9090`

## 📄 API Documentation

The OpenAPI documentation is automatically generated and available at the API root, on the `/api` endpoint.
