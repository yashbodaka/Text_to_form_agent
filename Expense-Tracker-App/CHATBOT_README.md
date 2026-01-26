# AI Chatbot Integration for Expense Tracker

## Overview
This project integrates an AI-powered chatbot using **Google Gemini** and **LangChain** to automatically fill expense and income forms through natural language conversations.

## Features

### 🤖 Natural Language Understanding
- Parse user requests like:
  - "I spent 50 on groceries yesterday"
  - "Add 20 rupees for coffee today"
  - "Add income of 5000"

### 📋 Automatic Form Auto-Fill
- Extracts structured data:
  - **Amount**: Monetary value
  - **Title/Description**: What the expense was for
  - **Category**: Food, Entertainment, or Travel
  - **Date**: Natural language dates (today, yesterday, 21st jan, etc.)

### ✅ Confirmation Preview
- Shows extracted data in a preview card before submission
- User can confirm or cancel before adding to expense list

### 🎯 Smart Category Mapping
- Maps synonyms automatically:
  - "lunch", "dinner", "groceries" → Food
  - "movies", "concert", "game" → Entertainment
  - "flight", "hotel", "uber" → Travel

### 💡 Multi-turn Conversations
- Asks for missing information if prompt is incomplete
- Handles edge cases gracefully

## Tech Stack

- **Frontend**: React 18
- **AI/LLM**: Google Gemini (via LangChain)
- **Schema Validation**: Zod
- **Date Parsing**: chrono-node
- **UI**: Custom CSS with gradient design

## Setup Instructions

### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/yashbodaka/syncnox_assignment.git
cd Expense-Tracker-App
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
\`\`\`

This will install all required packages including:
- langchain
- @langchain/google-genai
- zod
- chrono-node
- react-icons
- notistack

### 3. Setup API Key

#### Get Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the API key

#### Configure Environment Variables
1. Copy the example environment file:
   \`\`\`bash
   cp .env.example .env
   \`\`\`

2. Open `.env` and add your Gemini API key:
   \`\`\`
   REACT_APP_GEMINI_API_KEY=your_actual_api_key_here
   \`\`\`

⚠️ **Important**: Never commit the `.env` file to git. It's already in `.gitignore`.

### 4. Start the Application
\`\`\`bash
npm start
\`\`\`

The app will open at [http://localhost:3000](http://localhost:3000)

## Usage

### Opening the Chat
- Click the purple chat button (💬) in the bottom-right corner

### Example Commands

#### Adding Expenses
\`\`\`
"I spent 50 on groceries yesterday"
"Add an expense of 200 for movie tickets on 21st jan 2026"
"20 rupees for coffee today"
"Paid 1500 for flight booking"
\`\`\`

#### Adding Income
\`\`\`
"Add income of 5000"
"I received 10000 rupees"
\`\`\`

### Confirming Transactions
1. After typing your request, the chatbot will extract the data
2. A preview card will appear showing:
   - Title
   - Amount
   - Category
   - Date
3. Click **✓ Confirm** to add the transaction
4. Or click **✗ Cancel** to discard

## Architecture

### Components Structure
\`\`\`
src/
├── components/
│   ├── Chat/
│   │   ├── Chat.jsx          # Main chatbot component
│   │   └── Chat.css          # Chatbot styling
│   ├── Hero/                 # Dashboard hero section
│   └── Summarry/             # Transactions summary
├── utils/
│   └── dateParser.js         # Natural language date parser
├── constants.js              # Category constants
└── App.js                    # Main app with Chat integration
\`\`\`

### Data Flow
1. User types natural language input
2. LangChain + Gemini extracts structured data using Zod schema
3. Date parser converts natural dates to YYYY-MM-DD format
4. Preview card displays extracted data
5. On confirmation, calls `handleAddExpense()` from App.js
6. Updates state and localStorage

### Validation Logic
- **Balance Check**: Prevents expenses exceeding current balance
- **Category Validation**: Ensures category is Food, Entertainment, or Travel
- **Amount Validation**: Requires positive numeric values
- **Date Parsing**: Handles multiple date formats gracefully

## Supported Natural Language Patterns

### Date Formats
- ✅ "today"
- ✅ "yesterday"
- ✅ "21st jan", "jan 21"
- ✅ "2026-01-24"

### Category Keywords
#### Food
- lunch, dinner, breakfast, snacks, groceries, restaurant, food

#### Entertainment
- movie, movies, concert, game, entertainment, fun

#### Travel
- flight, hotel, taxi, uber, travel, trip, vacation

## Error Handling

### Common Issues

#### "Gemini API key not found"
**Solution**: Make sure you've created a `.env` file with `REACT_APP_GEMINI_API_KEY`

#### "Couldn't extract the amount"
**Solution**: Make sure to include a numeric value in your message

#### "Not sure about the category"
**Solution**: Be more specific (e.g., "for lunch" instead of just "spent 50")

#### Insufficient Balance Warning
**Solution**: The app will show a warning if expense exceeds current balance

## Bonus Features Implemented

✅ **Natural Language Understanding**: Full Gemini + LangChain integration  
✅ **Form Preview**: Shows data before submission  
✅ **Multi-turn Conversations**: Asks for missing info  
✅ **Date Parsing**: Handles complex date formats  
✅ **Error Handling**: Clear error messages  
✅ **Validation**: Balance checks and category validation  
✅ **Responsive Design**: Works on mobile and desktop  

## Testing Examples

### Test Case 1: Simple Expense
**Input**: "I spent 50 on lunch today"  
**Expected Output**:
- Title: "lunch"
- Amount: 50
- Category: Food
- Date: 2026-01-24

### Test Case 2: Date Parsing
**Input**: "Add 200 for movie tickets yesterday"  
**Expected Output**:
- Title: "movie tickets"
- Amount: 200
- Category: Entertainment
- Date: 2026-01-23

### Test Case 3: Income
**Input**: "Add income of 5000"  
**Expected Output**:
- Amount: 5000
- Action: Add to balance

### Test Case 4: Complex Date
**Input**: "Paid 1500 for hotel on 21st jan 2026"  
**Expected Output**:
- Title: "hotel"
- Amount: 1500
- Category: Travel
- Date: 2026-01-21

### Test Case 5: Missing Info
**Input**: "I spent 100"  
**Expected Output**: Bot asks for category clarification

## Limitations

- Requires internet connection for Gemini API
- API key needed (free tier available)
- English language only (multi-language could be added)
- Limited to 3 expense categories (as per original app design)

## Future Enhancements

- 🎤 Voice input integration
- 🌍 Multi-language support
- 📊 Expense analytics queries ("How much did I spend on food this month?")
- 💡 Budget recommendations based on spending patterns
- 📥 Bulk entry support (multiple expenses in one message)
- 🔄 Edit existing expenses via chat

## Security Notes

- API keys are stored in `.env` (not committed to git)
- All data stored in browser localStorage (no external database)
- No sensitive data sent to external servers (except Gemini API for NLP)

