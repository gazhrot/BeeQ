variable "app_image" {
  description = "The Docker image of the BeeQ application to be deployed."
  type        = string
  default     = "gazhrot/beeq:latest"
}

variable "app_namespace" {
  description = "The Kubernetes namespace for the BeeQ project."
  type        = string
  default     = "beeq"
}