// DevOps, Cloud, Tooling & Testing Q&A dataset: Docker, Kubernetes, Git, Linux, GraphQL, Jest, Nginx, AWS, etc.
// Covers 15 modules with detailed explanations, practical code/config examples, and key takeaways.

export const QA_DEVOPS = [
    // ==========================================
    // DOCKER (15 Modules)
    // ==========================================
    {
        question: "What is the difference between a Docker Image and a Docker Container?",
        answer: "• Docker Image: A read-only, immutable template containing the application code, runtime libraries, dependencies, and OS configurations needed to run an application. Images are composed of layered filesystems.\n• Docker Container: A live, runnable isolated instance of a Docker Image. Containers add a thin read-write layer on top of the immutable image layers and run as isolated processes on the host OS kernel using Linux namespaces and cgroups.",
        example: `# 1. Pull and inspect an image
docker pull node:20-alpine

# 2. Run an isolated container instance with port mapping
docker run -d --name web_app -p 3000:3000 --memory="512m" node:20-alpine

# 3. View running containers
docker ps`,
        explanation: "Multiple containers can be instantiated from the exact same image simultaneously without interfering with one another's runtime state.",
        moduleSlug: "images-containers",
        category: "docker",
        language: "bash"
    },
    {
        question: "How does Docker Compose orchestrate multi-container application stacks?",
        answer: "Docker Compose is a tool for defining and running multi-container Docker applications using a declarative YAML file (`docker-compose.yml`).\n\nIt automatically provisions shared internal bridge networks, mounts persistent volumes, and handles service dependencies (`depends_on`).",
        example: `version: "3.8"

services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgres://user:password@db:5432/app
    depends_on:
      - db

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: app
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:`,
        explanation: "Services can communicate with each other using their service name (e.g. `db`) as the hostname through automatic Docker DNS resolution.",
        moduleSlug: "docker-compose",
        category: "docker",
        language: "yaml"
    },
    {
        question: "What is the difference between Bind Mounts and Named Volumes in Docker?",
        answer: "• Named Volumes: Managed entirely by Docker inside `/var/lib/docker/volumes/`. Isolated from host OS quirks, backed up easily, and recommended for production databases.\n• Bind Mounts: Directly mounts a specific directory or file from the host machine into the container (`./src:/app/src`). Ideal for local development with live hot-reloading.",
        example: `# 1. Named volume for database data
docker run -v db_storage:/var/lib/postgresql/data postgres:16

# 2. Bind mount for local development hot-reload
docker run -v $(pwd)/src:/app/src -p 3000:3000 my-node-app`,
        explanation: "Bind mounts reflect host file changes immediately inside the container, whereas named volumes survive container destruction and system restarts.",
        moduleSlug: "networking-volumes",
        category: "docker",
        language: "bash"
    },
    {
        question: "What are Dockerfile best practices for building minimal and secure images?",
        answer: "Essential Dockerfile practices:\n1. Use minimal base images (Alpine, Debian Slim, or Distroless).\n2. Order instructions by change frequency to maximize layer cache re-use.\n3. Run as a non-root user (`USER node`).\n4. Never store secrets, passwords, or tokens in Dockerfiles.\n5. Use `.dockerignore` to exclude `node_modules` and `.git`.",
        example: `FROM node:20-alpine
WORKDIR /app

# Cache dependency layer first!
COPY package*.json ./
RUN npm ci --only=production

# Copy source code after dependencies
COPY . .

# Run as non-privileged user for container security
USER node

EXPOSE 3000
CMD ["node", "server.js"]`,
        explanation: "Copying `package*.json` and running `npm ci` before copying source code prevents slow npm installs on every source code edit.",
        moduleSlug: "dockerfile-best-practices",
        category: "docker",
        language: "dockerfile"
    },
    {
        question: "How do Multi-Stage Builds reduce Docker image size?",
        answer: "Multi-stage builds use multiple `FROM` statements in a single Dockerfile. Heavy build dependencies (compilers, TypeScript, development node_modules) are isolated to a builder stage.\n\nOnly the compiled production artifacts are copied into the final lean production image, shrinking image sizes by up to 90%.",
        example: `# Stage 1: Build & Compile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Minimal Production Runtime
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist

USER node
CMD ["node", "dist/main.js"]`,
        explanation: "The final image does not include TypeScript, source files, or build tools, resulting in faster deployment pushes and reduced attack surface.",
        moduleSlug: "multi-stage-builds",
        category: "docker",
        language: "dockerfile"
    },
    {
        question: "How does the Container Lifecycle work (create, start, stop, kill, rm)?",
        answer: "Container lifecycle commands:\n• `docker create`: Prepares a container from an image without starting it.\n• `docker start`: Starts a stopped container.\n• `docker stop`: Sends `SIGTERM` to allow graceful shutdown within a 10s grace period, followed by `SIGKILL`.\n• `docker kill`: Immediately sends `SIGKILL` for instant termination.\n• `docker rm`: Deletes the container's read-write layer from disk.",
        example: `# Graceful stop with custom timeout
docker stop -t 30 my_worker_container

# Remove stopped containers and unused images
docker system prune -a --volumes`,
        explanation: "Applications should catch `SIGTERM` in their code to finish inflight requests and close database connections cleanly before exiting.",
        moduleSlug: "container-lifecycle",
        category: "docker",
        language: "bash"
    },
    {
        question: "What are Docker Networking Modes (bridge, host, none, overlay)?",
        answer: "• Bridge (default): Creates a private internal virtual bridge network on the host; containers access the outside world via NAT.\n• Host: Bypasses container network virtualization; container shares the host's network stack directly (highest throughput, no port mapping needed).\n• None: Disables all networking for the container.\n• Overlay: Enables multi-host container-to-container communication across a Swarm or Kubernetes cluster.",
        example: `# Run container sharing the host's network stack directly
docker run --net=host -d my-high-throughput-proxy`,
        explanation: "Host mode avoids NAT translation overhead, making it ideal for high-throughput network proxies and streaming media servers.",
        moduleSlug: "docker-networking-modes",
        category: "docker",
        language: "bash"
    },
    {
        question: "How should environment variables and secrets be managed in Docker?",
        answer: "Secrets (passwords, private keys) should never be baked into Docker image layers using `ENV` or `ARG`, as they persist in the image history.\n\nUse `.env` files with Docker Compose, inject environment variables at runtime via `-e` or `--env-file`, or use Docker Secrets / Kubernetes Secrets.",
        example: `# Run with external secret environment file
docker run --env-file .env.production -d my_service`,
        explanation: "Keeping secrets outside the image ensures the same container image can be promoted through staging and production safely.",
        moduleSlug: "environment-variables-secrets",
        category: "docker",
        language: "bash"
    },
    {
        question: "How do Docker Registries and image tagging work?",
        answer: "A Docker Registry (Docker Hub, AWS ECR, GitHub Container Registry) stores and distributes versioned container images.\n\nTags follow the format: `[registry_domain]/[namespace]/[repository]:[tag]`. Avoid relying exclusively on `:latest` in production; use specific semantic versions or Git commit SHAs.",
        example: `# Tag image with semantic version and Git commit hash
docker tag my-app:latest ghcr.io/org/my-app:v1.2.0
docker tag my-app:latest ghcr.io/org/my-app:sha-a8f3b21

# Push to remote registry
docker push ghcr.io/org/my-app:v1.2.0`,
        explanation: "Pinning specific version tags guarantees immutable, reproducible deployments and prevents unexpected image drift.",
        moduleSlug: "docker-registry",
        category: "docker",
        language: "bash"
    },
    {
        question: "How do HEALTHCHECK instructions work in Dockerfiles?",
        answer: "The `HEALTHCHECK` instruction tells Docker how to test whether a container is functioning properly, beyond merely checking if its PID is still running.",
        example: `HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \\
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1`,
        explanation: "Orchestrators like Docker Compose and Kubernetes monitor health checks to automatically restart unhealthy containers or stop routing traffic to them.",
        moduleSlug: "health-checks",
        category: "docker",
        language: "dockerfile"
    },
    {
        question: "What is Docker Swarm and how does it provide native clustering?",
        answer: "Docker Swarm is Docker's native clustering and orchestration engine. It transforms multiple Docker hosts into a single virtual manager-worker swarm.",
        example: `# Initialize a Swarm cluster
docker swarm init

# Deploy application stack from compose file
docker stack deploy -c docker-compose.yml my_production_stack`,
        explanation: "Docker Swarm provides built-in ingress load balancing, secret management, and rolling updates with minimal operational complexity.",
        moduleSlug: "docker-swarm-basics",
        category: "docker",
        language: "bash"
    },
    {
        question: "What are the trade-offs of Bind Mounts vs Volumes in production?",
        answer: "• Volumes: High performance, managed by Docker, portable across Linux/Windows/macOS, and safe from host permission issues. Recommended for production.\n• Bind Mounts: Depend on exact host file directory structures and can cause permission collisions between container users and host UID/GIDs.",
        example: `# Named volume with custom driver options
docker volume create --driver local \\
  --opt type=nfs \\
  --opt o=addr=192.168.1.1,rw \\
  --opt device=:/shared_data shared_nfs_vol`,
        explanation: "Named volumes can leverage storage drivers to connect directly to cloud block storage (EBS) or network file systems (NFS).",
        moduleSlug: "bind-mounts-vs-volumes",
        category: "docker",
        language: "bash"
    },
    {
        question: "How does Docker Layer Caching work and how do you optimize it?",
        answer: "Each Dockerfile instruction creates a cached layer. If a layer's inputs haven't changed, Docker reuses the cached layer and skips rebuilding.\n\nHowever, **if a single layer is invalidated, all subsequent layers must be rebuilt from scratch**.",
        example: `# GOOD: Infrequently changing layers first
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt # Cached unless requirements.txt changes!
COPY . . # Changes frequently; placed last`,
        explanation: "Placing frequently changing application code at the very end ensures dependency downloads are cached across builds.",
        moduleSlug: "layer-caching",
        category: "docker",
        language: "dockerfile"
    },
    {
        question: "How do you enforce Container Security in production deployments?",
        answer: "Key container security practices:\n1. Never run containers as root (`USER nonroot`).\n2. Set filesystems to read-only (`--read-only`).\n3. Drop all Linux capabilities except what is needed (`--cap-drop=ALL`).\n4. Scan images for vulnerabilities using tools like Trivy or Snyk.",
        example: `# Run secure container with dropped capabilities and read-only root
docker run -d \\
  --read-only \\
  --cap-drop=ALL \\
  --cap-add=NET_BIND_SERVICE \\
  --security-opt=no-new-privileges:true \\
  my-app`,
        explanation: "Dropping Linux capabilities prevents attackers who breach the container process from escalating privileges or manipulating the host kernel.",
        moduleSlug: "container-security",
        category: "docker",
        language: "bash"
    },
    {
        question: "How do you inspect and debug running containers?",
        answer: "Essential debugging commands:\n• `docker logs -f <container>`: Stream application stdout/stderr logs.\n• `docker exec -it <container> sh`: Open an interactive shell inside a running container.\n• `docker inspect <container>`: View low-level configuration, network IPs, and health check history.\n• `docker stats`: Monitor real-time CPU, RAM, and network I/O usage.",
        example: `# Inspect container exit code and error state
docker inspect --format='{{.State.ExitCode}}: {{.State.Error}}' my_failed_container`,
        explanation: "Formatting `docker inspect` with Go templates allows extracting exact error states and IP addresses without scrolling through megabytes of JSON.",
        moduleSlug: "debugging-containers",
        category: "docker",
        language: "bash"
    },

    // ==========================================
    // KUBERNETES (15 Modules)
    // ==========================================
    {
        question: "What is the difference between a Pod and a Deployment in Kubernetes?",
        answer: "• Pod: The smallest deployable computing unit in Kubernetes. A Pod encapsulates one or more containers that share storage, network IP address, and port space.\n• Deployment: A higher-level controller that manages Pod lifecycles declaratively. It handles automated rolling updates, rollbacks to previous revisions, self-healing (replacing crashed pods), and scaling.",
        example: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-deployment
spec:
  replicas: 3 # Maintains exactly 3 healthy Pod instances
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
      - name: nginx
        image: nginx:1.25-alpine
        ports:
        - containerPort: 80`,
        explanation: "If a worker node crashes, the Deployment controller automatically schedules replacement Pods on surviving nodes to maintain the desired replica count of 3.",
        moduleSlug: "pods-deployments",
        category: "kubernetes",
        language: "yaml"
    },
    {
        question: "How do Kubernetes Services (ClusterIP, NodePort, LoadBalancer) and Ingress work?",
        answer: "Because Pods are ephemeral and their IP addresses change on restart, **Services** provide stable IP addresses and DNS names to load-balance traffic across pods matching a label selector:\n\n• ClusterIP (default): Internal virtual IP accessible only within the cluster.\n• NodePort: Exposes the service on a static high port (30000–32767) on every cluster node's IP.\n• LoadBalancer: Provisions a cloud provider load balancer (AWS ALB, GCP Cloud LB).\n• Ingress: An API object that manages HTTP/HTTPS routing, SSL termination, and host/path-based routing to internal Services.",
        example: `apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
spec:
  rules:
  - host: app.domain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: web-service
            port:
              number: 80`,
        explanation: "Ingress acts as a smart reverse proxy, routing external domains and URL paths to internal ClusterIP services without paying for a separate cloud load balancer per service.",
        moduleSlug: "services-ingress",
        category: "kubernetes",
        language: "yaml"
    },
    {
        question: "How does Helm package and manage Kubernetes applications?",
        answer: "Helm is the package manager for Kubernetes. It packages YAML manifests into reusable **Helm Charts**, allowing parameterization through `values.yaml` templates.",
        example: `# Install a chart with custom overrides
helm install my-release bitnami/postgresql \\
  --set auth.username=dbadmin \\
  --set auth.database=production`,
        explanation: "Helm enables single-command rollbacks (`helm rollback <release> <revision>`) if a deployment introduces breaking regressions.",
        moduleSlug: "scaling-helm",
        category: "kubernetes",
        language: "bash"
    },
    {
        question: "What is the difference between ConfigMaps and Secrets in Kubernetes?",
        answer: "• ConfigMap: Stores non-confidential configuration data as key-value pairs or configuration files.\n• Secret: Stores confidential information (passwords, tokens, keys) base64-encoded and can be encrypted at rest in etcd. Both can be injected into containers as environment variables or mounted as files.",
        example: `apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  APP_ENV: "production"
  LOG_LEVEL: "info"`,
        explanation: "Separating configuration from container images allows updating app settings without rebuilding container images.",
        moduleSlug: "configmaps-secrets",
        category: "kubernetes",
        language: "yaml"
    },
    {
        question: "How do Namespaces isolate resources in Kubernetes clusters?",
        answer: "Namespaces provide virtual isolation within a single physical Kubernetes cluster. They partition cluster resources across teams, environments (dev, staging, prod), and projects, and support ResourceQuotas to limit CPU and memory usage.",
        example: `# Create namespace and view resources inside it
kubectl create namespace staging
kubectl get pods -n staging`,
        explanation: "Namespaces allow multiple teams to deploy apps with identical resource names (e.g. `service/web`) on the same shared cluster.",
        moduleSlug: "namespaces",
        category: "kubernetes",
        language: "bash"
    },
    {
        question: "What is a ReplicaSet and how does it relate to Deployments?",
        answer: "A ReplicaSet's sole purpose is to maintain a stable set of replica Pods running at any given time. Deployments wrap ReplicaSets and manage them during rolling updates.",
        example: `# View ReplicaSets created by a deployment
kubectl get replicasets`,
        explanation: "During a rolling update, a Deployment spins up a new ReplicaSet with the new image version while gradually scaling down the old ReplicaSet.",
        moduleSlug: "replicasets",
        category: "kubernetes",
        language: "bash"
    },
    {
        question: "How do PersistentVolumes (PV) and PersistentVolumeClaims (PVC) manage storage in Kubernetes?",
        answer: "• PersistentVolume (PV): A piece of storage in the cluster provisioned by an administrator or dynamically provisioned using StorageClasses.\n• PersistentVolumeClaim (PVC): A user's request for storage, specifying size and access modes (`ReadWriteOnce`, `ReadWriteMany`).",
        example: `apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: db-data-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 20Gi`,
        explanation: "Pods mount the PVC without needing to know whether the physical storage is an AWS EBS volume, Google Persistent Disk, or NFS share.",
        moduleSlug: "persistent-volumes-claims",
        category: "kubernetes",
        language: "yaml"
    },
    {
        question: "What is a StatefulSet and when should you use it over a Deployment?",
        answer: "StatefulSets are used for stateful applications (databases, Kafka, ZooKeeper) that require:\n1. Stable, unique network identifiers (e.g. `web-0`, `web-1`).\n2. Stable persistent storage tied to each specific pod ordinal.\n3. Ordered, graceful deployment and scaling.",
        example: `apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: redis-cluster
spec:
  serviceName: "redis"
  replicas: 3
  # Pods created strictly in order: redis-0, redis-1, redis-2`,
        explanation: "If `redis-1` fails, Kubernetes restarts it with the exact same hostname and re-attaches its specific persistent storage volume.",
        moduleSlug: "statefulsets",
        category: "kubernetes",
        language: "yaml"
    },
    {
        question: "How do Rolling Updates and Rollbacks work in Kubernetes Deployments?",
        answer: "A Rolling Update gradually replaces old Pods with new ones without downtime, governed by `maxSurge` (how many pods can be created above desired count) and `maxUnavailable`.",
        example: `# Check rollout status
kubectl rollout status deployment/web-deployment

# Instantly rollback to previous revision
kubectl rollout undo deployment/web-deployment`,
        explanation: "Rolling updates guarantee that traffic continues to be served by healthy pods throughout the entire deployment process.",
        moduleSlug: "rolling-updates-rollbacks",
        category: "kubernetes",
        language: "bash"
    },
    {
        question: "What is the difference between Liveness, Readiness, and Startup Probes in Kubernetes?",
        answer: "• **Liveness Probe**: Detects if the container crashed or deadlocked. If it fails, Kubernetes restarts the container.\n• **Readiness Probe**: Detects if the container is ready to accept user traffic. If it fails, the Pod's IP is removed from Service endpoints so no traffic is routed to it.\n• **Startup Probe**: Disables liveness and readiness checks until slow-starting applications have finished initial startup.",
        example: `livenessProbe:
  httpGet:
    path: /healthz
    port: 8080
  initialDelaySeconds: 5
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /ready
    port: 8080
  periodSeconds: 5`,
        explanation: "A failing readiness probe protects users from 502 Bad Gateway errors while warm-up caches or database connections are being established.",
        moduleSlug: "liveness-readiness-probes",
        category: "kubernetes",
        language: "yaml"
    },
    {
        question: "How does the Horizontal Pod Autoscaler (HPA) scale workloads automatically?",
        answer: "The HPA automatically scales the number of Pod replicas in a Deployment based on observed metrics such as CPU utilization, memory, or custom Prometheus metrics.",
        example: `apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: web-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: web-deployment
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70`,
        explanation: "When average CPU exceeds 70%, HPA automatically spins up additional Pod replicas up to the configured `maxReplicas` threshold.",
        moduleSlug: "horizontal-pod-autoscaler",
        category: "kubernetes",
        language: "yaml"
    },
    {
        question: "How does Role-Based Access Control (RBAC) secure Kubernetes clusters?",
        answer: "RBAC uses Roles (scoped to a namespace) or ClusterRoles (cluster-wide) to define permitted operations (verbs: `get`, `list`, `create`, `delete`) on resources (apiGroups: `pods`, `services`), bound to users or ServiceAccounts via RoleBindings.",
        example: `apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: default
  name: pod-reader
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["get", "list", "watch"]`,
        explanation: "RBAC enforces the principle of least privilege, preventing service accounts and CI/CD pipelines from accessing unauthorized cluster resources.",
        moduleSlug: "rbac-role-based-access-control",
        category: "kubernetes",
        language: "yaml"
    },
    {
        question: "What are essential kubectl commands for managing and debugging clusters?",
        answer: "• `kubectl get pods -A`: List all pods across all namespaces.\n• `kubectl describe pod <name>`: View event logs, probe failures, and image pull issues.\n• `kubectl logs -f <pod> -c <container>`: Stream container stdout.\n• `kubectl exec -it <pod> -- sh`: Open terminal inside pod.\n• `kubectl port-forward pod/<name> 8080:80`: Forward local port directly to pod.",
        example: `# Quick port forward to debug internal database
kubectl port-forward service/postgres-service 5432:5432`,
        explanation: "`port-forward` allows developers to connect local GUI database tools directly to internal Kubernetes services without exposing public ports.",
        moduleSlug: "kubectl-essentials",
        category: "kubernetes",
        language: "bash"
    },
    {
        question: "How do NetworkPolicies enforce zero-trust pod network isolation in Kubernetes?",
        answer: "By default, all pods in a Kubernetes cluster can communicate with all other pods across all namespaces. **NetworkPolicies** act as virtual firewalls to restrict ingress and egress traffic between pods based on labels.",
        example: `apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: db-policy
spec:
  podSelector:
    matchLabels:
      role: db
  ingress:
  - from:
    - podSelector:
        matchLabels:
          role: backend # Only backend pods can talk to the database!`,
        explanation: "Network policies prevent compromised frontend pods from scanning or connecting directly to internal database pods.",
        moduleSlug: "network-policies",
        category: "kubernetes",
        language: "yaml"
    },
    {
        question: "How do you create and structure a Helm Chart from scratch?",
        answer: "A standard Helm Chart contains:\n• `Chart.yaml`: Chart metadata and version.\n• `values.yaml`: Default configuration values.\n• `templates/`: Manifest templates rendered with Go templating syntax.",
        example: `# Create new chart scaffolding
helm create my-chart

# Test template rendering locally without installing
helm template my-release ./my-chart`,
        explanation: "`helm template` prints rendered YAML directly to the console, allowing validation of manifests before deploying to production clusters.",
        moduleSlug: "helm-charts-basics",
        category: "kubernetes",
        language: "bash"
    }
];
