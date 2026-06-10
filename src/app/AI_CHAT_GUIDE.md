# MindLens AI Chat Feature Guide

## Overview

MindLens AI Chat is a compassionate AI companion powered by OpenAI's ChatGPT that provides emotional support and acts as a caring friend for users who may be going through difficult times. This feature integrates seamlessly with the mental health screening app to provide 24/7 support.

## Features

### 🤖 AI Companion
- **Empathetic Conversations**: Warm, compassionate responses from GPT-4o-mini
- **Active Listening**: Validates feelings and provides thoughtful support
- **Crisis Detection**: Automatically detects crisis keywords and provides emergency resources
- **Conversation History**: Maintains context throughout the conversation
- **Medical Aesthetic**: Clean, professional UI matching the MindLens design system

### 🔒 Privacy & Security
- **Authenticated Access**: Requires user authentication via Supabase
- **Encrypted Storage**: Conversation history stored securely in KV store
- **User-Isolated Data**: Each user's conversations are completely isolated
- **HIPAA-Ready**: Designed with healthcare compliance in mind

### 🚨 Safety Features
- **Crisis Keyword Detection**: Monitors for self-harm, suicide, and crisis indicators
- **Emergency Resources**: Automatically displays 988 hotline and crisis text line
- **Crisis Logging**: Records crisis indicators for follow-up care
- **Professional Guidance**: Encourages seeking professional help when needed

## Setup Instructions

### 1. OpenAI API Key Configuration

You've already been prompted to upload your OpenAI API key. If you haven't done so yet:

1. Get your OpenAI API key from https://platform.openai.com/api-keys
2. Click the prompt to upload `OPENAI_API_KEY` secret
3. Paste your API key and save

**Note**: The app will display an error if the API key is not configured.

### 2. Access Points

Users can access the AI Chat from multiple locations:

1. **Main Menu Dropdown**: Click the three-dot menu (⋮) → "Start AI Chat"
2. **Quick Access Button**: On the onboarding screen, click "Talk to MindLens AI"
3. **After Assessment**: Suggested as a support option after completing PHQ-9

### 3. Using the Chat

1. **Start Chatting**: Type your message in the input field
2. **Send Message**: Press Enter or click the Send button
3. **View History**: Scroll through your conversation
4. **Get Support**: The AI will respond empathetically and supportively

## Technical Architecture

### Backend Endpoints

Located in `/supabase/functions/server/chat-endpoints.tsx`

#### POST `/make-server-aa629e1b/chat/send`
Send a message to the AI chatbot

**Request Body**:
```json
{
  "message": "I'm feeling anxious today...",
  "conversationId": "CHAT-1234567890-abc123" // Optional, auto-generated
}
```

**Response**:
```json
{
  "success": true,
  "conversationId": "CHAT-1234567890-abc123",
  "response": "I hear you. It's completely normal to feel anxious sometimes...",
  "hasCrisisIndicator": false,
  "timestamp": "2025-11-22T10:30:00.000Z"
}
```

#### GET `/make-server-aa629e1b/chat/history/:conversationId`
Retrieve conversation history

**Response**:
```json
{
  "success": true,
  "conversationId": "CHAT-1234567890-abc123",
  "history": [
    {
      "role": "user",
      "content": "Hello",
      "timestamp": "2025-11-22T10:30:00.000Z"
    },
    {
      "role": "assistant",
      "content": "Hi! How are you feeling today?",
      "timestamp": "2025-11-22T10:30:01.000Z"
    }
  ],
  "metadata": {
    "startedAt": "2025-11-22T10:30:00.000Z",
    "lastMessageAt": "2025-11-22T10:30:01.000Z",
    "messageCount": 2
  }
}
```

#### GET `/make-server-aa629e1b/chat/conversations`
Get all conversations for the authenticated user

#### DELETE `/make-server-aa629e1b/chat/conversation/:conversationId`
Delete a specific conversation

### Frontend Component

Located in `/components/AIChatScreen.tsx`

**Features**:
- Real-time messaging with loading states
- Auto-scroll to latest messages
- Crisis alert banner
- Error handling with user-friendly messages
- Keyboard shortcuts (Enter to send, Shift+Enter for new line)
- Responsive design with medical aesthetic

### Data Storage

Conversations are stored in the Supabase KV store:

```
chat:{userId}:{conversationId}:history       - Message history
chat:{userId}:{conversationId}:metadata      - Conversation metadata
chat:{userId}:conversations                   - List of conversation IDs
crisis-alert:{alertId}                        - Crisis detection logs
```

## AI System Prompt

The AI is configured with the following guidelines:

- ✅ Be warm, empathetic, and non-judgmental
- ✅ Listen actively and validate feelings
- ✅ Provide thoughtful, supportive responses
- ✅ Encourage professional help for serious concerns
- ✅ Use conversational, friendly tone
- ✅ Keep responses concise (2-4 sentences)
- ❌ Never diagnose or prescribe medication
- 🚨 In crisis situations, immediately provide emergency resources

