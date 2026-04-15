"use client";

import { useChat } from "ai/react";
import { useState } from "react";

export default function Home() {
  const [theme, setTheme] = useState("dark");
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/chat",
    });

  return (
    <div
      className={`relative ${theme === "light" ? "bg-[#FFFFFF]" : "bg-[#1E1E1E]"} min-h-screen w-screen`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-5">
        <a
          href=""
          className={`text-base font-bold tracking-tighter border ${theme === "light" ? "bg-[#FEFEFE] text-[#272727] border-[#FFFFFF] shadow-[0_6px_14px_rgba(0,0,0,0.12)]" : "bg-[#272727] text-zinc-100 border-[#3E3E3E] shadow-[0_6px_14px_rgba(0,0,0,0.35)]"} px-4 py-1.5 rounded-[100px]`}
        >
          ManGPT <span className="text-xs text-[#8F8F8F]">􀆊</span>
        </a>
        <div
          className={`flex items-center gap-4 border ${theme === "light" ? "bg-[#FEFEFE] text-[#272727] border-[#FFFFFF] shadow-[0_6px_14px_rgba(0,0,0,0.12)]" : "bg-[#272727] border-[#3E3E3E] text-zinc-100 shadow-[0_6px_14px_rgba(0,0,0,0.35)]"} text-sm rounded-[100px] px-3 py-1.5 `}
        >
          <button
            className="cursor-pointer"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? "􀆭" : "􀆹"}
          </button>
          <button className="cursor-pointer">􀈂</button>
        </div>
      </div>

      <div className="flex flex-col items-center ">
        <div
          className="w-full max-w-226 px-5"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            marginBottom: 24,
          }}
        >
          {messages.map((m) => (
            <div
              key={m.id}
              style={{
                display: "flex",
                justifyContent: m.role === "user" ? "flex-end" : "flex-start",
              }}
            >
              <div
                className={`font-medium max-w-full px-3.5 py-2.5 rounded-xl text-[14px] leading-[1.6] ${
                  m.role === "user"
                    ? "bg-[#FFF6D2] text-[#795100]"
                    : theme === "light"
                      ? "bg-[#F5F5F5] text-[#272727]"
                      : "bg-[#2A2A2A] text-[#FFFFFF]"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div style={{ fontSize: 13, color: "#888" }}>
              4d616e616e thinking...
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-226 px-4">
          <div
            className={`p-1 rounded-2xl flex flex-col border ${theme === "light" ? "bg-[#FEFEFE] text-[#272727] border-[#FFFFFF] shadow-[0_6px_14px_rgba(0,0,0,0.12)]" : "bg-[#1F1F1F] text-zinc-100 border-[#3C3C3C] shadow-[0_6px_14px_rgba(0,0,0,0.35)]"}`}
          >
            <textarea
              value={input}
              onChange={handleInputChange}
              placeholder="Ask anything..."
              disabled={isLoading}
              rows={2}
              className={`flex-1 p-2 rounded-md text-sm outline-none resize-none ${theme === "light" ? "bg-[#FEFEFE] text-[#272727] placeholder:text-[#9CA3AF]" : "bg-[#1F1F1F] text-zinc-100 placeholder:text-[#6B7280]"}`}
            />
            <div
              className={`flex items-center justify-between mt-4 p-1 ${theme === "light" ? "text-[#272727]" : "text-zinc-100"}`}
            >
              <div
                className={`text-xs px-2 py-1 rounded-[100px] ${theme === "light" ? "bg-[#F1F1F1] text-[#272727]" : "bg-[#353535] text-zinc-100"}`}
              >
                4d616e616e 1.0
              </div>
              <button
                type="submit"
                disabled={isLoading || !input}
                className="px-2.25 py-1.5 rounded-[100px] bg-[#F6A600] text-white text-sm cursor-pointer disabled:opacity-50 w-fit font-bold"
              >
                􀄨
              </button>
            </div>
          </div>
          <h3 className="text-center text-[#8F8F8F] text-xs mt-2">
            ManGPT is an AI and is currenlty running on Llama 3.3. please double
            check every response.
          </h3>
        </div>
      </form>
    </div>
  );
}
