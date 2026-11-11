.PHONY: dev build preview clean lint format type check ci

dev:
	npm run dev

build:
	npm run build

preview:
	npm run preview

clean:
	rm -rf dist .astro

lint:
	npm run lint

format:
	npm run format

type:
	npm run typecheck

check:
	npm run lint:fix
	npm run format
	npm run typecheck

ci:
	npm run lint
	npm run format:check
	npm run typecheck