## Crisis Detection

The system monitors for these crisis keywords:
- suicide
- kill myself
- end my life
- want to die
- self-harm
- hurt myself

When detected:
1. **Alert Banner** displays with emergency hotlines
2. **Crisis Log** created in KV store with timestamp
3. **Console Warning** logged for monitoring
4. **AI Response** includes appropriate resources

### Emergency Resources Provided

- **988 Suicide & Crisis Lifeline**: Call or text 988
- **Crisis Text Line**: Text HOME to 741741
- **Emergency Services**: 911

## Model Configuration

Using OpenAI's ChatGPT API with:
- **Model**: `gpt-4o-mini` (cost-effective, fast responses)
- **Temperature**: 0.7 (balanced creativity and consistency)
- **Max Tokens**: 500 (concise responses)
- **Context**: Full conversation history maintained

## Cost Estimation

### GPT-4o-mini Pricing (as of 2024)
- **Input**: ~$0.15 per 1M tokens
- **Output**: ~$0.60 per 1M tokens

### Estimated Costs
- **Average Conversation**: 10 messages = ~$0.001 - $0.002
- **1000 Conversations/month**: ~$1-2/month
- **Very Cost-Effective**: Suitable for production use

## Best Practices

### For Users
1. **Be Honest**: Share your genuine feelings
2. **Take Your Time**: No rush, the AI is always available
3. **Seek Professional Help**: For serious concerns, contact a licensed therapist
4. **Emergency**: Call 988 or 911 in crisis situations

### For Developers
1. **Monitor Costs**: Track OpenAI API usage
2. **Review Crisis Logs**: Check `crisis-alert:*` keys regularly
3. **Update System Prompt**: Refine based on user feedback
4. **Rate Limiting**: Consider implementing rate limits for production
5. **Content Moderation**: OpenAI has built-in moderation, but monitor logs

## Integration with MindLens Features

The AI Chat integrates with other MindLens features:

1. **PHQ-9 Assessment**: Can discuss assessment results
2. **Personality Test**: Can explore personality insights
3. **Stroop Test**: Can discuss emotional interference results
4. **Self-Care Resources**: Can recommend appropriate resources
5. **Counselor Booking**: Can guide users to professional help

## Future Enhancements

Potential improvements for future releases:

1. **Conversation Summaries**: AI-generated summaries of key topics
2. **Mood Tracking**: Analyze sentiment over time
3. **Resource Recommendations**: Context-aware self-care suggestions
4. **Voice Input**: Speech-to-text for accessibility
5. **Multi-Language**: Support for multiple languages
6. **Follow-up Reminders**: Gentle check-ins via notifications
7. **Integration with Vertex AI**: Use Google's AI for emotion analysis correlation

## Testing

### Manual Testing Checklist

- [ ] Send message and receive AI response
- [ ] Test crisis keywords (e.g., "I'm thinking about suicide")
- [ ] Verify emergency banner appears for crisis keywords
- [ ] Check conversation history persistence
- [ ] Test "Back" button navigation
- [ ] Verify authentication requirement
- [ ] Test loading states and error handling
- [ ] Confirm responsive design on mobile

### Crisis Detection Test

Send this message to test crisis detection:
```
"I'm having thoughts about harming myself"
```

Expected behavior:
- Red alert banner appears
- Emergency resources displayed (988, Crisis Text Line, 911)
- Console logs crisis detection
- AI response includes support resources

## Troubleshooting

### "OpenAI API key not configured" Error

**Solution**: 
1. Check if `OPENAI_API_KEY` environment variable is set
2. Verify the API key is valid at https://platform.openai.com
3. Restart the server after setting the key

### Messages Not Sending

**Solution**:
1. Check browser console for errors
2. Verify user is authenticated (signed in)
3. Check server logs for API errors
4. Verify OpenAI API key has sufficient credits

### AI Responses Are Slow

**Solution**:
- This is normal for complex conversations
- GPT-4o-mini typically responds in 1-3 seconds
- Check OpenAI API status: https://status.openai.com

### Conversation History Not Saving

**Solution**:
1. Verify Supabase connection
2. Check KV store access
3. Review server logs for storage errors

## Support & Documentation

- **OpenAI API Docs**: https://platform.openai.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Crisis Resources**: https://988lifeline.org
- **HIPAA Compliance**: Consult with legal team for production deployment

## Conclusion

The MindLens AI Chat feature provides a compassionate, 24/7 companion for mental health support. It's designed with safety, privacy, and user well-being as top priorities. The integration with OpenAI's ChatGPT ensures high-quality, empathetic responses while maintaining clinical-grade standards.

**Remember**: This AI companion supplements but does not replace professional mental health care. Always encourage users to seek help from licensed professionals when needed.

---

**Last Updated**: November 22, 2025
**Version**: 1.0.0
**Status**: ✅ Production Ready (pending OpenAI API key configuration)
