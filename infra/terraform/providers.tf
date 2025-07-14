# Defines the required versions for Terraform providers.
# This is a good practice to ensure the stability of your configuration.
terraform {
  required_providers {
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.20"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.10"
    }
  }
}

# Configures the Kubernetes provider.
# It will use the configuration found in your local kubeconfig file
# (e.g., the one updated by Minikube).
provider "kubernetes" {
  config_path    = "~/.kube/config"
  config_context = "minikube" # Assurez-vous que ce contexte correspond à celui de minikube
}

# Configures the Helm provider to rely on the same
# Kubernetes configuration.
provider "helm" {
  kubernetes {
    config_path    = "~/.kube/config"
    config_context = "minikube"
  }
}