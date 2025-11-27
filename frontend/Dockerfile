# Stage 1: Build
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine

# Install gettext for envsubst (optional) and use sed in entrypoint
RUN apk add --no-cache gettext

# Copy built app
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Custom entrypoint to inject runtime env
RUN <<'EOF'
set -e
cat >/docker-entrypoint.sh <<'SH'
#!/bin/sh
# Replace placeholder with runtime env if defined
if [ ! -z "$VITE_API_BASE_URL" ]; then
  sed -i "s|API_BASE_URL_PLACEHOLDER|$VITE_API_BASE_URL|g" /usr/share/nginx/html/env.js || true
fi
exec nginx -g "daemon off;"
SH
EOF

RUN chmod +x /docker-entrypoint.sh

EXPOSE 80
CMD ["/docker-entrypoint.sh"]

