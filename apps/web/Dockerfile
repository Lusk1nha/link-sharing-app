FROM node:20-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN apk add --no-cache libc6-compat && \
  corepack enable

FROM base AS builder
RUN apk add --no-cache libc6-compat
RUN apk update

WORKDIR /app
RUN pnpm install turbo --global
COPY . .
RUN turbo prune @link-sharing-app/web --docker


FROM base AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app

COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN corepack enable
RUN pnpm i --frozen-lockfile

COPY --from=builder /app/out/full/ .
RUN pnpm run build --filter=@link-sharing-app/web...

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/standalone ./next/standalone
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/static ./next/standalone/apps/web/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/public ./next/standalone/apps/web/public

USER nextjs

EXPOSE 3000
ENV PORT 3000

ENV HOSTNAME "0.0.0.0"
CMD node next/standalone/apps/web/server.js