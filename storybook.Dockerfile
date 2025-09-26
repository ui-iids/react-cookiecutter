FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json ./
RUN npm install -g pnpm && pnpm i

COPY src src
COPY .storybook .storybook
COPY public public
RUN pnpm run build-storybook

FROM nginx:alpine AS runtime

COPY --from=builder /app/storybook-static /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]