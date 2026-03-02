# ==============================
# Stage 1: Build
# ==============================
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG BACKEND_URL
ENV BACKEND_URL=$BACKEND_URL

RUN npm run build -- --configuration production

# ==============================
# Stage 2: Runtime
# ==============================
FROM nginx:alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/wine-encyclopedia-frontend /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
