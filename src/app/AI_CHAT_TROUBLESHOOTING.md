# AI Chat Troubleshooting Guide

## ✅ AI Chat is Fully Integrated!

The AI chatbot feature is now completely integrated into MindLens. Here's what's been implemented:

### Integration Complete:
- ✅ **Frontend**: AIChatScreen component with ChatGPT API integration
- ✅ **Backend**: Server endpoints at `/make-server-aa629e1b/chat/*`
- ✅ **Navigation**: AI Chat button on the onboarding screen
- ✅ **Authentication**: Fixed to use real JWT tokens (not "auto-signin")
- ✅ **Error Handling**: Comprehensive error messages and auth validation
- ✅ **Crisis Detection**: Automatic detection of crisis keywords with emergency resources

---

## 🚨 If Chat is Not Working

### **The Problem**
Your current session likely has an **old corrupted token** stored as "auto-signin" or "pending" instead of a real JWT token. This was from a previous bug that has now been fixed.

### **The Solution: Clear Your Session**

#### **Option 1: Use the Browser Console (Recommended)**

1. Open your browser's Developer Tools (F12 or Right-Click → Inspect)
2. Go to the **Console** tab
3. Type this command and press Enter:
   ```javascript
   window.clearAuth()
   ```
4. The page will automatically reload in 2 seconds
5. **Sign in again** with your credentials
6. Try the AI chat - it should work now! 🎉

#### **Option 2: Use the Refresh Button**

1. Click on **"Chat with AI Companion"** in the onboarding screen
2. If you see an error about invalid session, click the **refresh icon** (⟳) in the top-right corner of the chat screen
3. This will sign you out
4. **Sign in again** with your credentials
5. Try the AI chat - it should work now! 🎉

#### **Option 3: Manual localStorage Clear**

1. Open Developer Tools (F12)
2. Go to the **Console** tab
3. Run these commands:
   ```javascript
   localStorage.removeItem('mindlens_access_token')
   localStorage.removeItem('mindlens_user_id')
   localStorage.removeItem('mindlens_user_email')
   location.reload()
   ```
4. Sign in again

---

## 🔍 Debug Your Authentication

Want to check if your session is valid? Run this in the console:

```javascript
window.debugAuth()
```

This will show you:
- Your current user ID
- Your email
- Your access token (first 50 characters)
- Token length
- Whether it's valid or corrupted

### What a Valid Token Looks Like:
- ✅ Length: 200+ characters
- ✅ Format: Long alphanumeric string with dots (JWT format)
- ✅ Example start: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### What an Invalid Token Looks Like:
- ❌ "auto-signin" (old bug)
- ❌ "pending" (old bug)
- ❌ Too short (< 100 characters)
- ❌ Missing entirely

---

## 🧪 Test the AI Chat

Once you have a fresh session:

1. Go to the **Onboarding Screen**
2. Click **"Chat with AI Companion"**
3. Type a message like: *"Hi, I'm feeling stressed today"*
4. Press Enter or click Send
5. You should get a supportive response from MindLens AI! 🤖💙

---

## 📋 Technical Details

### Authentication Flow:
1. User signs in → Server returns JWT token
2. Token stored in localStorage as `mindlens_access_token`
3. Chat screen validates token on mount
4. Chat API calls include token in Authorization header
5. Server validates token with Supabase Auth

### Chat Features:
- **OpenAI Integration**: Uses GPT-4o-mini for responses
- **Conversation History**: Stored in key-value store by user + conversation ID
- **Crisis Detection**: Monitors for keywords like "suicide", "self-harm", etc.
- **Emergency Resources**: Automatically shown when crisis indicators detected
- **Session Persistence**: Conversations stored per user

### API Endpoints:
- `POST /chat/send` - Send a message
- `GET /chat/history/:conversationId` - Get conversation history
- `GET /chat/conversations` - List all conversations
- `DELETE /chat/conversation/:conversationId` - Delete a conversation

---

## 🆘 Still Having Issues?

### Check These:

1. **OpenAI API Key**: Make sure OPENAI_API_KEY environment variable is set
   - Check in Supabase Dashboard → Edge Functions → Environment Variables
   
2. **Server Status**: Check if the server is running
   - Open: `https://rskqfnxrnunkajwypeou.supabase.co/functions/v1/health`
   - Should return: `{"status":"healthy"}`

3. **Network Errors**: Check browser console for errors
   - Red errors indicate network or server issues
   - Yellow warnings are usually okay

4. **Token Issues**: Run `window.debugAuth()` to verify your token

### Error Messages and What They Mean:

| Error | Cause | Fix |
|-------|-------|-----|
| "Authentication failed" | Invalid/expired token | Sign out and sign in again |
| "No access token provided" | Not signed in | Sign in first |
| "OpenAI API key not configured" | Missing env variable | Add OPENAI_API_KEY in Supabase |
| "Invalid JWT" | Corrupted token | Run `window.clearAuth()` |

---

## ✨ Success!

Once you clear your session and sign in fresh, the AI chat should work perfectly! The integration is complete and ready to use.

**Features you can try:**
- Send messages about your feelings
- Ask for support or advice
- Share what's on your mind
- The AI will respond compassionately and supportively

**Remember:** MindLens AI is here to listen, but it's not a replacement for professional mental health care. If you're in crisis, please call 988 or 911.

---

## 🎉 Ready to Chat!

1. **Clear your session** (if needed)
2. **Sign in again**
3. **Click "Chat with AI Companion"**
4. **Start talking!**

Happy chatting! 💙🤖
