#!/usr/bin/env bash

# Ajuste os nomes antes de executar. O ACR precisa ter nome unico globalmente.
RESOURCE_GROUP="rg-stadium-control"
LOCATION="eastus"
ACR_NAME="acrstadiumcontrol123"
IMAGE_NAME="stadium-control-api"
TAG="v1"

az login

az group create \
  --name "$RESOURCE_GROUP" \
  --location "$LOCATION"

az acr create \
  --resource-group "$RESOURCE_GROUP" \
  --name "$ACR_NAME" \
  --sku Basic

az acr login \
  --name "$ACR_NAME"

LOGIN_SERVER=$(az acr show \
  --name "$ACR_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --query loginServer \
  --output tsv)

docker build -t "$IMAGE_NAME:$TAG" .
docker tag "$IMAGE_NAME:$TAG" "$LOGIN_SERVER/$IMAGE_NAME:$TAG"
docker push "$LOGIN_SERVER/$IMAGE_NAME:$TAG"

az acr repository list \
  --name "$ACR_NAME" \
  --output table

az acr repository show-tags \
  --name "$ACR_NAME" \
  --repository "$IMAGE_NAME" \
  --output table

# Execute no final da prova para evitar custos.
az group delete \
  --name "$RESOURCE_GROUP" \
  --yes
