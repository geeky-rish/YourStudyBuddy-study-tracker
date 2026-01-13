Write-Host "Starting Deployment Process..."

Write-Host "Building Backend Image (study-backend:latest)..."
minikube image build -t study-backend:latest ./backend
if ($LASTEXITCODE -ne 0) { Write-Error "Backend build failed"; exit 1 }

Write-Host "Building Frontend Image (study-frontend:latest)..."
minikube image build -t study-frontend:latest ./frontend
if ($LASTEXITCODE -ne 0) { Write-Error "Frontend build failed"; exit 1 }

Write-Host "Applying Kubernetes Manifests..."
kubectl apply -f k8s/
if ($LASTEXITCODE -ne 0) { Write-Error "Kubectl apply failed"; exit 1 }

Write-Host "Deployment Applied Successfully!"
Write-Host "Waiting for pods to stabilize..."
Start-Sleep -Seconds 10
kubectl get pods
minikube service list
