import { Injectable } from '@angular/core';
import QRCode from 'qrcode';

@Injectable({
  providedIn: 'root'
})
export class QRService {

  /**
   * Genera un código QR como Data URL (base64)
   * @param text - Texto o URL para generar el QR
   * @param options - Opciones de personalización
   * @returns Promise con el Data URL del QR
   */
  async generateQR(text: string, options: any = {}): Promise<string> {
    const defaultOptions = {
      width: 256,
      margin: 2,
      color: {
        dark: '#2c3e50',
        light: '#ecf0f1'
      },
      errorCorrectionLevel: 'H'
    };

    const finalOptions = { ...defaultOptions, ...options };

    try {
      return new Promise((resolve, reject) => {
        QRCode.toDataURL(text, finalOptions, (err, url) => {
          if (err) {
            reject(err);
          } else {
            resolve(url);
          }
        });
      });
    } catch (error) {
      console.error('Error generando QR:', error);
      throw error;
    }
  }

  /**
   * Descarga el QR como archivo PNG
   * @param qrDataUrl - Data URL del QR
   * @param filename - Nombre del archivo
   */
  downloadQR(qrDataUrl: string, filename: string = 'qr-code.png'): void {
    try {
      const link = document.createElement('a');
      link.href = qrDataUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error descargando QR:', error);
    }
  }
}
