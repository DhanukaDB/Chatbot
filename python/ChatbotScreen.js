import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native';
import ChatbotAPI from './ChatbotAPI';
import Icon from 'react-native-vector-icons/FontAwesome';

const ChatbotScreen = () => {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [editingMessage, setEditingMessage] = useState(null);
  const flatListRef = useRef(null);

  const handleEditClick = (message) => {
    setEditingMessage(message);
    setInputText(message.text);
  };

  const handleSaveEdit = async () => {
    if (!editingMessage) return;

    const updatedMessages = messages.map((message) => {
      if (message === editingMessage) {
        return { ...message, text: inputText };
      }
      return message;
    });

    setMessages(updatedMessages);
    setInputText('');
    setEditingMessage(null);

    // Send the edited message to the chatbot here
    const response = await ChatbotAPI.getAnswer(inputText);
    const botMessage = {
      text: response,
      user: false,
      timestamp: new Date().toISOString(),
    };
    setMessages((prevMessages) => [botMessage, ...prevMessages]);
  };

  const handleUserInput = async () => {
    if (inputText.trim() === '') return;

    const userMessage = {
      text: inputText,
      user: true,
      timestamp: new Date().toISOString(),
    };

    setMessages((prevMessages) => [userMessage, ...prevMessages]);

    const response = await ChatbotAPI.getAnswer(inputText);
    const botMessage = {
      text: response,
      user: false,
      timestamp: new Date().toISOString(),
    };

    setMessages((prevMessages) => [botMessage, ...prevMessages]);
    setInputText('');
    setEditingMessage(null);
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.messageContainer}>
      {item.user && item === editingMessage ? (
        <TouchableOpacity onPress={handleSaveEdit}>
          <Icon name="check" size={20} color="green" style={styles.editIcon} />
        </TouchableOpacity>
      ) : (
        item.user && (
          <TouchableOpacity onPress={() => handleEditClick(item)}>
            <Icon name="edit" size={20} color="blue" style={styles.editIcon} />
          </TouchableOpacity>
        )
      )}
      <View
        style={[
          styles.messageContent,
          item.user ? styles.userMessageContent : styles.botMessageContent,
        ]}
      >
        <Text style={styles.messageText}>{item.text}</Text>
        <Text style={styles.timestamp}>
          {item.timestamp ? new Date(item.timestamp).toLocaleTimeString() : ''}
        </Text>
      </View>
    </View>
  );
  

  useEffect(() => {
    flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
  }, [messages]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
      <Image
          source={require('./assets/baby.png')} // Provide the path to your logo image
          style={styles.logo}
        />
        <Text style={styles.topic}>Bump Advisor</Text>
      </View>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.text}-${index}`}
        inverted
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Ask from Me..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleUserInput}>
          <Icon name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    backgroundColor: '#ffddf4',
    marginTop: 20,
  },
  messageList: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
    backgroundColor: '#cc8899',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
    maxWidth: '80%', // Limit message width
  },
  botMessageContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#aa98a9',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
    maxWidth: '80%', // Limit message width
  },
  messageText: {
    color: 'white',
  },

  timestamp: {
    fontSize: 10, // Adjust font size as needed
    color: 'black', // Choose a suitable color for timestamps
    alignSelf: 'flex-end',
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  input: {
    flex: 1,
    height: 40,
  },
  sendButton: {
    backgroundColor: 'blue',
    padding: 12,
    borderRadius: 8,
    marginLeft: 8,
  },

  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editIcon: {
    marginLeft: 4, // Adjust this margin to move the icon closer to the user message container
    marginRight: 8,
  },

  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Align message, icons, and timestamp
    marginBottom: 8,
  },
  userMessageContent: {
    backgroundColor: '#cc8899',
    padding: 8,
    borderRadius: 8,
    maxWidth: '80%',
  },
  botMessageContent: {
    backgroundColor: '#aa98a9',
    padding: 8,
    borderRadius: 8,
    maxWidth: '80%',
  },

  // Header styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,

  },
  logo: {
    width: 40, // Adjust the width of your logo image
    height: 40, // Adjust the height of your logo image
    marginRight: 10, // Adjust the margin between the logo and topic
  },
  topic: {
    fontSize: 20, // Adjust the font size for your topic
    fontWeight: 'bold', // Adjust the font weight for your topic
  },
});

export default ChatbotScreen;

