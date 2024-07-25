import {useState, useEffect, useCallback} from "react";
import OpenAI from "openai";

const assistantId = process.env.REACT_APP_ASSISTANT_ID || ""; // Replace with your assistant ID
const apiKey = process.env.REACT_APP_API_KEY || ""; // Replace with your OpenAI API key

const openai = new OpenAI({apiKey, dangerouslyAllowBrowser: true});

type Message = {
  role: "user" | "assistant";
  content: string;
};

const useAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [thread, setThread] = useState<OpenAI.Beta.Threads.Thread | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Function to create a new thread
  const createThread = useCallback(async () => {
    try {
      setLoading(true);
      const thread = await openai.beta.threads.create();
      setThread(thread);
      setMessages([]);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError("Failed to create thread");
    }
  }, [apiKey, assistantId]);

  // Function to send a message
  const sendMessage = useCallback(
    async (text: string) => {
      if (!thread) {
        setError("No thread found");
        return;
      }
      const userMessage: Message = {role: "user", content: text};
      setMessages((prevMessages) => [...prevMessages, userMessage]);

      try {
        setLoading(true);
        await openai.beta.threads.messages.create(thread.id, userMessage);

        let run = await openai.beta.threads.runs.create(thread.id, {
          assistant_id: assistantId,
        });

        while (run.status !== "completed") {
          run = await openai.beta.threads.runs.retrieve(thread.id, run.id);
        }

        openai.beta.threads.messages
          .list(thread.id)
          .then(({data: messages}) => {
            const assistantMessage =
              messages[0].content[0].type === "text"
                ? {
                    role: "assistant" as const,
                    content: messages[0].content[0].text.value,
                  }
                : {
                    role: "assistant" as const,
                    content: "I'm sorry, I don't understand that.",
                  };
            setMessages((prevMessages) => [...prevMessages, assistantMessage]);
          });

        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError("Failed to send message");
      }
    },
    [apiKey, thread]
  );

  useEffect(() => {
    createThread();
  }, [createThread]);

  return {
    messages,
    sendMessage,
    loading,
    error,
  };
};

export default useAssistant;
