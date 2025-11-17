# Google Cloud Credentials Setup

## Error: "Failed to initialize BigQuery client: SyntaxError"

You're seeing this error because the `GOOGLE_CLOUD_CREDENTIALS` environment variable contains invalid JSON.

---

## How to Fix

### Step 1: Get Your Service Account JSON

1. Go to https://console.cloud.google.com
2. Select your project (or create one)
3. Navigate to: **IAM & Admin** → **Service Accounts**
4. Create a new service account (or use existing)
5. Grant these roles:
   - **BigQuery Data Editor**
   - **BigQuery Job User**
   - **Storage Object Creator**
6. Click **Add Key** → **Create New Key** → **JSON**
7. Download the JSON file

### Step 2: The JSON Should Look Like This

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBA...\n-----END PRIVATE KEY-----\n",
  "client_email": "your-service@your-project.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
}
```

### Step 3: Upload to Supabase Environment Variable

**IMPORTANT**: When uploading to the `GOOGLE_CLOUD_CREDENTIALS` environment variable:

1. ✅ **DO**: Copy the ENTIRE contents of the JSON file
2. ✅ **DO**: Paste it exactly as-is
3. ✅ **DO**: Include the opening `{` and closing `}`
4. ❌ **DON'T**: Add extra quotes around the JSON
5. ❌ **DON'T**: Wrap it in a string
6. ❌ **DON'T**: Remove or escape any characters

**Wrong** ❌:
```
"{ \"type\": \"service_account\", ... }"
```

**Correct** ✅:
```
{
  "type": "service_account",
  "project_id": "your-project",
  ...
}
```

### Step 4: Verify the Upload

After uploading, the backend logs should show:

```
✅ BigQuery credentials loaded for project: your-project-id
✅ BigQuery ready for ML training
```

If you see errors, check the first 100 characters shown in the error message.

---

## Common Issues

### Issue: "Unexpected non-whitespace character"

**Cause**: Extra characters before or after the JSON

**Fix**: Make sure there are NO extra characters. The content should start with `{` and end with `}`

### Issue: "Unexpected token"

**Cause**: The JSON is wrapped in quotes or escaped

**Fix**: Don't add quotes. Paste the raw JSON directly.

### Issue: "Missing required fields"

**Cause**: Incomplete JSON or wrong file uploaded

**Fix**: Make sure you downloaded the JSON key file (not a P12 or other format)

---

## Testing After Upload

1. Refresh the System Test screen
2. Click "Run System Tests" 
3. You should see:
   - ✅ Backend API Health: healthy
   - ✅ BigQuery Connection: connected

---

## Alternative: Run Without BigQuery

If you want to test the app without setting up Google Cloud:

- The app will work in **mock mode**
- All features work with simulated data
- Data is stored in Supabase KV store only
- You can add BigQuery later

**The app is fully functional without BigQuery credentials!**

---

## Need Help?

Check the backend logs in Supabase Dashboard:
1. Go to Functions → server → Logs
2. Look for BigQuery initialization messages
3. Check for detailed error messages

The error message will show you the first 100 characters of what was uploaded to help diagnose the issue.
