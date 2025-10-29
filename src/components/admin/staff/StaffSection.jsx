// StaffSection.jsx
import { Users, Edit, Trash2, AlertCircle } from "lucide-react";

function StaffSection({ staff, loading, error, handleEdit, handleDelete }) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Cargando staff...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {staff.length > 0 ? (
            staff.map((member) => (
              <div
                key={member.id}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {member.usuario}
                      </h3>
                      <span className="text-sm text-gray-500">
                        Staff Member
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(member)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(member.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Email:</span>
                    <span className="text-sm text-gray-900">
                      {member.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Teléfono:</span>
                    <span className="text-sm text-gray-900">
                      {member.telefono}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Creado:</span>
                    <span className="text-sm text-gray-900">
                      {member.fecha_creacion}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay staff registrado
              </h3>
              <p className="text-gray-500 mb-4">
                Comienza agregando tu primer miembro del staff desde el botón
                superior.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StaffSection;
