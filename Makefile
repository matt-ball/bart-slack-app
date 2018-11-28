BIN = node_modules/.bin

.PHONY: bootstrap lint start test

bootstrap:
	npm install

lint:
	$(BIN)/standard

start:
	npm start

test:
	make lint
	killall node
	make start &
	${BIN}/newman run https://www.getpostman.com/collections/83b74f2fa9a1b1792cd5 -e postman_environment.json
