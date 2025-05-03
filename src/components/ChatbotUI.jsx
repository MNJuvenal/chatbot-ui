import React, { useState } from "react";

export default function ChatbotUI() {
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMsg = { sender: "user", text: message };
    setHistory((prev) => [...prev, userMsg]);
    setMessage("");
    setIsTyping(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      setHistory((prev) => [...prev, { sender: "bot", text: data.response }]);
    } catch (error) {
      setHistory((prev) => [
        ...prev,
        { sender: "bot", text: "Erreur de connexion à l'API." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 space-y-6">
      <h1 className="text-2xl font-bold text-center">🎓 Chatbot Étudiant</h1>
      <div className="border p-4 space-y-2 h-96 overflow-y-auto bg-white rounded shadow">
        {history.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2 ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.sender === "bot" && (
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs">
                🤖
              </div>
            )}
            <div
              className={`text-sm p-2 rounded-xl max-w-xs ${
                msg.sender === "user"
                  ? "bg-blue-100 text-right"
                  : "bg-gray-100 text-left"
              }`}
            >
              {msg.text}
            </div>
            {msg.sender === "user" && (
              <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center text-white text-xs">
                🧑
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs">
              🤖
            </div>
            <div className="text-sm p-2 rounded-xl bg-gray-100 max-w-xs">
              Le bot écrit...
            </div>
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Écris un message..."
          className="border rounded p-2 flex-grow"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Envoyer
        </button>
      </div>
    </div>
  );
}
