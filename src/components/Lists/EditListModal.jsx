import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const EditListModal = ({ visible, onClose, onSubmit, list }) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        coverImageUrl: "",
        coverImageFile: null,
        isPrivate: false,
    });

    useEffect(() => {
        if (list) {
            setFormData({
                title: list.title || "",
                description: list.description || "",
                coverImageUrl: list.coverImageUrl || "",
                coverImageFile: null,
                isPrivate: list.isPrivate || false,
            });
        }
    }, [list]);

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        if (type === "file") {
            setFormData((prev) => ({
                ...prev,
                coverImageFile: files[0],
                coverImageUrl: "", // limpio la url para que use la imagen subida
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: type === "checkbox" ? checked : value,
            }));
        }
    };

    const handleSubmit = async () => {
        if (!formData.title.trim()) {
            toast.error("El título no puede estar vacío");
            return;
        }

        await toast.promise(
            onSubmit({ ...formData, _id: list._id }),
            {
                loading: "Guardando cambios...",
                success: "Lista actualizada con éxito",
                error: "Error al guardar cambios",
            }
        );

        onClose(); // ✅ Cierra solo después del éxito
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-zinc-900 w-full max-w-md rounded-2xl p-6 border border-white/10 shadow-2xl relative">
                <button
                    className="absolute top-4 right-4 text-white/50 hover:text-white"
                    onClick={onClose}
                >
                    <i className="ri-close-line text-2xl"></i>
                </button>

                <h2 className="text-xl font-bold text-white mb-4">Editar lista</h2>

                {/* Imagen + texto */}
                <div className="mt-2 mb-6 flex items-center justify-between gap-4">
                    <span className="text-sm font-medium text-white h-28 flex items-center">
                        Editar foto:
                    </span>

                    <div className="relative group w-28 h-28 rounded-xl overflow-hidden shrink-0 cursor-pointer">
                        <img
                            src={
                                formData.coverImageFile
                                    ? URL.createObjectURL(formData.coverImageFile)
                                    : formData.coverImageUrl || "/fallback.jpg"
                            }
                            alt="Portada"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center text-sm font-medium transition-transform duration-200 ease-in-out group-hover:scale-105">
                            Cambiar imagen
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            name="coverImageFile"
                        />
                    </div>
                </div>

                {/* Formulario */}
                <div className="space-y-4">
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Título de la lista"
                        className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/40"
                    />

                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Descripción"
                        className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/40"
                        rows={3}
                    />

                    <label className="flex items-center gap-2 text-sm text-white/80">
                        <input
                            type="checkbox"
                            name="isPrivate"
                            checked={formData.isPrivate}
                            onChange={handleChange}
                            className="accent-yellow-500"
                        />
                        Lista privada
                    </label>
                </div>

                <button
                    onClick={handleSubmit}
                    className="mt-6 w-full py-3 rounded-xl font-semibold hover:scale-105 transition-all"
                    style={{
                        backgroundColor: "hsl(var(--color-primary))",
                        color: "white",
                    }}
                >
                    Guardar cambios
                </button>
            </div>
        </div>
    );
};

export default EditListModal;
