# Deploying Spile Website to Google Cloud Platform

## Prerequisites
- GCP account with billing enabled
- Domain name ownership
- Local development environment with:
  - Node.js and npm installed
  - Google Cloud SDK installed
  - `gcloud` CLI authenticated

## Step 1: Project Setup

1. Create a new GCP project (if not existing):
```bash
gcloud projects create spile-website --name="Spile Website"
gcloud config set project spile-website
```

2. Enable required APIs:
```bash
gcloud services enable compute.googleapis.com
gcloud services enable dns.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

## Step 2: Build the Website

1. Create a production build:
```bash
npm install
npm run build
```

2. Create a simple server.js file for serving the static content:
```javascript
const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const port = process.env.PORT || 8080;
app.listen(port);
```

3. Create a Dockerfile:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY build/ ./build/
COPY server.js ./

RUN npm install --production

EXPOSE 8080
CMD [ "node", "server.js" ]
```

## Step 3: Deploy to Cloud Run

1. Build and deploy to Cloud Run:
```bash
gcloud builds submit --tag gcr.io/spile-website/website
gcloud run deploy spile-website \
  --image gcr.io/spile-website/website \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

## Step 4: DNS Configuration

1. Create a DNS zone in Cloud DNS:
```bash
gcloud dns managed-zones create spile-tech \
  --dns-name="spile.tech." \
  --description="Spile website DNS zone"
```

2. Get the nameservers assigned by Google:
```bash
gcloud dns managed-zones describe spile-tech \
  --format="get(nameServers)"
```

3. Update your domain registrar's nameservers with the ones provided by Google Cloud DNS.

4. Add DNS records:
```bash
# Get your Cloud Run URL first
CLOUD_RUN_URL=$(gcloud run services describe spile-website \
  --platform managed \
  --region us-central1 \
  --format="get(status.url)")

# Add A record
gcloud dns record-sets transaction start --zone=spile-tech
gcloud dns record-sets transaction add \
  --name="spile.tech." \
  --type=A \
  --ttl=300 \
  --zone=spile-tech \
  "${CLOUD_RUN_URL}"

# Add CNAME for www subdomain
gcloud dns record-sets transaction add \
  --name="www.spile.tech." \
  --type=CNAME \
  --ttl=300 \
  --zone=spile-tech \
  "spile.tech."

gcloud dns record-sets transaction execute --zone=spile-tech
```

## Step 5: SSL Certificate Setup

1. Set up a Cloud Load Balancer with SSL:
```bash
# Reserve a static IP
gcloud compute addresses create spile-website-ip \
  --global

# Create SSL certificate
gcloud compute ssl-certificates create spile-website-cert \
  --domains="spile.tech,www.spile.tech"

# Create backend service
gcloud compute backend-services create spile-website-backend \
  --global

# Create URL map
gcloud compute url-maps create spile-website-urlmap \
  --default-service spile-website-backend

# Create HTTPS proxy
gcloud compute target-https-proxies create spile-website-https-proxy \
  --url-map spile-website-urlmap \
  --ssl-certificates spile-website-cert

# Create forwarding rule
gcloud compute forwarding-rules create spile-website-forwarding-rule \
  --global \
  --target-https-proxy spile-website-https-proxy \
  --ports=443 \
  --address spile-website-ip
```

## Step 6: Verification and Testing

1. Verify DNS propagation:
```bash
dig spile.tech
dig www.spile.tech
```

2. Test HTTPS:
```bash
curl -I https://spile.tech
curl -I https://www.spile.tech
```

## Monitoring Setup

1. Set up basic monitoring:
```bash
# Enable monitoring API
gcloud services enable monitoring.googleapis.com

# Create uptime check
gcloud monitoring uptime-checks create http spile-website-uptime \
  --display-name="Spile Website Uptime" \
  --uri="https://spile.tech" \
  --period=300s
```

2. Set up alerting:
```bash
# Create notification channel (email)
gcloud alpha monitoring channels create \
  --display-name="Spile Website Alerts" \
  --type=email \
  --email-address=alerts@spile.tech

# Create alerting policy
gcloud alpha monitoring policies create \
  --display-name="Spile Website Down" \
  --condition-filter="resource.type = \"uptime_url\" AND metric.type = \"monitoring.googleapis.com/uptime_check/check_passed\" AND metric.labels.check_id = \"spile-website-uptime\"" \
  --condition-threshold-duration=300s \
  --condition-threshold-value=0 \
  --notification-channels="projects/spile-website/notificationChannels/CHANNEL_ID"
```

## Cost Optimization

- Cloud Run: Pay only for actual usage
- Cloud DNS: ~$0.20 per hosted zone per month + $0.40 per million queries
- Load Balancer: ~$18/month + traffic costs
- Monitoring: Free tier includes most basic needs

## Maintenance Notes

1. Regular updates:
```bash
# Update dependencies
npm update

# Rebuild and redeploy
npm run build
gcloud builds submit --tag gcr.io/spile-website/website
gcloud run deploy spile-website --image gcr.io/spile-website/website
```

2. Monitor costs:
```bash
gcloud billing projects describe spile-website \
  --format="get(billingEnabled)"
```

## Troubleshooting

Common issues and solutions:

1. DNS not propagating:
- Verify nameserver configuration at registrar
- Check DNS records in Cloud DNS
- Wait for TTL period

2. SSL certificate issues:
- Verify domain ownership
- Check certificate status:
```bash
gcloud compute ssl-certificates describe spile-website-cert
```

3. 502 Bad Gateway:
- Check Cloud Run service logs:
```bash
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=spile-website"
```
