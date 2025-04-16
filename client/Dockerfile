FROM node:18-alpine AS builder

WORKDIR /app

# COPY package*.json ./

COPY . .

ARG VITE_API_BASE
ARG VITE_API_URL

ENV VITE_API_BASE=$VITE_API_BASE
ENV VITE_API_URL=$VITE_API_URL

RUN npm ci
RUN npm install
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY conf/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000