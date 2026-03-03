FROM node:20.18.2

# Install PM2 globally
RUN npm install pm2 -g

COPY ./dist /aibit-api/dist
COPY node_modules /aibit-api/node_modules
COPY .env.example /aibit-api/.env.example
# Set the working directory
WORKDIR /aibit-api

