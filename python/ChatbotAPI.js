import axios from 'axios';
import { Alert } from 'react-native';

const API_URL = 'http://192.168.1.6:5001'; // Replace with your backend API URL

const getAnswer = async (question) => {
  try {
    const response = await axios.post(`${API_URL}/get_answer`, { question });
    return response.data.answer;
  } catch (error) {
    console.error('Error fetching answer:', error);
    const errorMessage = 'Error: Incorrect or incomplete information inserted.';
    Alert.alert(errorMessage);
    return errorMessage;
  }
};



export default {
  getAnswer,
};
