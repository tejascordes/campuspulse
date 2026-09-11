.PHONY: all install run-client run-server build lint test clean docs

all: install build

install:
	cd code && npm install
	pip install -r code/server/requirements.txt

run-client:
	cd code && npm run dev

run-server:
	cd code/server && uvicorn main:app --reload --host 0.0.0.0 --port 8000

build:
	cd code && npm run build

lint:
	cd code && npm run lint

test:
	pytest code/server

docs:
	mkdocs serve

clean:
	rm -rf code/dist code/node_modules site
