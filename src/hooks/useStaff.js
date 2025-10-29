import { useState, useEffect } from "react";
import ApiService from "../services/ApiService";

export default function useStaff() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    usuario: "",
    email: "",
    telefono: "",
    password: "",
    confirm_password: "",
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getStaff();
      setStaff(data.staff || []);
      setError("");
    } catch (err) {
      setError("Error al cargar el staff");
      setStaff([
        {
          id: 1,
          usuario: "admin",
          email: "admin@codezero.com",
          telefono: "555-0123",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      usuario: "",
      email: "",
      telefono: "",
      password: "",
      confirm_password: "",
    });
    setFormErrors({});
    setEditing(null);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.usuario.trim()) errors.usuario = "El usuario es requerido";
    if (!formData.email.trim()) errors.email = "El email es requerido";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Email inválido";
    if (!formData.telefono.trim()) errors.telefono = "El teléfono es requerido";
    if (!editing) {
      if (!formData.password.trim())
        errors.password = "La contraseña es requerida";
      else if (formData.password.length < 6)
        errors.password = "Mínimo 6 caracteres";
      if (formData.password !== formData.confirm_password)
        errors.confirm_password = "Contraseñas no coinciden";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return false;
    try {
      if (editing) await ApiService.updateStaff(editing.id, formData);
      else await ApiService.createStaff(formData);
      await loadStaff();
      resetForm();
      setShowModal(false);
      return true;
    } catch {
      setError(editing ? "Error al actualizar" : "Error al crear");
      return false;
    }
  };

  const handleEdit = (member) => {
    setEditing(member);
    setFormData({
      usuario: member.usuario,
      email: member.email,
      telefono: member.telefono,
      password: "",
      confirm_password: "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar miembro?")) return;
    try {
      await ApiService.deleteStaff(id);
      await loadStaff();
    } catch {
      setError("Error al eliminar");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  return {
    staff,
    loading,
    error,
    showModal,
    formData,
    setFormData,
    formErrors,
    handleSubmit,
    handleEdit,
    handleDelete,
    setShowModal,
    closeModal,
    editing,
  };
}
