import React from 'react';

const TrackList = ({ tracks }) => {
  return (
    <div className="flex-1 w-full max-w-[800px]">
      <h2 className="text-xl font-semibold mb-4">Lista de Canciones</h2>
      <div className="border border-white">
        {tracks.map((track, i) => (
          <div
            key={track.id}
            className="flex justify-between items-center px-4 py-2 border-b border-white last:border-none text-sm"
          >
            <span className="flex-1">{i + 1}&gt; {track.name}</span>
            <span className="text-right w-12">
              {Math.floor(track.duration_ms / 60000)}:
              {String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, '0')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrackList;