FROM oven/bun:1.3.9 AS base
RUN bun add turbo --global


# Package dependencies (pruned for caching)
FROM base AS pruner
WORKDIR /app

COPY . .
RUN turbo prune --scope=@repo/api --docker


# Build app
FROM base AS builder
WORKDIR /app

COPY --from=pruner /app/out/bun.lock ./bun.lock
COPY --from=pruner /app/out/json/ .

RUN bun install --frozen-lockfile

COPY --from=pruner /app/out/full/ .
RUN turbo build --filter=@repo/api
RUN rm -rf ./**/*/src


# Finalise Core Image
FROM oven/bun:1.3.9 AS runner

RUN groupadd --system --gid 1001 api
RUN useradd --system --uid 1001 -g api api

WORKDIR /app/apps/api
ENV NODE_ENV=production

COPY --from=builder --chown=api:api /app/apps/api/dist ./dist
RUN chown api:api /app/apps/api

EXPOSE 8000

FROM runner AS dev
USER api
CMD ["bun", "dist/index.js"]

# TODO: Uncomment this if you want to use infisical, or remove it if not!
# # --- Prod target (default, with infisical) ---
# FROM runner AS prod
# RUN apt-get update && apt-get install -y bash curl && \
#     curl -1sLf 'https://artifacts-cli.infisical.com/setup.deb.sh' | bash && \
#     apt-get update && apt-get install -y infisical=0.43.51

# COPY ./apps/api/image/entrypoint.sh /entrypoint.sh
# RUN chmod +x /entrypoint.sh

# USER api
# ENTRYPOINT ["/entrypoint.sh"]
# CMD ["bun", "dist/index.js"]