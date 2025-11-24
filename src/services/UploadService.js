const API_BASE = "https://codezerohub.net/api";

class UploadService {
  static async uploadImage(file) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE}/upload.php`, {
      method: "POST",
      body: formData,
    });

    const text = await response.text();
    let data = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch (error) {
      throw new Error("Respuesta inválida del servidor");
    }

    if (!response.ok || data.success === false) {
      throw new Error(data.error || "No se pudo subir la imagen");
    }

    return data;
  }
}

export default UploadService;
