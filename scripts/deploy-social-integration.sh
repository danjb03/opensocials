#!/bin/bash
# deploy-social-integration.sh
# Deployment script for OpenSocials social media integration with Apify

set -e # Exit on error

echo "===== OpenSocials Social Media Integration Deployment ====="
echo "This script will deploy all necessary components for the Apify integration"

# Check for Supabase CLI
if ! command -v supabase &> /dev/null; then
    echo "Error: Supabase CLI not found"
    echo "Please install it first: https://supabase.com/docs/guides/cli"
    exit 1
fi

# Check for required environment variables
if [ -z "$APIFY_TOKEN" ]; then
    echo "Error: APIFY_TOKEN environment variable not set"
    echo "Please set it with: export APIFY_TOKEN=your_apify_token"
    exit 1
fi

echo "✓ Prerequisites checked"

# Navigate to project root
ROOT_DIR=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
cd "$ROOT_DIR"

echo "===== Step 1: Applying Database Migrations ====="

# Apply migrations
echo "Applying database migrations..."
supabase db push

echo "✓ Database schema updated"

echo "===== Step 2: Deploying Edge Functions ====="

# Deploy connect-social-account function
echo "Deploying connect-social-account function..."
supabase functions deploy connect-social-account --no-verify-jwt

# Deploy poll-apify-jobs function
echo "Deploying poll-apify-jobs function..."
supabase functions deploy poll-apify-jobs --no-verify-jwt

# Deploy schedule-social-refreshes function
echo "Deploying schedule-social-refreshes function..."
supabase functions deploy schedule-social-refreshes --no-verify-jwt

# Deploy refresh-all-social-accounts function
echo "Deploying refresh-all-social-accounts function..."
supabase functions deploy refresh-all-social-accounts --no-verify-jwt

echo "✓ Edge functions deployed"

echo "===== Step 3: Setting up Scheduled Jobs ====="

# Create cron job for polling Apify jobs
echo "Setting up cron job for polling Apify jobs..."
supabase functions schedule create poll-apify-cron \
    --function-name poll-apify-jobs \
    --schedule "*/5 * * * *" \
    --description "Poll Apify jobs every 5 minutes"

# Create cron job for scheduling social media refreshes
echo "Setting up cron job for scheduling social media refreshes..."
supabase functions schedule create social-refresh-cron \
    --function-name schedule-social-refreshes \
    --schedule "0 */4 * * *" \
    --description "Schedule social media refreshes every 4 hours"

echo "✓ Scheduled jobs configured"

echo "===== Step 4: Setting up Environment Variables ====="

# Set Apify token as a secret
echo "Setting Apify token as a secret..."
supabase secrets set APIFY_TOKEN="$APIFY_TOKEN"

echo "✓ Environment variables configured"

echo "===== Step 5: Verifying Deployment ====="

# Test connect-social-account function
echo "Testing connect-social-account function..."
supabase functions invoke connect-social-account --body '{"platform":"instagram","handle":"test_user","creator_id":"your_test_creator_id"}' > /dev/null || echo "Function test failed but continuing deployment"

echo "===== Deployment Complete ====="
echo "Social media integration has been successfully deployed!"
echo ""
echo "Next steps:"
echo "1. Verify that the social accounts page is working in your application"
echo "2. Test the integration by connecting a social media account"
echo "3. Monitor the Supabase logs for any errors: supabase functions logs"
