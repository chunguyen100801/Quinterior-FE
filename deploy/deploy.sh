#!/bin/bash
# Get the commit ID
PORTAINER_URL=$1
PORTAINER_API_KEY=$2
PORTAINER_ENDPOINT=$3
STACK_ID=$4
DOCKER_ACCESS_TOKEN=$5
COMMIT_ID=$6

# Set up env
echo "BACKEND_ENDPOINT=" > .env
echo "NEXT_PUBLIC_EMAIL_ENCODDE_KEY=" >> .env
echo "NEXT_PUBLIC_HOST_URL=" >> .env
echo "NEXTAUTH_SECRET=" >> .env
echo "NEXT_PUBLIC_TINYMCE_API_KEY=" >> .env

# Login to Docker
echo $DOCKER_ACCESS_TOKEN | docker login -u phatnguyen1812 --password-stdin

# Build the Docker image
docker build -t datn-fe:$COMMIT_ID .
docker tag datn-fe:$COMMIT_ID phatnguyen1812/datn-fe:$COMMIT_ID
docker tag datn-fe:$COMMIT_ID phatnguyen1812/datn-fe:latest

# Push the Docker image
docker push phatnguyen1812/datn-fe:$COMMIT_ID
docker push phatnguyen1812/datn-fe:latest

# Get STACK_ID environment variables
echo "Deploying to Portainer"
python3 deploy/deploy_portainer.py $PORTAINER_URL $PORTAINER_API_KEY 2 $STACK_ID $COMMIT_ID