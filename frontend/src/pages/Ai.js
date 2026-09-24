import React, { useState } from "react";
import { IoIosSend } from "react-icons/io";
import { generateContent } from "../components/Modal";
import ReactMarkdown from "react-markdown";
import Header from "../components/Header";

export default function Home() {
  const [userInput, setUserInput] = useState("");
  const [response, setResponse] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  const handleClear = () => {
    setUserInput("");
    setResponse([]);
    setIsLoading(false);
  };

  const handleSubmit = async () => {
    if (!userInput.trim()) {
      setResponse([{ type: "system", message: "Please enter a prompt.." }]);
      return;
    }

    setIsLoading(true);
    try {
      const res = await generateContent(userInput);
      setResponse((prevResponse) => [
        ...prevResponse,
        { type: "user", message: userInput },
        { type: "bot", message: res() },
      ]);
      setUserInput("");
    } catch (err) {
      console.error("Error generating response:", err);
      setResponse((prevResponse) => [
        ...prevResponse,
        { type: "system", message: "Failed to generate response" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div>
      <Header />
      <div className="chat-container">
        <style jsx>{`
          .chat-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            height: 90vh;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            background-color: #f8f9fa;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }

          h1 {
            text-align: center;
            color: #495057;
            font-size: 2rem;
            margin-top: 30vh;
            opacity: 0.8;
          }

          .chat-history {
            flex-grow: 1;
            overflow-y: auto;
            padding: 20px 10px;
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          .message {
            padding: 12px 16px;
            border-radius: 18px;
            max-width: 80%;
            word-wrap: break-word;
            line-height: 1.5;
            margin: 0;
          }

          .user {
            align-self: flex-end;
            background-color: #4e6af8;
            color: white;
            border-bottom-right-radius: 5px;
          }

          .bot {
            align-self: flex-start;
            background-color: #e9ecef;
            color: #212529;
            border-bottom-left-radius: 5px;
          }

          .system {
            align-self: center;
            background-color: #ffc107;
            color: #212529;
            font-style: italic;
          }

          .loading-text {
            align-self: center;
            color: #6c757d;
            font-style: italic;
          }

          .input-container {
            display: flex;
            gap: 10px;
            padding: 15px 0;
            align-items: center;
          }

          .chat-input {
            flex-grow: 1;
            padding: 12px 16px;
            border-radius: 24px;
            border: 1px solid #ced4da;
            outline: none;
            font-size: 16px;
          }

          .chat-input:focus {
            border-color: #4e6af8;
            box-shadow: 0 0 0 2px rgba(78, 106, 248, 0.25);
          }

          .send-btn {
            background-color: #4e6af8;
            color: white;
            border: none;
            border-radius: 50%;
            width: 48px;
            height: 48px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 24px;
            transition: background-color 0.2s;
          }

          .send-btn:hover {
            background-color: #3a56e4;
          }

          .clear-btn {
            background-color: #6c757d;
            color: white;
            border: none;
            border-radius: 24px;
            padding: 8px 16px;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.2s;
          }

          .clear-btn:hover {
            background-color: #5a6268;
          }

          @media (max-width: 768px) {
            .chat-container {
              height: 95vh;
              border-radius: 0;
              padding: 10px;
            }

            .message {
              max-width: 90%;
            }
          }
        `}</style>

        {response.length === 0 ? (
          <h1>Got Questions? Chatty's Got Answers.</h1>
        ) : (
          <div className="chat-history">
            {response.map((msg, index) => (
              <p key={index} className={`message ${msg.type}`}>
                <ReactMarkdown>{msg.message}</ReactMarkdown>
              </p>
            ))}
            {isLoading && (
              <p className="loading-text">Generating response...</p>
            )}
          </div>
        )}

        <div className="input-container">
          <button onClick={handleClear} className="clear-btn">
            Clear
          </button>

          <input
            type="text"
            value={userInput}
            onChange={handleUserInput}
            onKeyDown={handleKeyPress}
            placeholder="Type your message here..."
            className="chat-input"
          />

          <button onClick={handleSubmit} className="send-btn">
            <IoIosSend />
          </button>
        </div>
      </div>
    </div>
  );
}
