

FROM node:22-bookworm AS node

WORKDIR /app

RUN npm i -g pnpm@10

COPY package.json .
COPY pnpm-lock.yaml .
RUN pnpm install --frozen-lockfile

COPY . .

CMD ['npm', 'run', 'start-bad']