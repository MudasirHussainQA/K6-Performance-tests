# Makefile for K6 Contact List Test Suite (TypeScript)

.PHONY: help install build test smoke load stress spike auth contacts clean

# Default target
.DEFAULT_GOAL := help

# Colors for output
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[0;33m
NC := \033[0m # No Color

help: ## Show this help message
	@echo "$(BLUE)K6 Contact List Test Suite (TypeScript)$(NC)"
	@echo ""
	@echo "$(GREEN)Available targets:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-15s$(NC) %s\n", $$1, $$2}'

install: ## Install dependencies
	@echo "$(GREEN)Installing dependencies...$(NC)"
	npm install

build: ## Build TypeScript to JavaScript
	@echo "$(GREEN)Building TypeScript...$(NC)"
	npm run build

build-dev: ## Build TypeScript in development mode
	@echo "$(GREEN)Building TypeScript (dev mode)...$(NC)"
	npm run build:dev

watch: ## Watch and auto-rebuild on changes
	@echo "$(GREEN)Starting watch mode...$(NC)"
	npm run watch

type-check: ## Type check without building
	@echo "$(GREEN)Type checking...$(NC)"
	npm run type-check

lint: ## Run ESLint
	@echo "$(GREEN)Running linter...$(NC)"
	npm run lint

test: build ## Build and run all tests (smoke test by default)
	@echo "$(GREEN)Running smoke tests...$(NC)"
	npm test

smoke: build ## Build and run smoke tests
	@echo "$(GREEN)Running smoke tests...$(NC)"
	k6 run dist/main.js --env TEST_TYPE=smoke

load: build ## Build and run load tests
	@echo "$(GREEN)Running load tests...$(NC)"
	k6 run dist/load-test.js

stress: build ## Build and run stress tests
	@echo "$(YELLOW)Running stress tests...$(NC)"
	k6 run dist/stress-test.js

spike: build ## Build and run spike tests
	@echo "$(YELLOW)Running spike tests...$(NC)"
	k6 run dist/main.js --env TEST_TYPE=spike

auth: build ## Build and run authentication tests only
	@echo "$(GREEN)Running authentication tests...$(NC)"
	k6 run dist/auth.test.js

auth-negative: build ## Build and run negative authentication tests
	@echo "$(GREEN)Running negative authentication tests...$(NC)"
	k6 run dist/negative-auth.test.js

contacts: build ## Build and run contact management tests only
	@echo "$(GREEN)Running contact management tests...$(NC)"
	k6 run dist/contacts.test.js

contacts-negative: build ## Build and run negative contact tests
	@echo "$(GREEN)Running negative contact tests...$(NC)"
	k6 run dist/negative-contacts.test.js

all-scenarios: auth auth-negative contacts contacts-negative ## Build and run all test scenarios

clean: ## Clean generated files
	@echo "$(YELLOW)Cleaning generated files...$(NC)"
	rm -rf dist/
	rm -rf node_modules/
	rm -f *.log
	@echo "$(GREEN)Clean complete!$(NC)"

clean-dist: ## Clean only dist folder
	@echo "$(YELLOW)Cleaning dist folder...$(NC)"
	rm -rf dist/
	@echo "$(GREEN)Dist folder cleaned!$(NC)"

check-k6: ## Check if K6 is installed
	@command -v k6 >/dev/null 2>&1 || { echo "$(YELLOW)K6 is not installed. Please install it first.$(NC)"; exit 1; }
	@echo "$(GREEN)K6 is installed: $$(k6 version)$(NC)"

check-node: ## Check if Node.js is installed
	@command -v node >/dev/null 2>&1 || { echo "$(YELLOW)Node.js is not installed. Please install it first.$(NC)"; exit 1; }
	@echo "$(GREEN)Node.js is installed: $$(node --version)$(NC)"

setup: check-k6 check-node install ## Setup the test environment
	@echo "$(GREEN)Setting up test environment...$(NC)"
	@if [ ! -f .env ]; then cp .env.example .env; echo "Created .env file"; fi
	@npm run build
	@echo "$(GREEN)Setup complete!$(NC)"

version: ## Show K6 and Node versions
	@echo "K6 version: $$(k6 version)"
	@echo "Node version: $$(node --version)"
	@echo "NPM version: $$(npm --version)"

.PHONY: test-quick
test-quick: build ## Quick test with 1 VU for 30s
	@echo "$(GREEN)Running quick test...$(NC)"
	k6 run --vus 1 --duration 30s dist/main.js

.PHONY: rebuild
rebuild: clean-dist build ## Clean dist and rebuild

.PHONY: dev
dev: build-dev ## Build in dev mode and run smoke test
	@echo "$(GREEN)Running dev test...$(NC)"
	k6 run dist/main.js
