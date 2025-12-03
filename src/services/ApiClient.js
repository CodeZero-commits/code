const API_BASE = import.meta.env.VITE_API_URL || "https://codezerohub.net/api";

class ApiClient {
  static async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    console.log("🔄 API Request:", {
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

      console.log("📡 API Response:", {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        url: response.url,
      });

      const responseText = await response.text();
      let data;
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (jsonError) {
        console.error("❌ JSON Parse Error:", jsonError);
        console.log("📄 Raw response text:", responseText);
        throw new Error(
          `Invalid JSON response: ${responseText.substring(0, 100)}...`
        );
      }

      if (!response.ok) {
        console.error("❌ HTTP Error:", {
          status: response.status,
          statusText: response.statusText,
          data,
        });
        throw new Error(
          `HTTP error! status: ${response.status} - ${
            data.error || response.statusText
          }`
        );
      }

      console.log("✅ API Success:", data);
      return data;
    } catch (error) {
      console.error("💥 API Error:", error);
      console.error("🔍 Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
      throw error;
    }
  }
}

export default ApiClient;
