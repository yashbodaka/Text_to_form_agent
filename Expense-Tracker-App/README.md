# 🤖 AI-Powered Expense Tracker

An intelligent expense tracking application featuring an **AI Chatbot** powered by **Google Gemini** and **LangChain** that lets you manage your finances using natural language conversations.

![React](https://img.shields.io/badge/React-18.0-blue)
![Google Gemini](https://img.shields.io/badge/Gemini-2.5%20Flash-purple)
![LangChain](https://img.shields.io/badge/LangChain-Integrated-green)

---

## 🌟 Key Highlight: AI Chatbot

The standout feature of this application is the **conversational AI chatbot** that understands natural language and automates expense tracking. No more manual form filling—just chat naturally!

### 🎯 What Makes the Chatbot Special?

#### **1. Natural Language Understanding**
Simply talk to the chatbot like you would to a friend:
- 💬 *"I spent 50 on groceries yesterday"*
- 💬 *"Add 20 rupees for coffee today"*
- 💬 *"Paid 1500 for flight booking on 21st Jan"*
- 💬 *"Add income of 5000"*

The AI extracts:
- ✅ **Amount**: Monetary values (50, 1500, etc.)
- ✅ **Title/Description**: What you spent on (groceries, coffee, flight)
- ✅ **Category**: Automatically categorizes as Food, Entertainment, or Travel
- ✅ **Date**: Understands natural dates (today, yesterday, 21st Jan, last Monday)

#### **2. Intelligent Bulk Processing**
Add multiple transactions in one message:
- 💬 *"I spent 50 on coffee, 200 on dinner, and 100 on uber"*
- The chatbot extracts all three expenses and lets you confirm them at once

#### **3. Smart Category Mapping**
The AI automatically maps keywords to categories:
- **Food**: lunch, dinner, breakfast, groceries, restaurant, snacks
- **Entertainment**: movie, concert, game, fun, video game
- **Travel**: flight, hotel, taxi, uber, bus, trip

No need to manually select categories!

#### **4. Financial Insights & Analytics**
Ask the chatbot for spending analysis:
- 💬 *"How much did I spend on food this month?"*
- 💬 *"Give me an overall spending summary"*
- 💬 *"Show me my entertainment expenses"*
- 💬 *"How can I save on travel?"*

Get instant reports with:
- 📊 **Spending breakdown** by category
- 💡 **Personalized recommendations** for saving money
- 📈 **Percentage analysis** of your expenses

#### **5. Multi-Turn Conversations**
The chatbot remembers context:
```
You: "I took a bus today"
Bot: "How much did you spend on the bus?"
You: "80"
Bot: ✅ [Creates Travel expense for "bus fare" - ₹80]
```

#### **6. Voice Input Support**
- 🎤 Use the microphone button to speak your expenses
- Powered by Web Speech API
- Perfect for hands-free expense logging

#### **7. Preview & Confirmation System**
- Before adding any transaction, the chatbot shows a preview card
- Review extracted data (title, amount, category, date)
- ✓ **Confirm** to add the transaction
- ✗ **Cancel** to discard and try again

#### **8. Smart Validation**
- **Balance checks**: Warns if expense exceeds current balance
- **Title validation**: Asks for clarification if title is vague
- **Date parsing**: Handles multiple date formats gracefully
- **Category inference**: Always assigns the closest matching category

#### **9. Rate Limit Resilience**
- Automatically falls back to `gemini-2.5-flash-lite` if rate limits are hit
- Ensures uninterrupted service even during high usage
- Graceful error handling with user-friendly messages

---

## 🚀 Quick Start

### Prerequisites
- Node.js 14+ installed
- Google Gemini API key

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/yashbodaka/syncnox_assignment.git
cd Expense-Tracker-App

# Install dependencies
npm install
```

### 2. Get Your Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the generated key (format: `AIzaSy...`)

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
# .env file
REACT_APP_GEMINI_API_KEY=your_actual_api_key_here
```

⚠️ **Important**: 
- The `.env` file is already in `.gitignore` to protect your API key
- Never commit your API key to version control
- Restart the development server after creating the `.env` file

### 4. Run the Application

```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

---

## 🎮 How to Use the AI Chatbot

### Opening the Chat
Click the purple **💬 chat button** in the bottom-right corner of the screen.

### Example Commands

#### Adding Single Expenses
```
"I spent 250 on groceries today"
"Add 50 rupees for lunch"
"Movie ticket 300 yesterday"
"Paid 80 for bus fare on 21st Jan"
```

#### Adding Multiple Expenses at Once
```
"I spent 50 on coffee, 200 on dinner, and 100 on uber"
"Add 300 lunch, 150 snacks, 80 bus today"
```

#### Adding Income
```
"Add income of 5000"
"I received 10000 rupees today"
"Salary 50000"
```

#### Getting Financial Insights
```
"How much did I spend on food?"
"Give me an overall spending summary"
"Show me my entertainment expenses"
"Breakdown my travel spending"
"How can I save on food?"
```

### Confirmation Flow
1. Type your expense or question
2. The AI extracts structured data
3. A **preview card** appears showing:
   - Title
   - Amount (₹)
   - Category
   - Date
4. Click **✓ Confirm** to add the transaction
5. Or click **✗ Cancel** to discard

---

## 🛠️ Technology Stack

### AI & NLP
- **Google Gemini API** (`gemini-2.5-flash` & `gemini-2.5-flash-lite`)
- **LangChain** - For conversational AI with context memory
- **Zod** - Schema validation for structured data extraction
- **chrono-node** - Natural language date parsing

### Frontend
- **React 18** - Modern UI library
- **React Hooks** - State management (useState, useEffect, useRef)
- **Web Speech API** - Voice input
- **Notistack** - User notifications
- **React Icons** - Icon library

### Styling
- **Custom CSS** - Gradient designs and animations
- **Responsive Design** - Mobile-friendly interface

---

## 📂 Project Structure

```
Expense-Tracker-App/
├── src/
│   ├── components/
│   │   ├── Chat/
│   │   │   ├── Chat.jsx              # 🤖 Main chatbot component (569 lines)
│   │   │   ├── Chat.css              # Chatbot styling & animations
│   │   │   └── CHAT_DOCUMENTATION.md # Detailed chatbot docs
│   │   ├── Hero/                     # Dashboard UI
│   │   ├── Modal/                    # Modal dialogs
│   │   └── Summarry/                 # Transaction summaries
│   ├── utils/
│   │   └── dateParser.js             # Natural language date parser
│   ├── constants.js                  # Category constants
│   └── App.js                        # Main app with chatbot integration
├── .env                              # API keys (create this!)
├── .gitignore
├── package.json
└── README.md
```

---

## 🧠 Chatbot Architecture

### Data Flow
```
User Input (Text/Voice)
    ↓
Chat.jsx - processChatMessage()
    ↓
Build Context (Last 6 messages + system prompt)
    ↓
LangChain + Gemini API Call
    ↓
JSON Response Parsing (with fallback)
    ↓
Date Parser (Natural → YYYY-MM-DD)
    ↓
Preview Card Display
    ↓
User Confirms
    ↓
handleAddExpense() → State Update → LocalStorage
```

### AI Response Types

#### 1. Extraction Mode
```json
{
  "type": "extraction",
  "items": [
    {
      "actionType": "expense",
      "amount": 250,
      "title": "Groceries",
      "category": "Food",
      "date": "today"
    }
  ]
}
```

#### 2. Insight Mode
```json
{
  "type": "insight",
  "summary": "You spent ₹930 total this month.",
  "breakdown": [
    {"category": "Food", "amount": 350, "percentage": "38%"},
    {"category": "Travel", "amount": 330, "percentage": "35%"},
    {"category": "Entertainment", "amount": 250, "percentage": "27%"}
  ],
  "recommendations": [
    "Food is your highest expense - consider meal prepping",
    "Set monthly budgets per category"
  ]
}
```

#### 3. Clarification Mode
```json
{
  "type": "clarification",
  "question": "How much did you spend on the bus?"
}
```

### Key Features in Code

- **Context Memory**: Remembers last 6 messages for multi-turn conversations
- **Rate Limit Fallback**: Auto-switches to lite model on 429 errors
- **Auto-Recovery**: Handles non-JSON responses gracefully
- **Validation**: Checks for vague titles, missing amounts, and invalid dates
- **Category Intelligence**: ALWAYS guesses closest category instead of asking

---

## 🎨 Chatbot UI Features

### Visual Elements
- **Floating Chat Button**: Purple gradient button with pulse animation
- **Expandable Window**: Smooth slide-in animation
- **Message Bubbles**: Distinct user (blue) and bot (purple gradient) styling
- **Loading Animation**: Three-dot pulse indicator
- **Voice Input**: Pulsing microphone button when listening
- **Preview Cards**: Editable forms with confirm/cancel buttons
- **Insight Dashboard**: Formatted financial reports with emojis

### Responsive Design
- Mobile-optimized viewport
- Touch-friendly buttons
- Scrollable message history
- Auto-scroll to latest message

---

## 📊 Supported Natural Language Patterns

### Date Formats
- ✅ "today" / "yesterday"
- ✅ "21st Jan" / "Jan 21"
- ✅ "last Monday" / "this Friday"
- ✅ "2026-01-24"

### Category Keywords

#### Food
`lunch`, `dinner`, `breakfast`, `snacks`, `groceries`, `restaurant`, `food`, `meal`, `coffee`, `burger`

#### Entertainment
`movie`, `movies`, `concert`, `game`, `entertainment`, `fun`, `video game`, `show`

#### Travel
`flight`, `hotel`, `taxi`, `uber`, `bus`, `travel`, `trip`, `vacation`, `fare`

---

## ⚠️ Troubleshooting

### "Gemini API key not found"
**Solution**: Ensure you've created a `.env` file with `REACT_APP_GEMINI_API_KEY=your_key_here` and restarted the server.

### "Couldn't extract the amount"
**Solution**: Include a numeric value in your message (e.g., "50", "1500").

### "Please specify what the expense was for"
**Solution**: Be more specific with the title (e.g., "lunch at McDonald's" instead of just "spent 50").

### Rate Limit Errors (429)
**Solution**: The app automatically falls back to the lite model. If issues persist, wait a minute before trying again.

### Voice Input Not Working
**Solution**: Voice recognition is only supported in Chrome, Edge, and Safari. Ensure microphone permissions are granted.

---

## 🎯 Key Advantages of the AI Chatbot

| Feature | Traditional Form | AI Chatbot |
|---------|-----------------|------------|
| **Speed** | 5+ clicks | One message |
| **Date Entry** | Manual calendar selection | Natural language ("yesterday") |
| **Category** | Dropdown selection | Auto-detected |
| **Bulk Entry** | Multiple form submissions | Single message |
| **Insights** | Manual calculation | Instant AI analysis |
| **Accessibility** | Mouse/keyboard only | Voice input supported |

---

## 📝 Additional Scripts

### Development
```bash
npm start       # Start development server
npm test        # Run tests
npm run build   # Build for production
```

### Testing the Chatbot

Try these test cases:

**Test Case 1: Simple Expense**
```
User: "I spent 50 on lunch today"
Expected: Preview card with Food category, ₹50, today's date
```

**Test Case 2: Bulk Expenses**
```
User: "Add 200 dinner, 80 bus, 300 movie yesterday"
Expected: Three preview cards (Food, Travel, Entertainment)
```

**Test Case 3: Insights**
```
User: "How much did I spend on food?"
Expected: Summary with Food breakdown and recommendations
```

**Test Case 4: Voice Input**
```
Action: Click mic button, say "Add 100 coffee"
Expected: Text appears in input, can send normally
```

---

## 🔒 Security & Privacy

- API keys stored in `.env` (never committed to git)
- All data stored locally in browser (localStorage)
- No backend server required
- No data sent to external services except Gemini API

---

## 🚧 Limitations

- **Free Tier Rate Limits**: 
  - `gemini-2.5-flash`: 15 requests/minute
  - `gemini-2.5-flash-lite`: 30 requests/minute
- **Categories**: Only supports Food, Entertainment, Travel (by design)
- **Voice Input**: Only works in Chromium-based browsers and Safari
- **Context Memory**: Limited to last 6 messages
- **Date Parsing**: May struggle with complex relative dates

---

## 🤝 Contributing

This project was created as part of an assignment. Feel free to fork and enhance!

---

## 📄 License

This project is open source and available under the MIT License.

---

## 👨‍💻 Author

**Yash Bodaka**  
GitHub: [@yashbodaka](https://github.com/yashbodaka)

---

## 🙏 Acknowledgments

- **Google Gemini** - For the powerful LLM API
- **LangChain** - For conversation orchestration
- **Create React App** - For the React boilerplate

---

**Built with ❤️ using React, Gemini AI, and LangChain**
