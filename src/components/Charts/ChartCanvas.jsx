import React from 'react';

const ChartCanvas = ({
  albums,
  customSize,
  chartType,
  dataSource,
  advancedOptions,
  onEdit,
  onAddRequest,
  onRemoveAlbum,
}) => {
  const width = Math.max(customSize?.width || 1, 1);
  const height = Math.max(customSize?.height || 1, 1);
  const totalSlots = width * height;

  const visibleAlbums = albums.slice(0, totalSlots);
  const emptySlots = Array(Math.max(0, totalSlots - visibleAlbums.length)).fill(null);
  const allSlots = [...visibleAlbums, ...emptySlots];

  const rows = [];
  for (let i = 0; i < totalSlots; i += width) {
    rows.push(allSlots.slice(i, i + width));
  }

  const fontStyles = {
    fontFamily: advancedOptions.fontFamily,
    color: advancedOptions.textColor,
  };

  const renderTextBlockForRow = (row, startIndex) => {
    const lines = row
      .map((album, i) => {
        const idx = startIndex + i;
        if (!album) return '';
        return `${idx + 1}. ${advancedOptions.displayMode === 'album' ? album.title : album.artist
          } - ${advancedOptions.displayMode === 'album' ? album.artist : album.title}`;
      })
      .filter(Boolean)
      .join('\n');

    return (
      <div
        className="h-full w-full px-1 overflow-hidden custom-scrollbar"
        style={{
          ...fontStyles,
          fontSize: '7px',
          lineHeight: '1',
          whiteSpace: 'pre-line',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {lines}
      </div>
    );
  };

  const renderGridWithCompactText = () => (
    <div className="flex flex-col w-max min-w-full">
      {rows.map((row, rowIdx) => (
        <div key={`row-${rowIdx}`} className="flex items-stretch gap-4 w-full">
          <div
            className="grid"
            style={{
              gridTemplateColumns: `repeat(${width}, 1fr)`,
              gap: `${advancedOptions.gap}px`,
              flex: 'none',
              width: `calc(${width} * 6rem)`,
            }}
          >
            {row.map((album, i) => (
              <div
                key={album?.id || `empty-${i}`}
                className="relative aspect-square bg-white/5 border border-white/10 overflow-hidden"
                style={{ borderRadius: `${advancedOptions.borderRadius}px` }}
              >
                {album ? (
                  <img
                    src={album.cover}
                    alt={album.title}
                    className="absolute inset-0 w-full h-full object-cover cursor-pointer"
                    onClick={() => onRemoveAlbum?.(album.id)}
                    style={{
                      borderRadius: `${Math.max(advancedOptions.borderRadius - 2, 0)}px`,
                    }}
                  />
                ) : dataSource === 'lastfm' ? (
                  <div className="absolute inset-0 bg-black/40 rounded" />
                ) : (
                  <button
                    className="absolute inset-0 flex flex-col items-center justify-center text-white/50 hover:text-white hover:bg-[hsl(var(--color-primary)/0.1)] transition-colors"
                    onClick={onAddRequest}
                    style={fontStyles}
                  >
                    <i className="ri-add-line text-2xl" />
                    <span className="text-xs mt-1">AÃ±adir</span>
                  </button>
                )}
              </div>
            ))}
          </div>

          {advancedOptions.showSidebar && (
            <div className="flex-1 pl-2 min-w-[160px] overflow-hidden">
              {renderTextBlockForRow(row, rowIdx * width)}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  // ✅ Collage correcto (del primer código)
  const renderCollage = () => (
    <div
      className="grid w-full"
      style={{
        gridTemplateColumns: `repeat(${width}, 1fr)`,
        gridTemplateRows: `repeat(${height}, 1fr)`,
        gap: `${Math.min(1, advancedOptions.gap)}px`,
      }}
    >
      {[...visibleAlbums, ...emptySlots].map((album, i) => (
        <div
          key={album?.id || `empty-${i}`}
          className="aspect-square overflow-hidden"
        >
          {album ? (
            <img
              src={album.cover}
              alt={album.title}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => onRemoveAlbum?.(album.id)}
            />
          ) : dataSource === 'lastfm' ? (
            <div className="w-full h-full bg-black/40" />
          ) : (
            <button
              className="w-full h-full flex items-center justify-center text-white/50 hover:bg-[hsl(var(--color-primary)/0.1)]"
              onClick={onAddRequest}
            >
              <i className="ri-add-line text-2xl"></i>
            </button>
          )}
        </div>
      ))}
    </div>
  );

  // ✅ Lista correcta (del primer código)
  const renderList = () => (
    <div
      className="flex flex-col w-full custom-scrollbar"
      style={{ gap: `${advancedOptions.gap * 2}px`, ...fontStyles }}
    >
      {albums.map((album, idx) => (
        <div
          key={album.id}
          className="flex items-center gap-4 p-4 bg-white/5 rounded border border-white/10 hover:bg-white/10 transition cursor-pointer w-full"
          onClick={() => onRemoveAlbum?.(album.id)}
          style={{ borderRadius: `${advancedOptions.borderRadius}px` }}
        >
          <img
            src={album.cover}
            alt={album.title}
            className="w-20 h-20 object-cover rounded"
          />
          <div className="flex flex-col overflow-hidden flex-1">
            <h3 className="text-white font-bold text-base truncate">{album.title}</h3>
            <p className="text-white/70 text-sm truncate">{album.artist}</p>
            {album.review && (
              <p className="text-white/50 text-xs mt-1 line-clamp-2">{album.review}</p>
            )}
            {advancedOptions.showPlayCount && album.plays > 0 && (
              <div className="text-xs mt-1 text-white/40">{album.plays} plays</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  if (chartType === 'list') return renderList();
  if (chartType === 'collage') return renderCollage();
  return renderGridWithCompactText();
};

export default ChartCanvas;
