import axios from 'axios';

// URL of your Node.js server (update localhost to your IP if running on a real device)
const SERVER_URL = 'http://192.168.0.235:3000/getSheetData'; 

/**
 * Fetch data from your Node.js backend that retrieves data from Google Sheets
 * @returns {Promise<any[]>} - Data from Google Sheets
 */
export async function getSheetData() {
  try {
    const response = await axios.get(SERVER_URL);
    return response.data; // The data returned by the Google Sheets API
  } catch (error) {
    console.error('Error fetching Google Sheet data:', error);
    throw error;
  }
}
