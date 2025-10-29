// utils/helpers.js

/**
 * Convierte los valores del backend de tipo de proyecto a un valor amigable
 */
export function mapBackendProjectType(projectType) {
  switch (projectType) {
    case "clinic":
    case "clinica":
      return "clinic";
    case "pos":
    case "punto_venta":
      return "pos";
    case "restaurant":
    case "restaurante":
      return "restaurant";
    default:
      return "other";
  }
}

/**
 * Convierte los estados del backend a modalidad entendible
 */
export function mapBackendStateToModality(state) {
  switch (state) {
    case "activo":
      return "activo";
    case "inactivo":
      return "inactivo";
    case "prueba":
      return "prueba";
    case "suspendido":
      return "suspendido";
    default:
      return "inactivo";
  }
}

/**
 * Extrae especialidades de un campo 'giro' del cliente
 * (puedes adaptarlo según cómo venga el giro desde el backend)
 */
export function extractSpecialtiesFromGiro(giro) {
  if (!giro) return [];
  // si viene como string separado por comas
  return giro.split(",").map((s) => s.trim());
}
