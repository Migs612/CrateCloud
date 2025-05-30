import { useState } from 'react';
import { Link } from 'react-router-dom';


const ChartCreatorSection = () => {
  const [chartName, setChartName] = useState('');
  const [chartSize, setChartSize] = useState('4x4');
  const [dataSource, setDataSource] = useState('lastfm');

  const gridSizes = {
    '3x3': Array(9).fill(0),
    '4x4': Array(16).fill(0),
    '5x5': Array(25).fill(0)
  };

  return (
    <section className="py-24 px-4 container mx-auto relative z-10">
      <div className="flex flex-col lg:flex-row items-center gap-16">
        <div className="lg:w-1/2">
          <div className="relative mb-8">
            <h2 className="text-3xl md:text-4xl font-bold font-unbounded leading-tight text-transparent bg-clip-text bg-gradient-to-r from-[hsl(var(--color-primary-soft))] via-[hsl(var(--color-primary-light))] to-[hsl(var(--color-primary))]">
              Crea tus propios charts musicales
            </h2>
          </div>

          <p className="text-[rgba(255,255,255,0.8)] mb-10 text-lg">
            Muestra al mundo tus álbumes favoritos con nuestro creador de charts. Personaliza el tamaño, elige tus álbumes y comparte tu colección visual con tus amigos.
          </p>

          <div className="space-y-6 mb-10">
            {[
              { icon: 'ri-layout-grid-line', text: 'Múltiples configuraciones', sub: 'Elige entre formatos 3×3, 4×4 y 5×5.' },
              { icon: 'ri-cloud-line', text: 'Integración con Last.fm', sub: 'Importa automáticamente tus álbumes más escuchados.' },
              { icon: 'ri-share-line', text: 'Compartir fácilmente', sub: 'Exporta y comparte tus charts en redes sociales.' }
            ].map(({ icon, text, sub }, i) => (
              <div key={i} className="flex items-start glass p-4 rounded-xl border border-[hsl(var(--color-primary)/0.2)] backdrop-blur-sm hover:border-[hsl(var(--color-primary)/0.4)] transition-all duration-300">
                <div className="w-10 h-10 bg-gradient-to-br from-[hsl(var(--color-primary))] to-[hsl(var(--color-primary-dark))] rounded-xl flex items-center justify-center mr-4 flex-shrink-0 shadow-lg shadow-[hsl(var(--color-primary)/0.2)]">
                  <i className={`${icon} text-white`}></i>
                </div>
                <div>
                  <h3 className="font-medium text-white text-lg">{text}</h3>
                  <p className="text-sm text-[rgba(255,255,255,0.7)] mt-1">{sub}</p>
                </div>
              </div>
            ))}
          </div>

          <Link
            to="/createchart"
            className="bg-gradient-to-r from-[hsl(var(--color-primary))] to-[hsl(var(--color-primary-dark))] hover:from-[hsl(var(--color-primary-light))] hover:to-[hsl(var(--color-primary))] text-white font-medium py-3 px-8 rounded-full transition-all shadow-lg shadow-[hsl(var(--color-primary-dark)/0.3)] hover:shadow-[hsl(var(--color-primary-dark)/0.5)] flex items-center"
          >
            <i className="ri-add-line mr-2"></i>
            <span>Crear mi primer chart</span>
          </Link>

        </div>

        <div className="lg:w-1/2 mt-10 lg:mt-0">
          <div className="glass rounded-xl overflow-hidden max-w-lg mx-auto border border-[hsl(var(--color-primary)/0.3)] backdrop-blur-lg shadow-xl shadow-[hsl(var(--color-primary-dark)/0.1)]">
            <div className="p-5 border-b border-[hsl(var(--color-primary)/0.2)]"
              style={{ backgroundColor: 'hsl(var(--color-primary)/0.15)' }}>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-[hsl(var(--color-primary))] to-[hsl(var(--color-primary-light))] rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-[hsl(var(--color-primary)/0.3)]">
                  <i className="ri-add-line text-white"></i>
                </div>
                <h3 className="font-unbounded font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-[hsl(var(--color-primary-soft))]">
                  Crear nuevo chart
                </h3>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm mb-2 text-[hsl(var(--color-primary-soft))] font-medium">Nombre del chart</label>
                <input
                  type="text"
                  placeholder="Ej: Mis favoritos de 2023"
                  className="w-full bg-[hsl(var(--color-primary)/0.1)] border border-[hsl(var(--color-primary)/0.3)] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--color-primary)/0.5)] text-white placeholder-[hsl(var(--color-primary-soft)/0.6)]"
                  value={chartName}
                  onChange={(e) => setChartName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm mb-3 text-[hsl(var(--color-primary-soft))] font-medium">Configuración</label>
                <div className="grid grid-cols-3 gap-3">
                  {['3x3', '4x4', '5x5'].map((size) => (
                    <button
                      key={size}
                      className={`glass hover:bg-[hsl(var(--color-primary)/0.2)] rounded-lg p-3 text-center transition-all border ${chartSize === size
                        ? 'bg-[hsl(var(--color-primary)/0.3)] border-[hsl(var(--color-primary))] shadow-lg shadow-[hsl(var(--color-primary)/0.2)]'
                        : 'border-[hsl(var(--color-primary)/0.2)] hover:border-[hsl(var(--color-primary)/0.4)]'
                        }`}
                      onClick={() => setChartSize(size)}
                    >
                      <div className="font-unbounded font-medium text-white">{size}</div>
                      <div className="text-xs text-[hsl(var(--color-primary-soft)/0.7)] mt-1">
                        {size === '3x3' ? '9 álbumes' : size === '4x4' ? '16 álbumes' : '25 álbumes'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-center my-4">
                <div className={`grid gap-1 ${chartSize === '3x3' ? 'grid-cols-3 w-24 h-24' :
                  chartSize === '4x4' ? 'grid-cols-4 w-28 h-28' :
                    'grid-cols-5 w-32 h-32'
                  }`}>
                  {gridSizes[chartSize].map((_, i) => (
                    <div
                      key={i}
                      className="bg-[hsl(var(--color-primary)/0.2)] border border-[hsl(var(--color-primary)/0.3)] rounded-sm"
                    ></div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm mb-3 text-[hsl(var(--color-primary-soft))] font-medium">Fuente de datos</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: 'lastfm', icon: 'ri-user-3-line', label: 'Last.fm' },
                    { key: 'manual', icon: 'ri-edit-line', label: 'Manual' }
                  ].map(({ key, icon, label }) => (
                    <button
                      key={key}
                      className={`glass hover:bg-[hsl(var(--color-primary)/0.2)] rounded-lg p-3 flex items-center justify-center transition-all border ${dataSource === key
                        ? 'bg-[hsl(var(--color-primary)/0.3)] border-[hsl(var(--color-primary))]'
                        : 'border-[hsl(var(--color-primary)/0.2)] hover:border-[hsl(var(--color-primary)/0.4)]'
                        }`}
                      onClick={() => setDataSource(key)}
                    >
                      <i className={`${icon} mr-2 text-[hsl(var(--color-primary-soft))]`}></i>
                      <span className="text-white">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <Link
                to="/createchart"
                className="w-full bg-gradient-to-r from-[hsl(var(--color-primary))] to-[hsl(var(--color-primary-dark))] hover:brightness-110 text-white font-semibold py-3 rounded-lg transition-all shadow-lg shadow-[hsl(var(--color-primary-dark)/0.2)] text-center block"
              >
                Crear chart
              </Link>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChartCreatorSection;
