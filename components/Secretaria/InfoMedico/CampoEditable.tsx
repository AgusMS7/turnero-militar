"use client";
import { useState } from "react";

interface Props {
  width: string;
  label: string;
  value: string;
  latoClass?: string;
  editable?: boolean;
  onEdit?: (value: string) => void;
  onSave?: (value: string) => void;
  onCancel?: () => void;
  type?: "text" | "email" | "tel";
  placeholder?: string;
}

export default function CampoEditable({
  width,
  label,
  value,
  latoClass = "",
  editable = false,
  onEdit,
  onSave,
  onCancel,
  type = "text",
  placeholder = "",
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleEdit = () => {
    if (editable) {
      setIsEditing(true);
      setEditValue(value);
      onEdit?.(value);
    }
  };

  const handleSave = () => {
    onSave?.(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
    onCancel?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <div className={`${width}`}>
      <label
        className={`block text-sm font-medium text-gray-700 mb-2 ${latoClass}`}
      >
        {label}
      </label>

      {isEditing ? (
        <div className="space-y-2">
          <input
            type={type}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={`w-full p-3 border border-gray-300 rounded-lg text-base bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent ${latoClass}`}
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className={`px-3 py-1 bg-teal-600 text-white text-sm rounded hover:bg-teal-700 transition-colors ${latoClass}`}
            >
              Guardar
            </button>
            <button
              onClick={handleCancel}
              className={`px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors ${latoClass}`}
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`p-3 border border-gray-300 rounded-lg text-base bg-gray-50 text-gray-800 cursor-pointer hover:bg-gray-200 transition-colors ${latoClass}`}
          onClick={handleEdit}
        >
          {value || (
            <span className="text-gray-400 italic">Sin especificar</span>
          )}
          {editable && (
            <span className="ml-2 text-xs text-teal-600">
              (Click para editar)
            </span>
          )}
        </div>
      )}
    </div>
  );
}
