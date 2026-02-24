#!/bin/sh
exec infisical run \
  --projectId "$INFISICAL_PROJECT_ID" \
  --env "$INFISICAL_ENVIRONMENT" \
  --path=/backend \
  -- "$@"