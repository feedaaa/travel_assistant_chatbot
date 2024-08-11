"use client";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  Box,
  Button,
  Container,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "model",
      text: "Hello, I am TravelMate, your personal travel assistant. How can I help you today?",
    },
  ]);

  const [message, setMessage] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const sendMessage = async () => {
    if (message.trim() === "") return;

    const newMessages = [
      ...messages,
      { role: "user", text: message },
      { role: "model", text: "" },
    ];
    setMessages(newMessages);
    setMessage("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let botResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        botResponse += chunk;

        setMessages((prevMessages) => {
          const lastMessage = prevMessages[prevMessages.length - 1];
          const otherMessages = prevMessages.slice(0, prevMessages.length - 1);
          return [
            ...otherMessages,
            {
              ...lastMessage,
              text: botResponse,
            },
          ];
        });
      }
    } catch (error) {
      console.error("Error fetching chat response:", error);
    }
  };

  const themeStyles = {
    root: {
      minHeight: '100vh',
      background: 'linear-gradient(to right, #007bff, #1e1e1e)', // Gradient background
      color: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    container: {
      width: "100%",
      height: "80vh",
      display: "flex",
      flexDirection: "column",
      backgroundColor: darkMode ? "#1e1e1e" : "#ffffff",
      borderRadius: 2,
      boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
      marginTop: 5,
      padding: 3,
      border: `1px solid ${darkMode ? "#444" : "#e0e0e0"}`,
    },
    messageBox: {
      fontSize: "1rem",
      fontWeight: "normal",
      backgroundColor: darkMode ? "#2e2e2e" : "#1d5fff",
      color: darkMode ? "#dcdcdc" : "#ffffff",
      padding: "12px 18px",
      borderRadius: 8,
      maxWidth: "70%",
      wordWrap: "break-word",
    },
    sendButton: {
      padding: "10px 20px",
      borderRadius: 2,
      backgroundColor: darkMode ? "#555" : "#007bff",
      color: "#fff",
      "&:hover": {
        backgroundColor: darkMode ? "#666" : "#0056b3",
      },
    },
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <Box sx={themeStyles.root}>
      <Container
        maxWidth="lg"
        sx={{ display: "flex", justifyContent: "center" }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }} // Stack direction based on screen size
          spacing={3}
          width="100%"
          justifyContent="space-between"
          mt={5}
        >
          <Box sx={themeStyles.container}>
            <Stack
              direction="column"
              spacing={2}
              flexGrow={1}
              overflow="auto"
              sx={{
                paddingRight: 1,
                "&::-webkit-scrollbar": {
                  width: "0.4em",
                },
                "&::-webkit-scrollbar-track": {
                  background: darkMode ? "#555" : "#f1f1f1",
                  borderRadius: "8px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: darkMode ? "#f1f1f1" : "#007bff",
                  borderRadius: "8px",
                },
              }}
            >
              {messages.map((message, index) => (
                <Box
                  key={index}
                  display="flex"
                  justifyContent={
                    message.role === "model" ? "flex-start" : "flex-end"
                  }
                  alignItems="center"
                  lineHeight={2}
                >
                  <Box sx={themeStyles.messageBox}>
                    <ReactMarkdown>{message.text}</ReactMarkdown>
                  </Box>
                </Box>
              ))}
            </Stack>
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              justifyContent="center"
              mt={3}
            >
              <TextField
                id="message"
                label="Type your message..."
                variant="outlined"
                fullWidth
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={onKeyDown}
                sx={themeStyles.textField}
              />
              <Button
                variant="contained"
                onClick={sendMessage}
                sx={themeStyles.sendButton}
              >
                Send
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
