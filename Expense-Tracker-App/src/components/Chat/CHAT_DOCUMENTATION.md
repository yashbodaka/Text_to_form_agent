# AI Expense Chatbot Documentation

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [API Keys Setup Guide](#api-keys-setup-guide)
3. [Supported Commands & Queries](#supported-commands--queries)
4. [Limitations & Assumptions](#limitations--assumptions)

---

## Architecture Overview

### Component Structure

The AI Expense Chatbot consists of two main files:

#### **Chat.jsx** - Main Logic Component
```
Chat Component
├── State Management
│   ├── messages: Array<Message>        // Conversation history
│   ├── inputValue: string              // Current user input
│   ├── isLoading: boolean              // API call status
│   ├── pendingData: Object | null      // Transaction preview data
│   └── isListening: boolean            // Voice input status
│
├── Core Functions
│   ├── processChatMessage()            // Main AI interaction handler
│   ├── callAIWithFallback()            // Rate limit resilient API caller
│   ├── startListening()                // Web Speech API handler
│   ├── handleConfirm/Cancel()          // Transaction confirmation
│   └── renderMessage()                 // Conditional UI renderer
│
└── Data Flow
    1. User Input → processChatMessage()
    2. Build Context (history + system prompt)
    3. Call AI Model (with fallback)
    4. Parse JSON Response
    5. Validate & Display Preview/Insight
    6. User Confirms → Add to Expense List
```

#### **Chat.css** - Styling & Animations
- **Widget Layout**: Floating chat button and expandable window
- **Message Bubbles**: Distinct styling for user/bot messages
- **Special Cards**: Insight dashboard and editable preview forms
- **Animations**: Loading dots, pulse effects for voice input
- **Responsive Design**: Mobile-friendly viewport adjustments

---

## API Keys Setup Guide

### 1. Obtain Google Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Get API Key"** or **"Create API Key"**
4. Copy the generated key (format: `AIzaSy...`)

### 2. Environment Variable Configuration

#### Step 1: Create `.env` File
In the root directory of `Expense-Tracker-App`, create a file named `.env`:

```bash
# File: Expense-Tracker-App/.env
REACT_APP_GEMINI_API_KEY=AIzaSyYourActualKeyHere123456789
```

⚠️ **Important Notes:**
- React requires the prefix `REACT_APP_` for environment variables
- Never commit `.env` to version control
- Restart the development server after adding the key

#### Step 2: Verify `.gitignore`
Ensure `.env` is listed in your `.gitignore`:

```
# .gitignore
.env
.env.local
```

#### Step 3: Restart Development Server
```bash
# Stop the server (Ctrl+C)
npm start  # Restart to load new environment variables
```

### 3. Verify Setup

Open the browser console after sending a message. You should see:
```
🤖 LLM Response Log
Raw Response: { "type": "extraction", ... }
```

If you see **"⚠️ Configuration Error: No Gemini API Key found"**, the `.env` file was not loaded correctly.

### 4. Rate Limits

**Free Tier Limits (as of 2026):**
- `gemini-2.5-flash`: 15 requests per minute
- `gemini-2.5-flash-lite`: 30 requests per minute

The chatbot automatically falls back to the lite model when rate limits are hit.

---

## Supported Commands & Queries

### 1. Data Extraction (Add Expenses/Income)

#### Single Expense
```
Examples:
"I spent 250 on groceries today"
"Add 50 rupees for lunch"
"Movie ticket 300"
"Bus fare 80 yesterday"
```

**What It Understands:**
- **Amount**: Numbers in any position (50, 250, etc.)
- **Title**: Key phrases (groceries, lunch, movie ticket)
- **Category**: Auto-inferred (groceries→Food, movie→Entertainment, bus→Travel)
- **Date**: Natural language (today, yesterday, last Monday, 21st Jan)

#### Bulk Expenses
```
Examples:
"I spent 50 on coffee, 200 on dinner, and 100 on uber"
"Add 300 lunch, 150 snacks, 80 bus"
```

#### Income
```
Examples:
"Add 5000 income"
"I received 2000 today"
"Salary 50000"
```

---

### 2. Financial Insights (AI Analysis)

#### Overall Summary
```
"Give me an overall spending summary"
"How much did I spend this month?"
"Show me my expenses"
```

**Response Format:**
```
📊 Financial Insights
─────────────────────
Summary: "You spent ₹930 total."

Spending Breakdown:
• Food: ₹350
• Travel: ₹330
• Entertainment: ₹250

💡 Recommendations:
• Food is your highest expense - consider cooking more
• Set monthly budgets per category
```

#### Category-Specific Analysis
```
"How much did I spend on food?"
"Show me my entertainment expenses"
"Breakdown my travel spending"
```

**Response:**
- Only shows data for the requested category
- Provides targeted recommendations

#### Savings Advice
```
"How can I save on food?"
"Give me tips to reduce entertainment spending"
```

---

### 3. Multi-Turn Conversations

The chatbot remembers the **last 6 messages** for context:

```
You: "I took a bus today"
Bot: "How much did you spend on the bus?"
You: "80"
Bot: [Creates Travel expense for "bus fare" - ₹80]
```

**Supported Follow-Ups:**
- Answering clarification questions
- Providing missing details (amount, date, title)
- Confirming or canceling previews

---

### 4. Voice Input

**How to Use:**
1. Click the 🎤 microphone button
2. Speak your expense (e.g., "I spent fifty rupees on tea")
3. The text will appear in the input field
4. Press Enter or click Send

**Supported Languages:** English (en-US)

**Browser Compatibility:**
- ✅ Chrome/Edge (Desktop & Android)
- ✅ Safari (iOS 14.3+)
- ❌ Firefox (requires flag enable)

---

## Limitations & Assumptions

### 1. LLM Behavior

| Limitation | Impact | Mitigation |
|------------|--------|------------|
| **JSON Inconsistency** | Lite models may return plain text instead of JSON | Auto-recovery wraps text in clarification schema |
| **Category Ambiguity** | Items like "book" could be Food or Entertainment | AI guesses closest match; user can edit in preview |
| **Complex Queries** | Multi-step reasoning may fail | Break into smaller queries |
| **Hallucinations** | AI may invent transaction details | Preview UI allows editing before confirmation |

### 2. Context Memory

- **Window Size**: Only last 6 messages are remembered
- **Session Persistence**: Conversation resets on page refresh
- **No Cross-Session Memory**: Each browser session is isolated

### 3. Date Parsing

**Supported Formats:**
- ✅ Relative: "today", "yesterday", "last Monday"
- ✅ Explicit: "21st Jan 2026", "January 21"
- ✅ ISO: "2026-01-21"

**Rejected Dates:**
- ❌ More than 1 year in the past
- ❌ More than 1 month in the future
- ❌ Invalid dates (e.g., "50th January")

**Fallback:** All invalid dates default to today's date with a console warning.

### 4. Categories

**Fixed List:**
- Food
- Entertainment
- Travel

**Assumption:** All expenses must fit into one of these three categories. If the AI cannot determine a category, it defaults to "Food".

### 5. Browser Requirements

**Minimum Requirements:**
- Modern browser (Chrome 90+, Safari 14+, Edge 90+)
- JavaScript enabled
- LocalStorage enabled (for balance persistence)
- Microphone permission (for voice input)

**Not Supported:**
- IE 11 or older browsers
- JavaScript disabled environments
- Very old mobile browsers

### 6. Performance

**Optimal Conditions:**
- Less than 50 transactions in `expenseList`
- Less than 100 messages in conversation
- Stable internet connection (for API calls)

**Degradation:**
- Large transaction lists may slow insight generation
- Long conversations may exceed token limits (rate limit fallback helps)

### 7. Security

**Protected:**
- ✅ API key stored in `.env` (not in code)
- ✅ No sensitive data logged to console (except debugging)

**Vulnerabilities:**
- ⚠️ Client-side API key exposure (visible in browser network tab)
- ⚠️ No backend validation (relies on React state)

**Recommendation:** For production, move API calls to a backend server.

### 8. Assumptions

1. **Single Currency**: All amounts are in ₹ (Indian Rupees)
2. **Positive Amounts**: Negative numbers are treated as positive
3. **Single User**: No multi-user support or authentication
4. **No Transaction Editing**: Once confirmed, expenses cannot be edited via chat (must use UI)
5. **English Only**: NLP works best with English inputs
6. **Valid API Key**: Assumes user has configured a working Google Gemini API key

---

## Code Architecture Highlights

### State Flow Diagram

```
User Action
    ↓
handleSend() / startListening()
    ↓
processChatMessage(userMessage)
    ↓
Build historyMessages (last 6)
    ↓
callAIWithFallback()
    ├─ Try: gemini-2.5-flash (maxRetries: 0)
    └─ Catch 429: gemini-2.5-flash-lite (maxRetries: 1)
    ↓
Parse JSON Response
    ↓
    ├─ type: "clarification" → Display question
    ├─ type: "insight" → Render insight card
    └─ type: "extraction" → Validate → Show preview
        ↓
    User clicks "Confirm"
        ↓
    handleConfirm() → Add to expenseList
```

### Key Design Patterns

1. **Retry with Fallback**: Primary model fails fast (0 retries), fallback model allows 1 retry
2. **Auto-Recovery**: Non-JSON responses are gracefully converted to clarifications
3. **Optimistic Validation**: Client validates titles/dates before sending to parent component
4. **Structured History**: LangChain message format for proper context management
5. **Conditional Rendering**: Single `renderMessage()` function handles all message types

---

## Troubleshooting

### Issue: "Configuration Error: No Gemini API Key found"
**Solution:**
1. Verify `.env` file exists in project root
2. Check key is prefixed with `REACT_APP_`
3. Restart development server (`npm start`)

### Issue: "429 Too Many Requests" even with fallback
**Solution:**
1. Wait 60 seconds before retrying
2. Check quota at [Google AI Studio](https://makersuite.google.com/)
3. Consider upgrading to paid tier

### Issue: Voice input not working
**Solution:**
1. Grant microphone permission in browser
2. Check browser compatibility (use Chrome/Edge)
3. Ensure HTTPS or localhost (required for WebRTC)

### Issue: AI returns wrong category
**Solution:**
1. Use the editable preview to correct category
2. Be more specific in input (e.g., "bus fare" instead of "bus")

### Issue: Dates are incorrect
**Solution:**
1. Use explicit dates (e.g., "21st Jan" instead of vague references)
2. Check console for date parsing warnings
3. Edit date in preview before confirming

---

## Version Information

- **React**: 18.x
- **LangChain**: @langchain/google-genai
- **Date Parser**: chrono-node
- **Speech API**: Web Speech API (native browser)
- **Gemini Models**: 2.5-flash (primary), 2.5-flash-lite (fallback)

---

## File Locations

```
src/components/Chat/
├── Chat.jsx              # Main component logic (569 lines)
├── Chat.css              # Styling and animations
└── CHAT_DOCUMENTATION.md # This file
```

---

**Last Updated**: January 26, 2026  
**Maintainer**: Syncnox Assignment Project
