/**
 * Utilidades para el manejo de fechas
 */

/**
 * Formatea una fecha UTC a la zona horaria de Santiago, Chile
 * @param dateString - Fecha UTC desde el backend (formato: YYYY-MM-DDTHH:MM:SS.SSSZ)
 * @returns Fecha formateada en formato DD-MM-YYYY, HH:MM:SS (24 horas) en zona horaria de Santiago
 */
export function getFormattedDate(dateString: string): string {
  if (!dateString) return 'N/A';

  try {
    // La fecha viene en formato ISO UTC: "2025-08-10T01:59:43.800Z"
    // Necesitamos convertir de UTC a zona horaria de Santiago (UTC-3)

    // Crear fecha UTC directamente desde el string ISO
    const utcDate = new Date(dateString);

    // Verificar si la fecha es válida
    if (isNaN(utcDate.getTime())) {
      return 'N/A';
    }

    // Usar toLocaleString con timezone específico para Santiago
    // Esto evita problemas de doble conversión
    const formattedDate = utcDate.toLocaleString('es-CL', {
      timeZone: 'America/Santiago',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });

    return formattedDate;
  } catch (error) {
    // Fallback: usar conversión manual si toLocaleString falla
    try {
      const utcDate = new Date(dateString);

      // Convertir UTC a Santiago manualmente
      const utcTimestamp = utcDate.getTime();
      const santiagoOffset = -3 * 60 * 60 * 1000; // UTC-3 en milisegundos
      const santiagoTimestamp = utcTimestamp + santiagoOffset;
      const santiagoDate = new Date(santiagoTimestamp);

      // Formatear manualmente
      const day = santiagoDate.getUTCDate().toString().padStart(2, '0');
      const month = (santiagoDate.getUTCMonth() + 1).toString().padStart(2, '0');
      const year = santiagoDate.getUTCFullYear();
      const hours = santiagoDate.getUTCHours().toString().padStart(2, '0');
      const minutes = santiagoDate.getUTCMinutes().toString().padStart(2, '0');
      const seconds = santiagoDate.getUTCSeconds().toString().padStart(2, '0');

      const fallbackDate = `${day}-${month}-${year}, ${hours}:${minutes}:${seconds}`;

      return fallbackDate;
    } catch (fallbackError) {
      return 'N/A';
    }
  }
}


