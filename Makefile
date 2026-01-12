DEPLOY_DIR = ./deploy
ANSIBLE_DIR = ./ansible

.PHONY: help deploy up down restart logs status clean

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Targets:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

deploy: ## Run Ansible playbook to provision and deploy the app
	cd $(ANSIBLE_DIR) && ansible-playbook -i inventory playbook.yml --ask-become-pass

up: ## Start the application containers (in deployed directory)
	@echo "Starting application..."
	cd $(DEPLOY_DIR) && docker compose up -d
	@echo "App is running at http://localhost"

down: ## Stop and remove application containers
	@echo "Stopping application..."
	cd $(DEPLOY_DIR) && docker compose down
	@echo "App stopped."

restart: down up ## Restart the application

logs: ## Follow logs of all containers
	cd $(DEPLOY_DIR) && docker compose logs -f

status: ## Show running containers
	cd $(DEPLOY_DIR) && docker compose ps

clean: down ## Clean up deployment directory (Caution: removes data inside deploy dir if not mounted)
	@echo "Cleaning up..."
	# rm -rf $(DEPLOY_DIR) # Uncomment if you want to fully remove the deploy dir
	@echo "To remove the deployment files completely, run: rm -rf $(DEPLOY_DIR)"
