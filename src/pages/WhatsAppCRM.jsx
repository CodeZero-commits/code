import React, { useEffect, useState, useRef } from "react";
import WhatsService from "../services/WhatsService";

export default function WhatsAppCRM() {
  const [conversations, setConversations] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // 🔹 Cargar lista de conversaciones
  useEffect(() => {
    async function loadChats() {
      try {
        const data = await WhatsService.getConversations();
        setConversations(data.conversations || []);
      } catch (error) {
        console.error("❌ Error cargando conversaciones:", error);
      }
    }
    loadChats();
  }, []);

  // 🔹 Abrir chat seleccionado
  const openChat = async (contact) => {
    setSelectedContact(contact);
    try {
      const data = await WhatsService.getMessages(contact.contact_id);
      setMessages(data.messages || []);
      scrollToBottom();
    } catch (error) {
      console.error("❌ Error cargando mensajes:", error);
    }
  };

  // 🔹 Enviar mensaje
  const handleSend = async () => {
    if (!newMessage.trim() || !selectedContact) return;

    try {
      await WhatsService.sendMessage({
        to: selectedContact.phone,
        message: newMessage.trim(),
      });

      // Agregar mensaje localmente
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          message: newMessage.trim(),
          direction: "out",
          created_at: new Date().toISOString(),
        },
      ]);

      setNewMessage("");
      scrollToBottom();
    } catch (error) {
      console.error("❌ Error enviando mensaje:", error);
    }
  };

  // 🔹 Auto scroll al final
  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div style={{ display: "flex", height: "80vh", border: "1px solid #ccc" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "300px",
          borderRight: "1px solid #ccc",
          overflowY: "auto",
        }}
      >
        <h3 style={{ textAlign: "center" }}>Chats</h3>
        {conversations.map((c) => (
          <div
            key={c.contact_id}
            onClick={() => openChat(c)}
            style={{
              padding: "10px",
              cursor: "pointer",
              backgroundColor:
                selectedContact?.contact_id === c.contact_id
                  ? "#e6f7ff"
                  : "white",
              borderBottom: "1px solid #eee",
            }}
          >
            <strong>{c.name || "Desconocido"}</strong>
            <p style={{ margin: 0, fontSize: "0.85em" }}>
              {c.last_message || "Sin mensajes"}
            </p>
          </div>
        ))}
      </div>

      {/* Chat Window */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div
          style={{
            flex: 1,
            padding: "10px",
            overflowY: "auto",
            backgroundColor: "#f9f9f9",
          }}
        >
          {messages.map((m) => (
            <div
              key={m.id}
              style={{
                marginBottom: "10px",
                textAlign: m.direction === "out" ? "right" : "left",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  padding: "8px 12px",
                  borderRadius: "20px",
                  backgroundColor: m.direction === "out" ? "#dcf8c6" : "#fff",
                  border: "1px solid #ddd",
                  maxWidth: "70%",
                  wordBreak: "break-word",
                }}
              >
                {m.message}
              </span>
              <div style={{ fontSize: "0.7em", color: "#888" }}>
                {new Date(m.created_at).toLocaleTimeString()}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        {selectedContact && (
          <div
            style={{
              display: "flex",
              borderTop: "1px solid #ccc",
              padding: "10px",
            }}
          >
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
              style={{ flex: 1, padding: "8px 12px", borderRadius: "20px" }}
              placeholder="Escribe un mensaje..."
            />
            <button
              onClick={handleSend}
              style={{
                marginLeft: "10px",
                padding: "8px 16px",
                borderRadius: "20px",
                backgroundColor: "#0084ff",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Enviar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
