import ColorPicker from '../Global/ColorPicker';

const ThemeCustomizer = () => {
  return (
    <div className="glass rounded-xl p-8 max-w-3xl mx-auto border border-[hsl(var(--color-primary)/0.3)] backdrop-blur-lg shadow-xl shadow-[hsl(var(--color-primary)/0.1)]">
      <div className="relative">
        <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full opacity-10 blur-3xl" style={{ backgroundColor: 'hsl(var(--color-primary))' }}></div>
        <div className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full opacity-10 blur-3xl" style={{ backgroundColor: 'hsl(var(--color-primary-soft))' }}></div>

        <h3 className="text-2xl font-unbounded font-semibold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-[hsl(var(--color-primary-soft))] to-[hsl(var(--color-primary-light))]">
          Personaliza tu experiencia
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ColorPicker variant="2" />

          <div className="backdrop-blur-sm p-5 rounded-lg border border-[hsl(var(--color-primary)/0.3)]">
            <p className="text-sm text-white/80 mb-4 font-medium">O extrae colores de un álbum:</p>
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-16 h-16 bg-white/5 rounded-md flex items-center justify-center border border-white/10">
                <i className="ri-image-add-line text-2xl text-white/70"></i>
              </div>
              <div className="flex-1">
                <button
                  className="w-full bg-gradient-to-r from-[hsl(var(--color-primary))] to-[hsl(var(--color-primary-light))] hover:brightness-110 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center transition-all"
                  onClick={() => {
                    alert('Esta funcionalidad estará disponible próximamente.');
                  }}
                >
                  <i className="ri-image-line mr-2"></i>
                  <span>Seleccionar álbum</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeCustomizer;
