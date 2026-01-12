# Project Documentation: MERN Study Tracker with Ansible Deployment

**Date:** January 12, 2026
**Author:** Geeky Musafir & Antigravity (Assistant)
**Version:** 1.0.0

---

## 1. Executive Summary

This document serves as a comprehensive technical report for the **Study Tracker Application**, a full-stack web application designed to help users manage study subjects, log sessions, and track goals. The project evolved from a raw MERN (MongoDB, Express, React, Node.js) implementation to a fully automated, containerized deployment using **Docker** and **Ansible**, complete with a production-grade monitoring stack (Prometheus, Grafana, cAdvisor).

---

## 2. Technical Architecture

The system follows a microservices-like architecture where frontend, backend, database, and monitoring tools run as separate containerized services, orchestrated via Docker Compose and deployed automatically using Ansible.

### 2.1 Tech Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React + Vite | Clean, dark-themed UI with `recharts` for visualization. |
| **Backend** | Node.js + Express | RESTful API with JWT authentication. |
| **Database** | MongoDB Atlas | Cloud-hosted NoSQL database for persistence. |
| **Containerization** | Docker | Dockerfiles for custom service builds. |
| **Orchestration** | Docker Compose | Managing multi-container application lifecycle. |
| **Automation** | Ansible | Configuration management and automated deployment. |
| **Monitoring** | Prometheus & Grafana | Metrics collection and visualization. |
| **Reverse Proxy** | Nginx | Serving frontend and proxying API requests. |

### 2.2 System Diagram

```mermaid
graph TD
    User[User / Browser] -->|HTTP:80| Nginx[Nginx Proxy]
    
    subgraph "Docker Network (study-network)"
        Nginx -->|/api/*| Backend[Node.js API]
        Nginx -->|/| Frontend[React Static Files]
        Backend -->|Mongoose| Atlas[(MongoDB Atlas Cloud)]
        
        Prometheus[Prometheus] -->|Scrape| Backend
        Prometheus -->|Scrape| cAdvisor[cAdvisor]
        Grafana[Grafana] -->|Query| Prometheus
    end
    
    Ansible[Ansible Playbook] -->|Deploy| DockerCompose[Docker Compose]
```

---

## 3. Phase 1: MERN Application Development

### 3.1 Backend Engineering
We implemented a robust REST API using **Express.js**.
- **Authentication**: Secure `bcrypt` password hashing and `jsonwebtoken` (JWT) for session management.
- **Models**:
  - `User`: Auth credentials.
  - `Subject`: Study subjects with color tags.
  - `Session`: Logged study time linked to subjects.
  - `Goal`: Daily study targets.
- **API Endpoints**:
  - `POST /api/users/login`
  - `GET /api/subjects`
  - `POST /api/sessions`

### 3.2 Frontend Development
Built with **React (Vite)** for high performance.
- **State Management**: `AuthContext` for global user session handling.
- **UI/UX**: Custom dark mode CSS system (`index.css`), responsive `Navbar`, and animated transitions.
- **Visualization**: `recharts` used for:
  - Weekly Study Bar Charts.
  - Subject Distribution Pie Charts.

---

## 4. Phase 2: Containerization

To ensure consistency across environments, we containerized the application.

### 4.1 Backend Dockerfile
We used a lightweight Node.js alpine image.
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### 4.2 Frontend Dockerfile
We implemented a **multi-stage build** to optimize image size.
1. **Build Stage**: Compiles React code to static HTML/JS/CSS.
2. **Production Stage**: Serves static files using Nginx.
```dockerfile
# Stage 1: Build
FROM node:18-alpine as build
# ... (npm run build)

# Stage 2: Serve
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
```

---

## 5. Phase 3: Automation & Deployment (Ansible)

Manual deployment is error-prone. We utilized **Ansible** to automate the provisioning and deployment process.

### 5.1 Ansible Role Structure
We refactored the project to use modular Ansible roles:
- `common`: Installs system dependencies (apt packages).
- `docker`: Installs Docker Engine and Docker Compose Plugin.
- `backend` / `frontend`: Syncs source code using `rsync` (excluding `node_modules` for speed).
- `monitoring`: Configures Prometheus.
- `deployment`: Orchestrates the `docker compose up` command.

### 5.2 Deployment Playbook
The `playbook.yml` ties everything together, targeting the local machine (or remote server) and executing roles sequentially.

### 5.3 Deployment Commands
The entire stack is deployed with a single command:

```bash
cd ~/ansible/study-tracker/ansible
ansible-playbook -i inventory playbook.yml --ask-become-pass
```

---

## 6. Phase 4: Monitoring Strategy

To ensure reliability, we integrated a full monitoring stack.

- **Prometheus (Port 9090)**: Scrapes metrics from services. Configured via `prometheus.yml`.
- **Grafana (Port 3000)**: Visualizes data. Connects to Prometheus as a data source.
- **cAdvisor (Port 8081)**: Provides real-time metrics on Docker containers (CPU, Memory, Network usage).

---

## 7. Configuration Management

### 7.1 Environment Variables (.env)
We transitioned from local `.env` files to environment variables injected via `docker-compose.yml`.
**Crucial Fix**: Updated `MONGO_URI` to point to **MongoDB Atlas Production Cluster** instead of the local container to ensure data persistence.

```yaml
environment:
  - MONGO_URI=mongodb+srv://kavyauppin:xxxxx@study-tracker.0rt4b59.mongodb.net/?appName=study-tracker
  - NODE_ENV=production
```

### 7.2 Nginx Configuration
Custom `nginx.conf` handles routing:
- `/` → Serves Frontend Static Files.
- `/api/` → Proxies to Backend Container (`http://backend:5000/api/`).

---

## 8. Conclusion & Future Scope

The **Study Tracker** is now a production-ready, observable application. The infrastructure code (Ansible) ensures that the deployment is reproducible, scalable, and independent of the underlying host environment.

### Future Improvements
- **CI/CD Pipeline**: Integrate GitHub Actions to run the Ansible playbook on push.
- **SSL/HTTPS**: Implement Certbot/Let's Encrypt in the Nginx container.
- **Alerting**: Configure Grafana Alerting for high CPU usage or downtime.
