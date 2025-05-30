import React, { useState } from 'react';
import useLastFmAPI from '../../hooks/useLastFmAPI';
import AlbumSearchBar from './AlbumSearchBar';

const ChartSidebar = ({
  customSize,
  setCustomSize,
  advancedOptions,
  setAdvancedOptions,
  chartType,
  setChartType,
  dataSource,
  setDataSource,
  totalSlots,
  albumsCount,
  setAlbums
}) => {
  const [lastFmUser, setLastFmUser] = useState('');
  const callLastFm = useLastFmAPI();

  const updateSize = (axis, value) => {
    const val = Math.max(1, Math.min(20, parseInt(value) || 1));
    setCustomSize({ ...customSize, [axis]: val });
  };

  const toggle = (key) => {
    setAdvancedOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const fontOptions = ['Inter', 'Unbounded', 'Monospace', 'Roboto'];
  const presetBackgrounds = ['#1a1a2e', '#3d0c0c', '#0c3d1c', '#001f3f', '#222222', '#4b003d', '#0e263d'];
  const presetTextColors = ['#ffffff', '#ffcccc', '#ccffcc', '#ccccff', '#ffe4b5', '#e0e0e0'];

  const isCollage = chartType === 'collage';

  const fetchFromLastFM = async () => {
    const total = customSize.width * customSize.height;
    const res = await callLastFm('user.gettopalbums', { user: lastFmUser, limit: total });
    if (res?.topalbums?.album) {
      const parsedAlbums = res.topalbums.album.map((item, i) => ({
        id: `${item.mbid || item.name}-${i}`,
        title: item.name,
        artist: item.artist.name,
        cover: item.image?.[3]?.['#text'] || '',
        plays: parseInt(item.playcount),
        review: ''
      }));
      setAlbums(parsedAlbums.slice(0, customSize.width * customSize.height));
    }
  };

  return (
    <div className="rounded-xl p-4 backdrop-blur bg-[hsl(var(--color-primary-dark)/0.4)] text-sm space-y-6 h-full">
      {/* Dimensiones */}
      <div>
        <label className="block text-xs text-white/60 mb-1">Dimensiones</label>
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-xs text-white/60">Ancho</span>
          <div className="flex items-center gap-1">
            <button onClick={() => updateSize('width', customSize.width - 1)} className="w-6 h-6 bg-white/10 rounded">-</button>
            <span>{customSize.width}</span>
            <button onClick={() => updateSize('width', customSize.width + 1)} className="w-6 h-6 bg-white/10 rounded">+</button>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-white/60">Alto</span>
          <div className="flex items-center gap-1">
            <button onClick={() => updateSize('height', customSize.height - 1)} className="w-6 h-6 bg-white/10 rounded">-</button>
            <span>{customSize.height}</span>
            <button onClick={() => updateSize('height', customSize.height + 1)} className="w-6 h-6 bg-white/10 rounded">+</button>
          </div>
        </div>
        <p className="text-xs mt-1 text-white/40">{totalSlots} espacios totales</p>
      </div>

      {!isCollage && (
        <>
          <div>
            <label className="block text-xs text-white/60 mb-1">Espaciado <span className="float-right">{advancedOptions.gap}px</span></label>
            <input
              type="range"
              min="0"
              max="20"
              value={advancedOptions.gap}
              onChange={(e) => setAdvancedOptions({ ...advancedOptions, gap: parseInt(e.target.value) })}
              className="w-full slider-flat"
            />
          </div>

          <div>
            <label className="block text-xs text-white/60 mb-1">Bordes redondeados <span className="float-right">{advancedOptions.borderRadius}px</span></label>
            <input
              type="range"
              min="0"
              max="20"
              value={advancedOptions.borderRadius}
              onChange={(e) => setAdvancedOptions({ ...advancedOptions, borderRadius: parseInt(e.target.value) })}
              className="w-full slider-flat"
            />
          </div>
        </>
      )}

      {/* Colores */}
      <div>
        <label className="block text-xs text-white/60 mb-1">Color de fondo</label>
        <div className="flex gap-1 mb-2 flex-wrap">
          {presetBackgrounds.map((color) => (
            <button
              key={color}
              className={`w-6 h-6 rounded-full border ${advancedOptions.backgroundColor === color ? 'border-white' : 'border-transparent'}`}
              style={{ backgroundColor: color }}
              onClick={() => setAdvancedOptions({ ...advancedOptions, backgroundColor: color })}
            />
          ))}
          <div className="relative">
            <div className="w-6 h-6 rounded-full bg-[hsl(var(--color-primary-dark))] flex items-center justify-center cursor-pointer">
              <i className="ri-palette-fill text-xs text-white/80 pointer-events-none" />
              <input
                type="color"
                value={advancedOptions.backgroundColor}
                onChange={(e) => setAdvancedOptions({ ...advancedOptions, backgroundColor: e.target.value })}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>
        </div>

        <label className="block text-xs text-white/60 mb-1 mt-3">Color de texto</label>
        <div className="flex gap-1 flex-wrap">
          {presetTextColors.map((color) => (
            <button
              key={color}
              className={`w-6 h-6 rounded-full border ${advancedOptions.textColor === color ? 'border-white' : 'border-transparent'}`}
              style={{ backgroundColor: color }}
              onClick={() => setAdvancedOptions({ ...advancedOptions, textColor: color })}
            />
          ))}
          <div className="relative">
            <div className="w-6 h-6 rounded-full bg-[hsl(var(--color-primary-dark))] flex items-center justify-center cursor-pointer">
              <i className="ri-palette-fill text-xs text-white/80 pointer-events-none" />
              <input
                type="color"
                value={advancedOptions.textColor}
                onChange={(e) => setAdvancedOptions({ ...advancedOptions, textColor: e.target.value })}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tipo de visualización */}
      <div>
        <label className="block text-xs text-white/60 mb-1">Tipo de visualización</label>
        <div className="grid grid-cols-3 gap-1">
          {[
            { id: 'grid', icon: 'ri-layout-grid-line' },
            { id: 'collage', icon: 'ri-collage-line' },
            { id: 'list', icon: 'ri-list-unordered' }
          ].map((view) => (
            <button
              key={view.id}
              onClick={() => setChartType(view.id)}
              className={`p-2 flex items-center justify-center rounded ${chartType === view.id ? 'bg-[hsl(var(--color-primary-dark))] text-white' : 'bg-white/10 text-white/60'}`}
            >
              <i className={`${view.icon} text-lg`} />
            </button>
          ))}
        </div>
      </div>

      {/* Fuente de texto */}
      <div>
        <label className="block text-xs text-white/60 mb-1">Fuente de texto</label>
        <div className="grid grid-cols-2 gap-2">
          {fontOptions.map((font) => (
            <button
              key={font}
              onClick={() => setAdvancedOptions({ ...advancedOptions, fontFamily: font })}
              className={`py-1 px-2 rounded text-xs ${advancedOptions.fontFamily === font ? 'bg-[hsl(var(--color-primary-dark))] text-white' : 'bg-white/10 text-white/70'}`}
              style={{ fontFamily: font }}
            >
              {font}
            </button>
          ))}
        </div>
      </div>

      {/* Fuente de datos */}
      <div>
        <label className="block text-xs text-white/60 mb-1">Fuente de datos</label>
        <div className="flex gap-2 mb-2">
          <button
            onClick={() => setDataSource('manual')}
            className={`flex-1 py-1 rounded ${dataSource === 'manual' ? 'bg-[hsl(var(--color-primary-dark))] text-white' : 'bg-white/10 text-white/70'}`}
          >
            Manual
          </button>
          <button
            onClick={() => setDataSource('lastfm')}
            className={`flex-1 py-1 rounded ${dataSource === 'lastfm' ? 'bg-[hsl(var(--color-primary-dark))] text-white' : 'bg-white/10 text-white/70'}`}
          >
            Last.fm
          </button>
        </div>

        {dataSource === 'lastfm' && (
          <div className="space-y-2">
            <input
              type="text"
              value={lastFmUser}
              onChange={(e) => setLastFmUser(e.target.value)}
              placeholder="Tu usuario de Last.fm"
              className="w-full bg-white/10 text-white px-3 py-2 rounded"
            />
            <button
              onClick={fetchFromLastFM}
              className="w-full py-2 rounded text-white font-semibold bg-[hsl(var(--color-primary))] hover:brightness-110 transition"
            >
              Aceptar
            </button>
          </div>
        )}

        {dataSource === 'manual' && (
          <div className="mt-4">
            <AlbumSearchBar onSelect={(album) => {
              if (albumsCount < totalSlots) {
                setAlbums(prev => [...prev, { ...album, id: Date.now() }]);
              }
            }} />
          </div>
        )}
      </div>

      {/* Mostrar panel lateral */}
      <div className="flex items-center justify-between">
        <label className="text-xs text-white/60">Panel lateral de detalles</label>
        <div
          className={`w-10 h-5 flex items-center rounded-full cursor-pointer ${advancedOptions.showSidebar ? 'bg-[hsl(var(--color-primary))]' : 'bg-white/10'}`}
          onClick={() => toggle('showSidebar')}
        >
          <div
            className={`w-4 h-4 bg-white rounded-full transform transition-transform ${advancedOptions.showSidebar ? 'translate-x-5' : 'translate-x-1'}`}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartSidebar;
