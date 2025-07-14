# Creates a dedicated namespace to isolate all project resources
resource "kubernetes_namespace" "beeq_ns" {
  metadata {
    name = var.app_namespace
  }
}

#####################################################################
# DEPENDENCY (via Helm)
#####################################################################

# Deploy RabbitMQ
resource "helm_release" "rabbitmq" {
  name       = "rabbitmq"
  repository = "oci://registry-1.docker.io/bitnamicharts"
  chart      = "rabbitmq"
  version    = "16.0.10"
  namespace  = kubernetes_namespace.beeq_ns.metadata[0].name

  set {
    name  = "auth.username"
    value = "user"
  }
  set {
    name  = "auth.password"
    value = "password"
  }
}

# Deploy PostgreSQL
resource "helm_release" "postgres" {
  name       = "postgres"
  repository = "https://charts.bitnami.com/bitnami"
  chart      = "postgresql"
  version    = "15.5.4"
  namespace  = kubernetes_namespace.beeq_ns.metadata[0].name

  set {
    name  = "auth.postgresPassword"
    value = "password"
  }
  set {
    name  = "auth.password"
    value = "password"
  }
  set {
    name  = "auth.username"
    value = "user"
  }
  set {
    name  = "auth.database"
    value = "beeq"
  }
}

# Deploy Redis
resource "helm_release" "redis" {
  name       = "redis"
  repository = "https://charts.bitnami.com/bitnami"
  chart      = "redis"
  version    = "19.6.1"
  namespace  = kubernetes_namespace.beeq_ns.metadata[0].name

  set {
    name  = "auth.enabled"
    value = "false"
  }
}


#####################################################################
# APPLICATION BEEQ
#####################################################################

# Create ConfigMap for non-critical environment variables
resource "kubernetes_config_map" "beeq_config" {
  metadata {
    name      = "beeq-config"
    namespace = kubernetes_namespace.beeq_ns.metadata[0].name
  }

  data = {
    # The database URL uses Kubernetes internal DNS service.
    # Format: postgresql://<user>:<password>@<service-name>.<namespace>.svc.cluster.local:<port>/<db>
    DATABASE_URL = "postgresql://postgres:password@postgres-postgresql.${kubernetes_namespace.beeq_ns.metadata[0].name}.svc.cluster.local:5432/beeq"
    RABBITMQ_URI = "amqp://user:password@rabbitmq.${kubernetes_namespace.beeq_ns.metadata[0].name}.svc.cluster.local:5672"
    REDIS_HOST   = "redis-master.${kubernetes_namespace.beeq_ns.metadata[0].name}.svc.cluster.local"
    REDIS_PORT   = "6379"
  }
}

# Create BeeQ Application deployment
resource "kubernetes_deployment" "beeq_app" {
  metadata {
    name      = "beeq-app"
    namespace = kubernetes_namespace.beeq_ns.metadata[0].name
    labels = {
      app = "beeq"
    }
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = "beeq"
      }
    }

    template {
      metadata {
        labels = {
          app = "beeq"
        }
      }

      spec {
        container {
          name  = "api"
          image = var.app_image
          image_pull_policy  = "IfNotPresent"
          command = ["node", "dist/main.js"] # API Command
          
          port {
            container_port = 3000
          }
          
          # Load env var from ConfigMap
          env_from {
            config_map_ref {
              name = kubernetes_config_map.beeq_config.metadata[0].name
            }
          }

          # Probes so Kubernetes knows if the API is healthy
          liveness_probe {
            http_get {
              path = "/"
              port = 3000
            }
            initial_delay_seconds = 15
            period_seconds        = 20
          }
          readiness_probe {
            http_get {
              path = "/"
              port = 3000
            }
            initial_delay_seconds = 5
            period_seconds        = 10
          }
        }

        container {
          name  = "worker"
          image = var.app_image
          image_pull_policy  = "IfNotPresent"
          command = ["node", "dist/worker.js"] # Worker command

          # The worker also needs the same environment variables
          env_from {
            config_map_ref {
              name = kubernetes_config_map.beeq_config.metadata[0].name
            }
          }
        }
      }
    }
  }
}

# Create service to expose API Outside of cluster
resource "kubernetes_service" "beeq_service" {
  metadata {
    name      = "beeq-service"
    namespace = kubernetes_namespace.beeq_ns.metadata[0].name
    annotations = {
      # Annotations so Prometheus can discover and scrape this service
      "prometheus.io/scrape" = "true"
      "prometheus.io/path"   = "/metrics"
      "prometheus.io/port"   = "3000"
    }
  }

  spec {
    selector = {
      app = "beeq" # Target pod with label app=beeq
    }

    port {
      protocol    = "TCP"
      port        = 80
      target_port = 3000
    }
    
    # NodePort is simple for local access with Minikube
    # For real cloud environment we should use LoadBalancer instead
    type = "NodePort"
  }
}