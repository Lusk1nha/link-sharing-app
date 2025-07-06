FROM node:20-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN apk add --no-cache libc6-compat && \
  corepack enable && \
  pnpm install turbo --global

FROM base AS builder
RUN apk add --no-cache openssl
WORKDIR /usr/src/app
COPY package.json pnpm-lock.yaml* ./

COPY . .
RUN turbo prune --scope=@link-sharing-app/api --docker

FROM base AS installer
WORKDIR /usr/src/app

ARG DATABASE_URL="file:./dummy.db"
ENV DATABASE_URL=${DATABASE_URL}

COPY .gitignore .gitignore

COPY --from=builder /usr/src/app/out/json/ .
COPY --from=builder /usr/src/app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /usr/src/app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder /usr/src/app/out/full/ .

RUN pnpm install --no-frozen-lockfile
COPY turbo.json turbo.json
RUN npx prisma generate --schema apps/api/src/prisma/schema.prisma
RUN turbo run build --filter=@link-sharing-app/api...

FROM node:20-alpine AS runner
WORKDIR /usr/src/app

RUN apk add --no-cache openssl && \
  addgroup --system --gid 1001 nodejs && \
  adduser --system --uid 1001 nodejs

COPY --from=installer --chown=nodejs:nodejs /usr/src/app/package.json ./package.json
COPY --from=installer --chown=nodejs:nodejs /usr/src/app/node_modules ./node_modules
COPY --from=installer --chown=nodejs:nodejs /usr/src/app/apps/api/package.json ./apps/api/package.json
COPY --from=installer --chown=nodejs:nodejs /usr/src/app/apps/api/dist ./apps/api/dist
COPY --from=installer --chown=nodejs:nodejs /usr/src/app/apps/api/node_modules ./apps/api/node_modules
COPY --from=installer --chown=nodejs:nodejs /usr/src/app/apps/api/src/prisma ./apps/api/src/prisma
COPY --from=installer --chown=nodejs:nodejs /usr/src/app/packages ./packages

USER nodejs
WORKDIR /usr/src/app/apps/api
RUN npx prisma generate
CMD node dist/main.js
