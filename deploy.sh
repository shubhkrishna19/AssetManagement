#!/bin/bash
# Deploy script for Asset Management App to Zoho Catalyst

echo "=== Asset Management Deployment Script ==="
echo ""

# Build frontend
echo "Step 1: Building frontend..."
npm run build
if [ $? -ne 0 ]; then
    echo "Build failed!"
    exit 1
fi

# Copy to client folder
echo "Step 2: Copying build to client folder..."
mkdir -p client
cp -r dist/* client/

# Deploy to Catalyst
echo "Step 3: Deploying to Catalyst..."
npx catalyst deploy

echo ""
echo "=== Deployment Complete ==="
echo "Frontend: https://coredev-913495338.development.catalystserverless.com/app/"
echo "Backend:  https://coredev-913495338.development.catalystserverless.com/server/bridgex/"
