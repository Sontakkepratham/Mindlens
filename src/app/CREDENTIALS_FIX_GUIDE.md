# 🔧 How to Fix BigQuery Credentials Error

## Current Problem

The `GOOGLE_CLOUD_CREDENTIALS` environment variable contains:
```
993a77256e1621257a364b788520a143a4bd06f6e8b5dd9b61cab987a266e2b5
```

This is a **HASH**, not JSON. The backend cannot parse it.

---

## Why This Happened

When you uploaded the credentials to Supabase, they were:
- Encrypted/hashed by a security tool
- Base64 encoded
- Or wrapped in quotes

The backend needs **raw JSON text**, not encrypted/encoded data.

---

## Step-by-Step Fix

### Step 1: Delete the Existing Variable

1. Go to your Supabase Dashboard
2. Navigate to: **Settings** → **Edge Functions** → **Secrets**
3. Find `GOOGLE_CLOUD_CREDENTIALS`
4. **Delete it completely**

### Step 2: Get Your Service Account JSON

1. Go to https://console.cloud.google.com/iam-admin/serviceaccounts
2. Select your project (or create a new one)
3. Click **Create Service Account** (or select existing)
4. Grant these roles:
   - **BigQuery Data Editor**
   - **BigQuery Job User**
   - **Storage Object Creator** (optional, for exports)
5. Click **Keys** tab → **Add Key** → **Create New Key**
6. Choose **JSON** format
7. Download the file (e.g., `mindlens-service-account.json`)

### Step 3: Validate the JSON (IMPORTANT!)

**Use the MindLens credentials validator:**

1. In the app, click: **"🔧 Fix BigQuery Credentials"**
2. Open your downloaded JSON file in a text editor
3. Copy **EVERYTHING** from `{` to `}`
4. Paste into the validator
5. Wait for ✅ **"Valid JSON - Ready to upload!"**

### Step 4: Upload to Supabase (Correctly)

1. Click **"Copy Validated JSON"** in the validator
2. Go to Supabase: **Settings** → **Edge Functions** → **Secrets**
3. Click **Add new secret**
4. Name: `GOOGLE_CLOUD_CREDENTIALS`
5. Value: **Paste the JSON** (don't add quotes!)
6. Click **Save**

### Step 5: Redeploy the Server

After uploading:
1. Go to **Functions** → **server**
2. Click **Redeploy**
3. Wait for deployment to complete

### Step 6: Verify It Works

1. In MindLens, go to System Test screen
2. Click **"Run Tests Again"**
3. You should see:
   - ✅ BigQuery Connection: connected
   - ✅ Data Pipeline: active

---

## What the JSON Should Look Like

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQ...\n-----END PRIVATE KEY-----\n",
  "client_email": "service@your-project.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
}
```

**Important:**
- Must start with `{` and end with `}`
- No extra quotes around the whole thing
- No `KEY=` prefix
- No base64 encoding
- No extra characters

---

## Common Mistakes

### ❌ Wrong: Wrapped in Quotes
```
"{\"type\":\"service_account\",\"project_id\":\"...\"}"
```

### ❌ Wrong: Base64 Encoded
```
eyJ0eXBlIjoic2VydmljZV9hY2NvdW50IiwicHJvamVjdF9pZCI6Li4ufQ==
```

### ❌ Wrong: With Prefix
```
GOOGLE_CLOUD_CREDENTIALS={"type":"service_account",...}
```

### ✅ Correct: Raw JSON
```json
{"type":"service_account","project_id":"your-project",...}
```

---

## Testing Without BigQuery

**You don't need to fix this right now!**

The app works perfectly without BigQuery:
- ✅ All core features functional
- ✅ Data stored in Supabase (encrypted)
- ✅ PHQ-9 assessments work
- ✅ Face scanning works
- ✅ Counselor recommendations work

**BigQuery is only needed for:**
- ML model training on large datasets
- Advanced analytics
- Exporting training data

You can use the app now and fix BigQuery later!

---

## Still Having Issues?

### Check Backend Logs

1. Go to Supabase Dashboard
2. **Functions** → **server** → **Logs**
3. Look for these messages:

**Success:**
```
✅ BigQuery credentials loaded for project: your-project-id
✅ BigQuery ready for ML training
```

**Failure:**
```
❌ GOOGLE_CLOUD_CREDENTIALS does not appear to be JSON
First 100 chars: 993a77256e1621257a364b788520a143...
```

### The JSON Starts with a Hash?

This confirms the credentials are encrypted. Follow the steps above to delete and re-upload.

### "Missing required fields" Error?

Make sure you copied the ENTIRE JSON file. Use the validator tool to check.

---

## Quick Checklist

- [ ] Delete existing `GOOGLE_CLOUD_CREDENTIALS` variable
- [ ] Download fresh JSON from Google Cloud Console
- [ ] Validate JSON using MindLens credentials tool
- [ ] Copy the validated JSON
- [ ] Create new `GOOGLE_CLOUD_CREDENTIALS` secret in Supabase
- [ ] Paste raw JSON (no quotes, no encoding)
- [ ] Redeploy the server function
- [ ] Run System Tests to verify

---

**Last Updated:** November 17, 2025

**Need Help?** Check the backend logs for detailed error messages.
