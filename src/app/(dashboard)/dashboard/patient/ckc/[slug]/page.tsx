"use client";

import { useEffect, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { useParams } from "next/navigation";
import { Send, User, Bot } from "lucide-react";
import { Button } from "~/components/ui/button";
import { MindMap } from "~/components/ckc/mind-map";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Map of slug to markdown content files
const contentMap: Record<string, string> = {
  "understanding-crci": "/blogs/What is causing my thinking problem document .md",
  "tracking-communication": "/blogs/Cognitive Change Tracking, Communication.md",
  "brain-sharp": "/blogs/Simple Ways to Keep Your Brain Sharp .md",
  "relationships": "/blogs/(FULL) How Cancer Related Cognitive Impairment Affects Your Feelings and Relationships. .md",
  "research-treatment": "/blogs/CRCI Research and Treatment Horizon_.md"
};

// Map of slug to titles
const titleMap: Record<string, string> = {
  "understanding-crci": "Understanding CRCI",
  "tracking-communication": "Tracking & Communication",
  "brain-sharp": "Keeping Your Brain Sharp",
  "relationships": "Feelings & Relationships",
  "research-treatment": "Research & Treatment Horizon"
};

export default function CKCContentPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  const {
    messages,
    input,
    handleInputChange,
    append,
    isLoading: chatIsLoading,
  } = useChat({
    // Initialize with context about the current article
    initialMessages: [
      {
        role: "system",
        content: `You are Hippocampi Coach, a helpful assistant specializing in cancer-related cognitive impairment (CRCI). 
                  The user is currently reading about: ${titleMap[slug] || "CRCI"}. 
                  Be compassionate, clear, and concise in your responses. Focus on practical advice and evidence-based information.`
      },
    ],
  });

  useEffect(() => {
    // Fetch content based on slug
    const fetchContent = async () => {
      try {
        setIsLoading(true);
        const contentPath = contentMap[slug];
        if (!contentPath) {
          setContent("Content not found.");
          return;
        }

        const response = await fetch(contentPath);
        const text = await response.text();
        
        // Remove the filepath comment at the top if present
        const cleanedContent = text.replace(/^<!-- filepath:.*? -->\n/, '');
        setContent(cleanedContent);
      } catch (error) {
        setContent("Error loading content.");
        console.error("Error fetching content:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchContent();
    }
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    await append({ role: "user", content: input });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 h-[calc(100vh-4rem)]">
      {/* Content section - Left side (1/3 width) */}
      <div className="lg:col-span-1 overflow-y-auto bg-white rounded-lg shadow p-6 h-full">
        <h1 className="text-2xl font-bold mb-4 text-primary">{titleMap[slug] || "CRCI Information"}</h1>
        <div className="prose max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
        </div>
      </div>

      {/* Right side container (2/3 width) */}
      <div className="lg:col-span-2 flex flex-col h-full gap-4">
        {/* Chatbot - Top 2/3 of right side */}
        <div className="flex-grow overflow-hidden bg-white rounded-lg shadow flex flex-col">
          <div className="bg-primary/10 p-4 border-b">
            <h2 className="text-lg font-semibold">Ask about {titleMap[slug] || "CRCI"}</h2>
            <p className="text-sm text-gray-600">Chat with Hippocampi Coach about this topic</p>
          </div>
          
          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 space-y-4">
                <Bot size={40} className="text-primary opacity-50" />
                <div>
                  <p className="font-medium">Welcome to Hippocampi Coach!</p>
                  <p className="text-sm">Ask a question about {titleMap[slug] || "CRCI"} to get started.</p>
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-none"
                        : "bg-muted text-muted-foreground rounded-tl-none"
                    }`}
                  >
                    <div className="flex items-center mb-1 text-xs">
                      {message.role === "user" ? (
                        <>
                          <span>You</span>
                          <User size={12} className="ml-1" />
                        </>
                      ) : (
                        <>
                          <Bot size={12} className="mr-1" />
                          <span>Hippocampi Coach</span>
                        </>
                      )}
                    </div>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))
            )}
            {chatIsLoading && (
              <div className="flex justify-start">
                <div className="bg-muted text-muted-foreground rounded-lg rounded-tl-none px-4 py-2 max-w-[80%]">
                  <div className="flex items-center mb-1 text-xs">
                    <Bot size={12} className="mr-1" />
                    <span>Hippocampi Coach</span>
                  </div>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-current animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-current animate-bounce delay-75" />
                    <div className="w-2 h-2 rounded-full bg-current animate-bounce delay-150" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-4 border-t flex items-center gap-2"
          >
            <input
              className="flex-1 p-2 border rounded-md outline-none focus:ring-2 focus:ring-primary/50"
              value={input}
              placeholder={`Ask about ${titleMap[slug] || "CRCI"}...`}
              onChange={handleInputChange}
              disabled={chatIsLoading}
            />
            <Button
              type="submit"
              size="icon"
              disabled={chatIsLoading || !input.trim()}
            >
              <Send size={18} />
            </Button>
          </form>
        </div>

        {/* Mind Map - Bottom section of right side */}
        <div className="h-64 bg-white rounded-lg shadow">
          <MindMap currentNodeId={slug} className="h-full" />
        </div>
      </div>
    </div>
  );
}
