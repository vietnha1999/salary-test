## Document
[Design](./doc/design.md)

## Prerequisites
- NodeJS 18
- Docker
- Nginx

## Installation

```bash
$ npm install
```

## Running the database
```bash
$ docker compose up -d
```

## Building the app
```bash
# build
$ npm run build
```

## Running the app in standalone mode

```bash
# init .env file
$ cat > .env << EOL
TZ=UTC
PORT=3000
REDIS_HOST=localhost
REDIS_PORT=6379
MONGODB_URI=mongodb://root:password123@localhost:27017/?authMechanism=DEFAULT
EOL

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ node dist/main
```

## Set up a cron job to calculate the balance of all users at once every midnight
```bash
# find absolute path of node
$ which node

# find absolute path of project
$ pwd

# edit cron tab
$ crontab -e

# add this line
$ 0 0 * * * cd ${absolute-path-of-project} && ${absolute-path-of-node} dist/cron/update-latest-balance.js
```

## Running the app in cluster mode
```bash
# update nginx config
$ sudo sh -c "cat > /etc/nginx/conf.d/default.conf << EOL
upstream backend {
  server localhost:3000;
  server localhost:3001;
  server localhost:3002;
}

server {
  listen 8080;
  location / {
    proxy_pass http://backend;
  }
}
EOL"

# reload nginx
$ sudo systemctl reload nginx

# run cluster
$ sh ./run-cluster.sh
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
