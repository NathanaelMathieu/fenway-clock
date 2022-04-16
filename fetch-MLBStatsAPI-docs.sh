#!/bin/bash

ENDPOINTS=()

for i in "$@"
do
    ENDPOINTS+=("$i")
done

for i in "${ENDPOINTS[@]}"
do
    echo "Fetching MLB StatsAPI OpenAPI JSON documentation for endpoint '$i'";
    npx openapi-typescript "https://statsapi.mlb.com/docs/$i/swagger.json" --output "src/custom-typings/mlb-stats-api/generated-types/$i.d.ts"
done