import { useState, useRef, useEffect } from 'react';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { parseDate, formatDateForDisplay } from '../../utils/dateParser';
import { FOOD, ENTERTAINMENT, TRAVEL } from '../../constants';
import { enqueueSnackbar } from 'notistack';
import './Chat.css';

const Chat = ({ currentBalance, setCurrentBalance, handleAddExpense, expenseList }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: 'Hi! I can add expenses/income or provide insights. Try: "How much did I spend on food this month?"',
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pendingData, setPendingData] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      enqueueSnackbar('Speech recognition is not supported in this browser.', { variant: 'error' });
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      
      setInputValue(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
      enqueueSnackbar('Error listening to audio.', { variant: 'error' });
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (type, content, data = null) => {
    setMessages((prev) => [
      ...prev,
      {
        type,
        content,
        data,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  };

  const processChatMessage = async (userMessage) => {
    setIsLoading(true);
    addMessage('user', userMessage);

    try {
      const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
      
      // EDGE CASE: Graceful handling of missing API key in UI
      if (!apiKey) {
        addMessage('bot', '⚠️ Configuration Error: No Gemini API Key found. Please set REACT_APP_GEMINI_API_KEY in your .env file.');
        setIsLoading(false);
        return;
      }

      // Convert recent messages to LangChain format for proper context memory
      const historyMessages = messages.slice(-6).map(msg => {
        // Handle UI-trigger messages to give AI context about what happened
        if (msg.content === 'preview') return ["ai", "I have generated a transaction preview for you to confirm."];
        if (msg.content === 'insight_preview') return ["ai", "I have generated a financial insight report."];
        
        return [msg.type === 'user' ? "human" : "ai", msg.content];
      });

      const systemPrompt = `You are a financial assistant for an Expense Tracker app. 
Current Balance: ₹${currentBalance}
Transactions: ${JSON.stringify(expenseList)}

You have three modes:
1. DATA EXTRACTION: For messages like "I spent 50 on food and 20 on coffee" or "Add 1000 income".
2. INSIGHTS: For questions about spending, balance, or history.
3. CLARIFICATION: When you need more information from the user.

FOR DATA EXTRACTION:
Extract expense/income details. If title is vague/missing or amount is missing, you MUST ask for clarification.
For categories: ALWAYS guess the closest match from [${FOOD}, ${ENTERTAINMENT}, ${TRAVEL}]. Example: "bus" -> ${TRAVEL}, "burger" -> ${FOOD}, "movie" -> ${ENTERTAINMENT}. NEVER ask for category clarification unless it is completely unrelated to everything.

VALIDATION RULES:
- USE CONVERSATION HISTORY to understand context and fill in missing details if possible
- Title MUST be specific (not "unspecified", "expense", or empty)
- Amount MUST be positive number
- Category MUST be one of: ${FOOD}, ${ENTERTAINMENT}, ${TRAVEL}

If information is INCOMPLETE (missing title/amount), use this schema:
{
  "type": "clarification",
  "question": "What specific information do you need? 
}

If information is COMPLETE, respond with this schema (always return an array of items):
{
  "type": "extraction",
  "items": [
    {
      "actionType": "expense" | "income",
      "amount": number,
      "title": "string",
      "category": "${FOOD}" | "${ENTERTAINMENT}" | "${TRAVEL}",
      "date": "natural language date string"
    }
  ]
}

FOR INSIGHTS:
Carefully analyze the user's SPECIFIC question. If they ask about a particular category (e.g., "entertainment"), time period (e.g., "this week"), or specific metric, respond ONLY with data relevant to that question.

CRITICAL RULES:
- If user asks about ONE category, breakdown should ONLY include that category
- If user asks about a time period, filter transactions by that period
- If user asks "how to save on X", recommendations should focus ONLY on X
- Do NOT provide generic advice about other categories unless specifically asked

Examples:
Q: "How much did I spend on entertainment?"
A: {"type": "insight", "summary": "You spent ₹250 on Entertainment.", "breakdown": [{"category": "Entertainment", "amount": 250}], "recommendations": ["Your entertainment spending included a video game and a movie - consider free alternatives like library books or parks"]}

Q: "Breakdown my food spending and how can I save?"
A: {"type": "insight", "summary": "You spent ₹350 on Food.", "breakdown": [{"category": "Food", "amount": 350}], "recommendations": ["Try meal prepping on Sundays", "Cook at home instead of ordering out"]}

Q: "Give me an overall spending summary"
A: {"type": "insight", "summary": "You spent ₹930 total.", "breakdown": [{"category": "Food", "amount": 350}, {"category": "Travel", "amount": 330}, {"category": "Entertainment", "amount": 250}], "recommendations": ["Food is your highest expense - consider cooking more", "Set monthly budgets per category"]}

Respond ONLY with JSON matching this schema:
{
  "type": "insight",
  "summary": "Brief 1-sentence overview directly answering the question",
  "breakdown": [
    { "category": "Food", "amount": 790, "percentage": "36%" }
  ],
  "recommendations": [
    "Specific actionable tip relevant to the question"
  ]
}

CRITICAL: You are a JSON-only API. Respond ONLY with valid JSON. NO preamble, NO markdown code blocks, NO conversational text outside the JSON structure.`;

      // Helper function to call AI with fallback mechanism for 429 errors
      const callAIWithFallback = async (primaryModel, fallbackModel) => {
        const invokeModel = async (modelName, retries) => {
          const model = new ChatGoogleGenerativeAI({
            model: modelName,
            apiKey: apiKey,
            temperature: 0.1, // Lower temperature for more consistent JSON
            maxRetries: retries,
          });
          
          return await model.invoke([
            ["system", systemPrompt],
            ...historyMessages,
            ["human", userMessage]
          ]);
        };

        try {
          return await invokeModel(primaryModel, 0);
        } catch (err) {
          const isRateLimit = err.status === 429 || 
                             err.message?.includes('429') || 
                             err.message?.toLowerCase().includes('too many requests');
                             
          if (isRateLimit && fallbackModel) {
            console.warn(`Primary model (${primaryModel}) rate limited. Falling back to ${fallbackModel}...`);
            return await invokeModel(fallbackModel, 1);
          }
          throw err;
        }
      };

      const response = await callAIWithFallback('gemini-2.5-flash', 'gemini-2.5-flash-lite');
      const rawContent = response.content;
      
      // CLI Logging Interface
      console.group('%c 🤖 LLM Response Log ', 'background: #667eea; color: white; padding: 2px 5px; border-radius: 3px;');
      console.log('%c Raw Response: ', 'font-weight: bold; color: #764ba2;', rawContent);

      let result;
      try {
        const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? jsonMatch[0] : rawContent;
        result = JSON.parse(jsonStr);
        console.log('%c Parsed JSON: ', 'font-weight: bold; color: #43967b;', result);
      } catch (e) {
        console.error('%c Parsing Error: ', 'font-weight: bold; color: #f44336;', e);
        console.groupEnd();
        
        // AUTO-RECOVERY for non-JSON text responses (especially common in Lite models)
        if (typeof rawContent === 'string' && rawContent.length > 5) {
          result = {
            type: 'clarification',
            question: rawContent.replace(/[{}\[\]"]/g, '').trim() // Clean up any partial brackets
          };
        } else {
          throw new Error("Could not parse AI response. Please try rephrasing.");
        }
      }
      console.groupEnd();

      if (result.type === 'clarification') {
        addMessage('bot', result.question);
        setIsLoading(false);
        return;
      }

      if (result.type === 'insight') {
        const insightData = {
          type: 'insight_report',
          summary: result.summary,
          breakdown: result.breakdown || [],
          recommendations: result.recommendations || []
        };
        addMessage('bot', 'insight_preview', insightData);
        setIsLoading(false);
        return;
      }

      if (result.type === 'extraction') {
        // Validation checks
        const issues = [];
        
        result.items.forEach((item, idx) => {
          // Check for missing or vague titles
          if (!item.title || item.title.toLowerCase().includes('unspecified') || item.title.toLowerCase().includes('expense')) {
            issues.push(`Item ${idx + 1}: Please specify what the expense was for.`);
          }
          
          // Check for missing or vague dates
          if (!item.date || item.date.toLowerCase().includes('unspecified')) {
            issues.push(`Item ${idx + 1}: Please mention when this transaction occurred (e.g., today, yesterday, or a specific date).`);
          }
        });

        if (issues.length > 0) {
          addMessage('bot', `I need some clarification:\n${issues.map(i => `• ${i}`).join('\n')}`);
          setIsLoading(false);
          return;
        }

        const processedItems = result.items.map(item => {
          if (item.actionType === 'expense') {
            return {
              ...item,
              data: {
                name: item.title || 'Expense',
                amount: Number(item.amount),
                category: item.category === 'other' ? FOOD : item.category, // Default to Food or ask? For now default
                date: parseDate(item.date),
              }
            };
          } else {
            return {
              ...item,
              data: {
                amount: Number(item.amount)
              }
            };
          }
        });

        setPendingData({ type: 'bulk', items: processedItems });
        addMessage('bot', 'preview', processedItems);
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error processing message:', error);
      
      const isRateLimit = error.status === 429 || 
                         error.message?.includes('429') || 
                         error.message?.toLowerCase().includes('too many requests') ||
                         error.message?.toLowerCase().includes('rate limit');

      if (isRateLimit) {
        addMessage('bot', "⚠️ You've reached your API rate limit (requests per minute or per day). Please wait a moment before trying again, or check your Google AI Studio quota.");
      } else {
        addMessage('bot', `Error: ${error.message}. Please try again later.`);
      }
      setIsLoading(false);
    }
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    processChatMessage(inputValue);
    setInputValue('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleConfirm = () => {
    if (!pendingData) return;

    if (pendingData.type === 'bulk') {
      pendingData.items.forEach(item => {
        if (item.actionType === 'expense') {
          handleAddExpense(item.data);
        } else if (item.actionType === 'income') {
          setCurrentBalance((prev) => {
            const newBalance = prev + item.data.amount;
            localStorage.setItem('balance', newBalance);
            return newBalance;
          });
        }
      });
      enqueueSnackbar(`Successfully processed ${pendingData.items.length} items!`, { variant: 'success' });
      addMessage('bot', `✅ Processed ${pendingData.items.length} items successfully!`);
    }

    setPendingData(null);
  };

  const handleCancel = () => {
    setPendingData(null);
    addMessage('bot', 'Cancelled. Feel free to try again with a different request!');
  };

  const handleUpdateItem = (idx, field, value) => {
    setPendingData(prev => {
      const newItems = [...prev.items];
      if (field === 'amount') {
        newItems[idx].data.amount = Number(value);
      } else if (field === 'name') {
        newItems[idx].data.name = value;
      } else if (field === 'category') {
        newItems[idx].data.category = value;
      } else if (field === 'date') {
        newItems[idx].data.date = value;
      }
      return { ...prev, items: newItems };
    });
  };

  const renderMessage = (message, index) => {
    // 📊 Insight Report Renderer
    if (message.content === 'insight_preview') {
      const { summary, breakdown, recommendations } = message.data || {};
      return (
        <div key={index} className="message bot">
          <div className="message-content" style={{ width: '100%', maxWidth: '320px', padding: '0' }}>
            <div className="insight-card">
              <div className="insight-header">
                📊 Financial Insights
              </div>
              <div className="insight-body">
                <p className="insight-summary">{summary}</p>
                
                {breakdown && breakdown.length > 0 && (
                  <div className="insight-section">
                    <h5>Spending Breakdown</h5>
                    <div className="breakdown-list">
                      {breakdown.map((item, idx) => (
                        <div key={idx} className="breakdown-item">
                          <span className="breakdown-cat">{item.category}</span>
                          <span className="breakdown-line"></span>
                          <span className="breakdown-amt">₹{item.amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {recommendations && recommendations.length > 0 && (
                  <div className="insight-section">
                    <h5>💡 Recommendations</h5>
                    <ul className="recommendation-list">
                      {recommendations.map((rec, idx) => (
                        <li key={idx}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
          <span className="message-timestamp">{message.timestamp}</span>
        </div>
      );
    }

    // 📋 Bulk Edit Preview Renderer
    if (message.content === 'preview' && pendingData && pendingData.type === 'bulk') {
      return (
        <div key={index} className="message bot">
          <div className="message-content">
            <div className="form-preview">
              <h4>📋 Edit & Confirm Transactions</h4>
              <div style={{ maxHeight: '350px', overflowY: 'auto', marginBottom: '10px' }}>
                {pendingData.items.map((item, idx) => (
                  <div key={idx} className="edit-item-card">
                    <div className="edit-item-header">
                      <strong>{item.actionType.toUpperCase()}</strong>
                    </div>
                    
                    <div className="edit-item-row">
                      <label>Title</label>
                      <input 
                        type="text" 
                        value={item.data.name || ''} 
                        onChange={(e) => handleUpdateItem(idx, 'name', e.target.value)}
                      />
                    </div>

                    <div className="edit-item-row">
                      <label>Amount (₹)</label>
                      <input 
                        type="number" 
                        value={item.data.amount || 0} 
                        onChange={(e) => handleUpdateItem(idx, 'amount', e.target.value)}
                      />
                    </div>

                    {item.actionType === 'expense' && (
                      <>
                        <div className="edit-item-row">
                          <label>Category</label>
                          <select 
                            value={item.data.category} 
                            onChange={(e) => handleUpdateItem(idx, 'category', e.target.value)}
                          >
                            <option value={FOOD}>{FOOD}</option>
                            <option value={ENTERTAINMENT}>{ENTERTAINMENT}</option>
                            <option value={TRAVEL}>{TRAVEL}</option>
                          </select>
                        </div>
                        <div className="edit-item-row">
                          <label>Date</label>
                          <input 
                            type="date" 
                            value={item.data.date} 
                            onChange={(e) => handleUpdateItem(idx, 'date', e.target.value)}
                          />
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
              <div className="preview-actions">
                <button className="preview-button confirm" onClick={handleConfirm}>
                  ✓ Confirm All
                </button>
                <button className="preview-button cancel" onClick={handleCancel}>
                  ✗ Cancel
                </button>
              </div>
            </div>
          </div>
          <span className="message-timestamp">{message.timestamp}</span>
        </div>
      );
    }

    return (
      <div key={index} className={`message ${message.type}`}>
        <div className="message-content">{message.content}</div>
        <span className="message-timestamp">{message.timestamp}</span>
      </div>
    );
  };

  return (
    <div className="chat-widget">
      {!isOpen ? (
        <button className="chat-button" onClick={() => setIsOpen(true)}>
          💬
        </button>
      ) : (
        <div className="chat-window">
          <div className="chat-header">
            <h3>💰 Expense Assistant</h3>
            <button className="close-button" onClick={() => setIsOpen(false)}>
              ×
            </button>
          </div>
          
          <div className="chat-messages">
            {messages.map((msg, idx) => renderMessage(msg, idx))}
            {isLoading && (
              <div className="message bot">
                <div className="message-content">
                  <div className="loading-indicator">
                    <div className="loading-dot"></div>
                    <div className="loading-dot"></div>
                    <div className="loading-dot"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-container">
            <button
              className={`mic-button ${isListening ? 'listening' : ''}`}
              onClick={startListening}
              disabled={isLoading}
              title="Push to Talk"
            >
              🎤
            </button>
            <input
              type="text"
              className="chat-input"
              placeholder={isListening ? "Listening..." : "Type your expense or income..."}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            <button
              className="send-button"
              onClick={handleSend}
              disabled={isLoading || !inputValue.trim()}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
