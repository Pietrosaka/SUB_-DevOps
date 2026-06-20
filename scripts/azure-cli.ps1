$ResourceGroup = "rg-stadium-control"
$Location = "eastus"
$AcrName = "acrstadiumcontrol123"
$ImageName = "stadium-control-api"
$Tag = "v1"

# Ajuste o nome do ACR antes de executar. Ele precisa ser unico globalmente.
az login

az group create `
  --name $ResourceGroup `
  --location $Location

az acr create `
  --resource-group $ResourceGroup `
  --name $AcrName `
  --sku Basic

az acr login `
  --name $AcrName

$LoginServer = az acr show `
  --name $AcrName `
  --resource-group $ResourceGroup `
  --query loginServer `
  --output tsv

docker build -t "${ImageName}:${Tag}" .
docker tag "${ImageName}:${Tag}" "${LoginServer}/${ImageName}:${Tag}"
docker push "${LoginServer}/${ImageName}:${Tag}"

az acr repository list `
  --name $AcrName `
  --output table

az acr repository show-tags `
  --name $AcrName `
  --repository $ImageName `
  --output table

# Execute no final da prova para evitar custos.
az group delete `
  --name $ResourceGroup `
  --yes
