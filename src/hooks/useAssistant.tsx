import {useState, useEffect, useCallback} from "react";
import OpenAI from "openai";
import {sleep} from "../utils";
import axios from "axios";
import {getQueriesForElement} from "@testing-library/react";

const assistantId = process.env.REACT_APP_ASSISTANT_ID || ""; // Replace with your assistant ID
const apiKey = process.env.REACT_APP_API_KEY || ""; // Replace with your OpenAI API key

const openai = new OpenAI({apiKey, dangerouslyAllowBrowser: true});

const API_URL =
  "https://duxpxzt5wk7h23whbjqluoriwa0gbuec.lambda-url.us-east-1.on.aws";

const Endpoints = {
  getQuery: "get_query",
  submitQuery: "submit_query",
};

type Message = {
  role: "user" | "assistant";
  content: string;
};

const useAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getMessage = (queryId: string) => {
    return axios.get(`${API_URL}/${Endpoints.getQuery}`, {
      data: {query_id: queryId},
    });
  };

  // Function to send a message
  const sendMessage = useCallback(async (text: string) => {
    const userMessage: Message = {role: "user", content: text};
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/${Endpoints.submitQuery}`, {
        data: {query_text: text},
      });

      if (res.status !== 200) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            role: "assistant" as const,
            content: "Sorry! Something went wrong!",
          },
        ]);
        return;
      }

      const queryId = res.data.query_id;

      let response = "";

      while (!response) {
        const res = await getMessage(queryId);
        if (res.data?.answer_text) {
          response = res.data?.answer_text;
        }
        await sleep(500);
      }

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant" as const,
          content: response,
        },
      ]);

      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError("Failed to send message");
    }
  }, []);

  const boilServer = () => {
    axios.get(`${API_URL}`);
  };

  useEffect(() => {
    boilServer();
  }, []);

  return {
    messages,
    sendMessage,
    loading,
    error,
  };
};

export default useAssistant;
