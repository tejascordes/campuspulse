.PHONY: all install dev build docs-serve docs-build run-client run-server lint test clean

all: install build

install:
	cd code && npm install
	pip install -r code/server/requirements.txt
	pip install mkdocs mkdocs-material

dev:
	@echo "Starting dev environment..."
	@echo "Run 'make run-server' and 'make run-client' in separate terminals."

run-client:
	cd code && npm run dev

run-server:
	cd code/server && uvicorn main:app --reload --host 0.0.0.0 --port 8000

build:
	cd code && npm run build

docs-serve:
	mkdocs serve

docs-build:
	mkdocs build

lint:
	cd code && npm run lint

test:
	pytest code/server

clean:
	rm -rf code/dist code/node_modules site .pytest_cache
