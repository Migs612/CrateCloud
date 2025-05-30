import React from 'react';

const CreateListModal = ({ visible, onClose, onSubmit, newList, setNewList }) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div 
        className="animate-in fade-in-0 zoom-in-95 duration-300 p-6 max-w-md w-full rounded-2xl backdrop-blur-md border relative overflow-hidden"
        style={{
          backgroundColor: 'hsl(var(--color-primary-dark)/0.2)',
          borderColor: 'hsl(var(--color-primary)/0.5)',
          boxShadow: '0 20px 40px hsl(var(--color-primary)/0.2)'
        }}
      >
        {/* Efecto de brillo de fondo */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `linear-gradient(135deg, hsl(var(--color-primary-light)/0.1), hsl(var(--color-primary)/0.1), hsl(var(--color-primary-dark)/0.1))`
          }}
        />
        
        {/* Título + botón cerrar */}
        <div className="flex justify-between items-center mb-6 relative z-10">
          <h3 className="text-xl font-bold text-white font-unbounded">Crear nueva lista</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110 group"
            style={{
              backgroundColor: 'hsl(var(--color-primary)/0.2)',
              color: 'white'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'hsl(var(--color-primary)/0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'hsl(var(--color-primary)/0.2)';
            }}
          >
            <i className="ri-close-line group-hover:rotate-90 transition-transform duration-300"></i>
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={onSubmit} className="relative z-10">
          <div className="mb-4">
            <label className="block text-white/80 text-sm mb-2 font-medium">Título</label>
            <input
              type="text"
              value={newList.title}
              onChange={(e) => setNewList({ ...newList, title: e.target.value })}
              className="w-full rounded-lg p-3 text-white outline-none transition-all duration-300 focus:scale-105"
              style={{
                backgroundColor: 'hsl(var(--color-primary-dark)/0.3)',
                border: '2px solid hsl(var(--color-primary)/0.3)',
                boxShadow: 'inset 0 2px 4px hsl(var(--color-primary)/0.1)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'hsl(var(--color-primary)/0.6)';
                e.target.style.boxShadow = '0 0 0 4px hsl(var(--color-primary)/0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'hsl(var(--color-primary)/0.3)';
                e.target.style.boxShadow = 'inset 0 2px 4px hsl(var(--color-primary)/0.1)';
              }}
              placeholder="Ej: Mis favoritos de indie rock"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-white/80 text-sm mb-2 font-medium">Descripción</label>
            <textarea
              value={newList.description}
              onChange={(e) => setNewList({ ...newList, description: e.target.value })}
              className="w-full rounded-lg p-3 text-white outline-none min-h-[80px] transition-all duration-300 focus:scale-105 resize-none"
              style={{
                backgroundColor: 'hsl(var(--color-primary-dark)/0.3)',
                border: '2px solid hsl(var(--color-primary)/0.3)',
                boxShadow: 'inset 0 2px 4px hsl(var(--color-primary)/0.1)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'hsl(var(--color-primary)/0.6)';
                e.target.style.boxShadow = '0 0 0 4px hsl(var(--color-primary)/0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'hsl(var(--color-primary)/0.3)';
                e.target.style.boxShadow = 'inset 0 2px 4px hsl(var(--color-primary)/0.1)';
              }}
              placeholder="Breve descripción de esta lista..."
            />
          </div>

          <div className="mb-6">
            <label className="flex items-center gap-3 text-white/80 text-sm cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={newList.isPrivate}
                  onChange={(e) => setNewList({ ...newList, isPrivate: e.target.checked })}
                  className="sr-only"
                />
                <div 
                  className={`w-5 h-5 rounded transition-all duration-300 border-2 flex items-center justify-center ${
                    newList.isPrivate ? 'scale-110' : ''
                  }`}
                  style={{
                    backgroundColor: newList.isPrivate ? 'hsl(var(--color-primary))' : 'transparent',
                    borderColor: newList.isPrivate ? 'hsl(var(--color-primary))' : 'hsl(var(--color-primary)/0.5)',
                    boxShadow: newList.isPrivate ? '0 0 10px hsl(var(--color-primary)/0.5)' : 'none'
                  }}
                >
                  {newList.isPrivate && (
                    <i className="ri-check-line text-white text-sm"></i>
                  )}
                </div>
              </div>
              <span className="font-medium group-hover:text-white transition-colors duration-200">
                Lista privada (solo visible para ti)
              </span>
            </label>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-lg text-white/70 font-medium transition-all duration-300 hover:scale-105 hover:text-white"
              style={{
                backgroundColor: 'hsl(var(--color-primary-dark)/0.3)',
                border: '2px solid hsl(var(--color-primary)/0.2)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'hsl(var(--color-primary-dark)/0.5)';
                e.target.style.borderColor = 'hsl(var(--color-primary)/0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'hsl(var(--color-primary-dark)/0.3)';
                e.target.style.borderColor = 'hsl(var(--color-primary)/0.2)';
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-lg text-white font-semibold transition-all duration-300 hover:scale-105 relative overflow-hidden group"
              style={{
                background: `linear-gradient(135deg, hsl(var(--color-primary)), hsl(var(--color-primary-light)))`,
                boxShadow: '0 4px 16px hsl(var(--color-primary)/0.4)'
              }}
            >
              {/* Efecto de brillo en hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <span className="relative z-10">Crear lista</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateListModal;