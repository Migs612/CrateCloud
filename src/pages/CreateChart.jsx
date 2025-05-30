import React, { useState, useRef } from 'react';
import Navbar from '../components/Global/Navbar';
import Footer from '../components/Global/Footer';
import ChartCanvas from '../components/Charts/ChartCanvas';
import ChartSidebar from '../components/Charts/ChartSidebar';
import html2canvas from 'html2canvas';
import { useTheme } from '../context/ThemeContext';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../hooks/firebase';
import toast from 'react-hot-toast';

const CreateChart = () => {
  const uid = localStorage.getItem('uid');
  const { color } = useTheme();
  const chartRef = useRef(null);

  const [chartTitle, setChartTitle] = useState('Mi Chart Musical');
  const [customSize, setCustomSize] = useState({ width: 7, height: 7 });
  const [chartType, setChartType] = useState('grid');
  const [dataSource, setDataSource] = useState('manual');
  const [albums, setAlbums] = useState([]);
  const [isExporting, setIsExporting] = useState(false);

  const [advancedOptions, setAdvancedOptions] = useState({
    gap: 3,
    backgroundColor: '#121212',
    borderRadius: 8,
    showSidebar: true,
    showPlayCount: false,
    fontFamily: 'Inter',
    textColor: '#ffffff',
    displayMode: 'album',
    timeRange: 'all',
    customTimeRange: { weeks: 0, days: 0, months: 0 },
  });

  const handleExportImage = async () => {
    if (!chartRef.current || isExporting) return;

    setIsExporting(true);

    try {
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: advancedOptions.backgroundColor,
        scale: 2,
        allowTaint: true,
        useCORS: true,
      });

      const link = document.createElement('a');
      link.download = `${chartTitle || 'chart'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error al generar la imagen', error);
      toast.error('Error al generar la imagen del chart.');
    } finally {
      setTimeout(() => {
        setIsExporting(false);
      }, 1000);
    }
  };

  const handleSaveChart = async () => {
    if (!chartRef.current) {
      toast.error('No se encontró el componente del chart.');
      return;
    }

    if (!uid) {
      toast.error('Debes iniciar sesión para guardar tu chart.');
      return;
    }

    if (isExporting) return;

    setIsExporting(true);

    try {
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: advancedOptions.backgroundColor,
        scale: 2,
        useCORS: true,
      });

      const blob = await new Promise((resolve) =>
        canvas.toBlob((b) => resolve(b), 'image/png')
      );

      if (!blob) throw new Error('No se pudo generar la imagen');

      const filename = `chart-${Date.now()}.png`;
      const imageRef = ref(storage, `charts/${uid}/${filename}`);
      await uploadBytes(imageRef, blob);
      const downloadUrl = await getDownloadURL(imageRef);

      const response = await fetch('http://localhost:4000/api/charts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userUid: uid,
          title: chartTitle || 'Mi Chart',
          imageUrl: downloadUrl,
          createdAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error('Error response:', text);
        throw new Error('Error al guardar en MongoDB');
      }

      toast.success('Chart guardado correctamente.');
    } catch (err) {
      console.error('Error general:', err);
      toast.error('Hubo un error al guardar el chart.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleRemoveAlbum = (albumId) => {
    setAlbums(albums.filter((album) => album.id !== albumId));
  };

  const totalSlots = customSize.width * customSize.height;

  return (
    <div className="relative min-h-screen text-white overflow-x-hidden">
      <div
        className="fixed inset-0 -z-10 transition-all duration-1000"
        style={{
          backgroundImage: 'var(--background-dynamic)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '300% 300%',
          backgroundAttachment: 'fixed',
          animation: 'fondo-move 10s ease-in-out infinite, fondo-pulso 12s ease-in-out infinite',
        }}
      />

      <Navbar />

      <main className="relative z-10 pt-24 pb-12 px-4 max-w-7xl mx-auto">
        <div className="glass-rounded p-6 mb-8">
          <div className="mb-6 flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-unbounded font-bold text-primary mb-2">
                Crear Chart Musical
              </h1>
              <p className="text-white/70">
                Personaliza y crea un chart musical con tus álbumes favoritos.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleExportImage}
                disabled={isExporting}
                className={`${
                  isExporting ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-110'
                } bg-[hsl(var(--color-primary))] text-white font-semibold py-2 px-4 rounded transition`}
              >
                {isExporting ? (
                  <span className="flex items-center gap-2">
                    <i className="ri-loader-4-line animate-spin" />
                    Generando...
                  </span>
                ) : (
                  <>
                    <i className="ri-download-2-line" /> Descargar PNG
                  </>
                )}
              </button>

              <button
                className="btn-auto flex items-center gap-2"
                onClick={handleSaveChart}
                disabled={isExporting}
              >
                <i className="ri-save-line" />
                {isExporting ? 'Guardando...' : 'Guardar Chart'}
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 min-h-[600px]">
            <div className="w-full lg:w-72 shrink-0">
              <ChartSidebar
                customSize={customSize}
                setCustomSize={setCustomSize}
                advancedOptions={advancedOptions}
                setAdvancedOptions={setAdvancedOptions}
                chartType={chartType}
                setChartType={setChartType}
                dataSource={dataSource}
                setDataSource={setDataSource}
                totalSlots={totalSlots}
                albumsCount={albums.length}
                setAlbums={setAlbums}
              />
            </div>

            <div className="flex-1 min-h-full overflow-x-auto">
              <div
                ref={chartRef}
                className="inline-block p-4 rounded-lg"
                style={{ backgroundColor: advancedOptions.backgroundColor }}
              >
                <input
                  type="text"
                  value={chartTitle}
                  onChange={(e) => setChartTitle(e.target.value)}
                  placeholder="Mi Chart Musical"
                  className="text-center font-bold font-unbounded mb-6 w-full bg-transparent text-white text-xl md:text-2xl focus:outline-none"
                  style={{
                    fontFamily: advancedOptions.fontFamily,
                    color: advancedOptions.textColor,
                  }}
                />

                <ChartCanvas
                  albums={albums}
                  customSize={customSize}
                  chartType={chartType}
                  dataSource={dataSource}
                  advancedOptions={advancedOptions}
                  onEdit={() => {}}
                  onAddRequest={() => {}}
                  onRemoveAlbum={handleRemoveAlbum}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreateChart;
