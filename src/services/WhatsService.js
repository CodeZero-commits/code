const API_BASE = "https://codezerohub.net/api";

class WhatsService {
  static async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    console.log("🔄 API Request (Whats):", {
      url,
      method: options.method || "GET",
      headers: options.headers,
      body: options.body,
    });

    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      const responseText = await response.text();
      let data;
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (jsonError) {
        console.error("❌ JSON Parse Error (Whats):", jsonError);
        throw new Error(
          `Invalid JSON response: ${responseText.substring(0, 100)}...`
        );
      }

      if (!response.ok) {
        throw new Error(
          `HTTP error! status: ${response.status} - ${
            data.error || response.statusText
          }`
        );
      }

      return data;
    } catch (error) {
      console.error("💥 API Error (Whats):", error);
      throw error;
    }
  }

  // 🔹 Lista de conversaciones (sidebar)
  static async getConversations() {
    return this.request("/whats_crm/whats_conversations.php", {
      method: "GET",
    });
  }

  // 🔹 Mensajes de un contacto específico
  static async getMessages(contactId) {
    return this.request(
      `/whats_crm/whats_conversations.php?contact_id=${contactId}`,
      {
        method: "GET",
      }
    );
  }

  // 🔹 Enviar mensaje
  static async sendMessage(messageData) {
    return this.request("/whats_crm/whats_send.php", {
      method: "POST",
      body: JSON.stringify(messageData),
    });
  }
}

export default WhatsService;
