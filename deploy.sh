#!/bin/bash

# Live Comicverse Deployment Script
echo "🚀 Deploying Live Comicverse to Firebase..."

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Installing..."
    npm install -g firebase-tools
fi

# Check if user is logged in to Firebase
if ! firebase projects:list &> /dev/null; then
    echo "🔐 Please log in to Firebase..."
    firebase login
fi

# Build the project
echo "🔨 Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi

# Deploy to Firebase
echo "🌐 Deploying to Firebase Hosting..."
firebase deploy --only hosting

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🎉 Your Live Comicverse app is now live!"
    
    # Get the hosting URL
    PROJECT_ID=$(firebase use --current)
    echo "🔗 Visit your app at: https://$PROJECT_ID.web.app"
else
    echo "❌ Deployment failed. Please check the errors above."
    exit 1
fi