"use client";

import { useEffect, useState, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { useParams } from "next/navigation";
import { Send, User, Bot, GripVertical, GripHorizontal } from "lucide-react";
import { Button } from "~/components/ui/button";
import { MindMap } from "~/components/ckc/mind-map";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import Image from 'next/image';

// Define BlogPost type based on database schema
type BlogPost = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  content: string;
  featuredImage: string | null;
  published: boolean;
  publishedAt: Date | null;
  authorId: string | null;
  tags: string[] | null;
};

export default function CKCContentPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Refs for resize functionality
  const containerRef = useRef<HTMLDivElement>(null);
  const resizeHandleRef = useRef<HTMLDivElement>(null);
  const verticalResizeHandleRef = useRef<HTMLDivElement>(null);
  
  // State for panel sizes
  const [leftPanelWidth, setLeftPanelWidth] = useState(33); // percentage of container width
  const [bottomPanelHeight, setBottomPanelHeight] = useState(30); // percentage of right panel height
  const [isResizingHorizontal, setIsResizingHorizontal] = useState(false);
  const [isResizingVertical, setIsResizingVertical] = useState(false);

  const {
    messages,
    input,
    handleInputChange,
    append,
    isLoading: chatIsLoading,
    setInput, // Make sure to extract setInput function
  } = useChat({
    // Initialize with context about the current article
    initialMessages: [
      {
        role: "system",
        content: `You are Hippocampi Coach, a helpful assistant specializing in cancer-related cognitive impairment (CRCI). 
                  The user is currently reading about: ${blog?.title || "CRCI"}. 
                  Be compassionate, clear, and concise in your responses. Focus on practical advice and evidence-based information.`,
        id: "system-init"
      },
    ],
    // Add API endpoint and options for better streaming performance
    api: "/api/chat",
    onFinish: () => {
      // This ensures we handle completion properly
      console.log("Chat response completed");
    },
    experimental_onFunctionCall: () => {
      // Handle any function calls if needed
    }
  });

  useEffect(() => {
    // Fetch blog content by slug from API
    const fetchBlog = async () => {
      try {
        setIsLoading(true);
        if (!slug) {
          return;
        }
        
        const response = await fetch(`/api/blogs/${slug}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch blog: ${response.status}`);
        }
        
        const data = await response.json();
        if (data.blog) {
          setBlog(data.blog);
        } else {
          throw new Error('Blog not found');
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  // Handle mouse events for horizontal resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizingHorizontal || !containerRef.current) return;
      
      const containerRect = containerRef.current.getBoundingClientRect();
      const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
      
      // Limit the resizing range (10% to 70%)
      const clampedWidth = Math.max(10, Math.min(70, newWidth));
      setLeftPanelWidth(clampedWidth);
    };

    const handleMouseUp = () => {
      setIsResizingHorizontal(false);
    };

    if (isResizingHorizontal) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizingHorizontal]);

  // Handle mouse events for vertical resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizingVertical || !containerRef.current) return;
      
      const rightPanel = document.querySelector('.right-panel') as HTMLElement;
      if (!rightPanel) return;
      
      const rightPanelRect = rightPanel.getBoundingClientRect();
      const topDistance = e.clientY - rightPanelRect.top;
      const newHeight = ((rightPanelRect.height - topDistance) / rightPanelRect.height) * 100;
      
      // Limit the resizing range (10% to 50%)
      const clampedHeight = Math.max(10, Math.min(50, newHeight));
      setBottomPanelHeight(clampedHeight);
    };

    const handleMouseUp = () => {
      setIsResizingVertical(false);
    };

    if (isResizingVertical) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizingVertical]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Store the current input before sending
    const currentInput = input.trim();
    
    // Clear input field immediately for better UX
    setInput("");
    
    // Then send the message
    await append({
      role: "user",
      content: currentInput,
    });
  };

  // Custom renderers for markdown components
  const customRenderers = {
    h1: ({ node, ...props }: any) => (
      <h1 className="text-2xl font-bold text-primary mt-6 mb-4" {...props} />
    ),
    h2: ({ node, ...props }: any) => (
      <h2 className="text-xl font-bold text-gray-800 mt-5 mb-3" {...props} />
    ),
    h3: ({ node, ...props }: any) => (
      <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2" {...props} />
    ),
    p: ({ node, ...props }: any) => (
      <p className="my-3 text-gray-700 leading-relaxed" {...props} />
    ),
    ul: ({ node, ...props }: any) => (
      <ul className="list-disc pl-6 my-4 space-y-2" {...props} />
    ),
    ol: ({ node, ...props }: any) => (
      <ol className="list-decimal pl-6 my-4 space-y-2" {...props} />
    ),
    li: ({ node, ...props }: any) => (
      <li className="text-gray-700" {...props} />
    ),
    blockquote: ({ node, ...props }: any) => (
      <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-gray-600" {...props} />
    ),
    a: ({ node, ...props }: any) => (
      <a className="text-primary hover:underline" {...props} />
    ),
    img: ({ node, ...props }: any) => {
      const { src, alt } = props;
      return (
        <div className="my-6 flex justify-center">
          <div className="relative max-w-full overflow-hidden rounded-lg shadow-md">
            {/* Use Next.js Image when possible, fall back to regular img */}
            {src.startsWith('http') || src.startsWith('/') ? (
              <Image 
                src={src} 
                alt={alt || 'Article image'} 
                width={600} 
                height={400} 
                className="object-cover"
                unoptimized={src.startsWith('http')}
              />
            ) : (
              <img 
                src={src} 
                alt={alt || 'Article image'} 
                className="max-w-full h-auto rounded-lg"
              />
            )}
            {alt && <div className="text-sm text-center text-gray-500 mt-2">{alt}</div>}
          </div>
        </div>
      );
    },
    code: ({ node, inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <div className="my-4 rounded-lg overflow-hidden">
          <SyntaxHighlighter
            style={tomorrow}
            language={match[1]}
            PreTag="div"
            className="rounded-lg"
            {...props}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        </div>
      ) : (
        <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-primary" {...props}>
          {children}
        </code>
      );
    },
    table: ({ node, ...props }: any) => (
      <div className="overflow-x-auto my-6">
        <table className="min-w-full divide-y divide-gray-200 border" {...props} />
      </div>
    ),
    thead: ({ node, ...props }: any) => (
      <thead className="bg-gray-50" {...props} />
    ),
    tr: ({ node, ...props }: any) => (
      <tr className="hover:bg-gray-50" {...props} />
    ),
    th: ({ node, ...props }: any) => (
      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b" {...props} />
    ),
    td: ({ node, ...props }: any) => (
      <td className="px-4 py-3 text-sm border-b" {...props} />
    )
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Content Not Found</h1>
        <p className="text-gray-600">We couldn't find the content you're looking for.</p>
      </div>
    );
  }

  const rightPanelWidth = 100 - leftPanelWidth;
  const chatPanelHeight = 100 - bottomPanelHeight;

  return (
    <div 
      ref={containerRef}
      className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden"
    >
      <div className="flex flex-1 overflow-hidden">
        {/* Content section - Left panel (resizable) with improved styling */}
        <div 
          className="overflow-y-auto bg-white rounded-lg shadow p-6"
          style={{ width: `${leftPanelWidth}%` }}
        >
          <h1 className="text-2xl font-bold mb-4 text-primary">{blog.title}</h1>
          
          {/* Display tags if available */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {blog.tags.map((tag) => (
                <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          {/* Display publication date if available */}
          {blog.publishedAt && (
            <div className="text-sm text-gray-500 mb-6">
              Published: {new Date(blog.publishedAt).toLocaleDateString()}
            </div>
          )}
          
          {/* Enhanced markdown renderer with custom components */}
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={customRenderers}
            >
              {blog.content}
            </ReactMarkdown>
          </div>
        </div>

        {/* Resize handle for horizontal resize */}
        <div
          ref={resizeHandleRef}
          className="cursor-col-resize w-2 bg-transparent hover:bg-gray-300 flex items-center justify-center transition-colors"
          onMouseDown={() => setIsResizingHorizontal(true)}
        >
          <GripVertical size={16} className="text-gray-400" />
        </div>

        {/* Right panel container (resizable) */}
        <div 
          className="right-panel flex flex-col"
          style={{ width: `${rightPanelWidth}%` }}
        >
          {/* Chatbot - Top of right panel (resizable) */}
          <div 
            className="flex-grow overflow-hidden bg-white rounded-lg shadow flex flex-col"
            style={{ height: `${chatPanelHeight}%` }}
          >
            <div className="bg-primary/10 p-4 border-b">
              <h2 className="text-lg font-semibold">Ask about {blog.title}</h2>
              <p className="text-sm text-gray-600">Chat with Hippocampi Coach about this topic</p>
            </div>
            
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              {messages.length <= 1 ? ( // Changed from === 0 to <= 1 to hide system message too
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 space-y-4">
                  <Bot size={40} className="text-primary opacity-50" />
                  <div>
                    <p className="font-medium">Welcome to Hippocampi Coach!</p>
                    <p className="text-sm">Ask a question about {blog.title} to get started.</p>
                  </div>
                </div>
              ) : (
                // Filter out system messages to prevent them from showing to the user
                messages
                  .filter(message => message.role !== "system")
                  .map((message, index) => (
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
                placeholder={`Ask about ${blog.title}...`}
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

          {/* Resize handle for vertical resize */}
          <div
            ref={verticalResizeHandleRef}
            className="cursor-row-resize h-2 bg-transparent hover:bg-gray-300 flex items-center justify-center transition-colors"
            onMouseDown={() => setIsResizingVertical(true)}
          >
            <GripHorizontal size={16} className="text-gray-400" />
          </div>

          {/* Mind Map - Bottom section of right side (resizable) */}
          <div 
            className="bg-white rounded-lg shadow"
            style={{ height: `${bottomPanelHeight}%` }}
          >
            <MindMap currentNodeId={slug} className="h-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
