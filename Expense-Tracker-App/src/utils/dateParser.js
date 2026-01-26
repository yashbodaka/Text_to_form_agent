import * as chrono from 'chrono-node';

/**
 * Parse natural language date input into YYYY-MM-DD format
 * @param {string} dateInput - Natural language date (e.g., "yesterday", "21st jan 2026", "today")
 * @returns {string} - Formatted date string in YYYY-MM-DD format
 */
export const parseDate = (dateInput) => {
  if (!dateInput) {
    // Default to today if no date provided
    return new Date().toISOString().split('T')[0];
  }

  // Try parsing with chrono-node
  const parsedDates = chrono.parse(dateInput);
  
  if (parsedDates.length > 0) {
    const date = parsedDates[0].start.date();
    const parsedDateStr = date.toISOString().split('T')[0];
    
    // Validate the parsed date is reasonable (not in far future, not too old)
    const today = new Date();
    const parsedDate = new Date(parsedDateStr);
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    const oneMonthFuture = new Date();
    oneMonthFuture.setMonth(today.getMonth() + 1);
    
    if (parsedDate < oneYearAgo || parsedDate > oneMonthFuture) {
      console.warn(`Parsed date ${parsedDateStr} seems unusual, defaulting to today`);
      return today.toISOString().split('T')[0];
    }
    
    return parsedDateStr;
  }

  // If chrono fails, try direct Date parsing
  const directParse = new Date(dateInput);
  if (!isNaN(directParse.getTime())) {
    return directParse.toISOString().split('T')[0];
  }

  // If all fails, return today's date
  console.warn(`Could not parse date "${dateInput}", defaulting to today`);
  return new Date().toISOString().split('T')[0];
};

/**
 * Format a date string for display
 * @param {string} dateStr - Date string in YYYY-MM-DD format
 * @returns {string} - Formatted date for display (e.g., "Jan 24, 2026")
 */
export const formatDateForDisplay = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};
