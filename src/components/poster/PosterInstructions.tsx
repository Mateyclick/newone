
export function PosterInstructions() {
  return (
    <div className="max-w-4xl mx-auto mt-4 sm:mt-8 p-3 sm:p-4 bg-blue-50 rounded-lg text-sm">
      <h3 className="font-medium mb-2">Instrucciones de uso:</h3>
      <ol className="list-decimal pl-5 space-y-1">
        <li>Selecciona una plantilla de las opciones disponibles.</li>
        <li>Sube una imagen de fondo haciendo clic en "Subir Imagen".</li>
        <li>Para quitar el fondo, ingresa tu API key de remove.bg y haz clic en "Quitar Fondo".</li>
        <li>Agrega el texto del precio y ajusta su color y tamaño.</li>
        <li>Arrastra la imagen y el precio para posicionarlos como desees.</li>
        <li>Usa los botones de zoom para ajustar el tamaño de la imagen.</li>
        <li>Cuando estés satisfecho, haz clic en "Descargar Banner".</li>
      </ol>
    </div>
  );
}
