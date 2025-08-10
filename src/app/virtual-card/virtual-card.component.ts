import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { getFormattedDate } from '../utils/date.utils';
import { QRService } from '../services/qr.service';

@Component({
  selector: 'app-virtual-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule
  ],
  templateUrl: './virtual-card.component.html',
  styleUrl: './virtual-card.component.css'
})
export class VirtualCardComponent implements OnInit {
  @Input() cardData: any;
  @Input() cardType: 'persona' | 'mascota' = 'persona';
  qrCodeUrl: string = '';
  isLoadingQR: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private qrService: QRService
  ) {}

  ngOnInit() {
    // Obtener datos del estado de navegación usando ActivatedRoute
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.cardData = navigation.extras.state['cardData'];
      this.cardType = navigation.extras.state['cardType'];
    } else {
      // Si no hay navegación activa, intentar obtener del historial
      const state = history.state;
      if (state && state.cardData) {
        this.cardData = state.cardData;
        this.cardType = state.cardType;
      }
    }

    console.log('VirtualCardComponent - cardData recibido:', this.cardData);
    console.log('VirtualCardComponent - cardType recibido:', this.cardType);
    this.debugDataStructure();

    // Determinar el tipo de tarjeta desde los datos
    if (this.cardData) {
      this.cardType = this.determineCardType();
    }

    // Si no hay datos, redirigir al home
    if (!this.cardData) {
      console.log('No se encontraron datos para la tarjeta virtual, redirigiendo al home');
      this.router.navigate(['/']);
    } else {
      console.log('Datos de la tarjeta virtual:', this.cardData, 'Tipo:', this.cardType);
      // Generar QR si existe el campo qrCode
      this.generateQRCode();
    }
  }

  /**
   * Método para debuggear la estructura de datos
   */
  debugDataStructure(): void {
    if (!this.cardData) {
      console.log('debugDataStructure: No hay cardData');
      return;
    }

    const formData = this.getFormData();
  }

  async generateQRCode(): Promise<void> {

    if (!this.cardData?.qrContent) {
      console.log('No hay contenido QR para generar');
      return;
    }

    this.isLoadingQR = true;
    try {
      console.log('Generando QR con contenido:', this.cardData.qrContent);
      this.qrCodeUrl = await this.qrService.generateQR(this.cardData.qrContent, {
        width: 200,
        color: {
          dark: this.getColorTipo(),
          light: '#ffffff'
        },
        margin: 2,
        errorCorrectionLevel: 'H'
      });
    } catch (error) {
      console.error('Error generando QR:', error);
    } finally {
      this.isLoadingQR = false;
    }
  }

  downloadQR(): void {
    if (!this.qrCodeUrl) {
      console.log('No hay QR para descargar');
      return;
    }

    const filename = `qr-${this.cardData?.id || 'card'}.png`;
    this.qrService.downloadQR(this.qrCodeUrl, filename);
  }

  volverAlHome() {
    this.router.navigate(['/']);
  }

  getTipoRegistro(): string {
    return this.cardType === 'persona' ? 'PERSONA' : 'MASCOTA';
  }

  getColorTipo(): string {
    return this.cardType === 'persona' ? '#2c3e50' : '#3498db';
  }

  getAvailableFields(): string {
    if (!this.cardData) return 'No hay datos';

    // Mostrar todos los campos disponibles para debugging
    const allFields = [];

    if (this.cardData.id) {
      allFields.push('id: ' + this.cardData.id);
    }

    if (this.cardData.nanoId) {
      allFields.push('nanoId: ' + this.cardData.nanoId);
    }

    if (this.cardData.qrContent) {
      allFields.push('qrContent: ' + this.cardData.qrContent);
    }

    if (this.cardData.vcardType) {
      allFields.push('vcardType: ' + this.cardData.vcardType);
    }

    if (this.cardData.data) {
      allFields.push('data: ' + Object.keys(this.cardData.data).join(', '));
    }

    if (this.cardData.image) {
      allFields.push('image: ' + Object.keys(this.cardData.image).join(', '));
    }

    if (this.cardData.created_at) {
      allFields.push('created_at: ' + this.cardData.created_at);
    }

    return allFields.join(' | ');
  }

  /**
   * Obtiene todos los datos del formulario de manera segura
   */
  getFormData(): any {
    if (!this.cardData) return null;

    // Los datos están en cardData.data
    if (this.cardData.data) {
      return this.cardData.data;
    }

    // Si no, usar cardData directamente
    return this.cardData;
  }

  /**
   * Verifica si existe un campo específico en los datos
   */
  hasField(fieldName: string): boolean {
    const formData = this.getFormData();
    return formData && formData[fieldName] !== null && formData[fieldName] !== undefined;
  }

  /**
   * Obtiene el valor de un campo específico
   */
  getFieldValue(fieldName: string): any {
    const formData = this.getFormData();
    return formData ? formData[fieldName] : null;
  }

  getFormattedDate(): string {
    // created_at está en el nivel raíz (UTC desde la base de datos)
    const created_at = this.cardData?.created_at;

    // Usar la función que convierte UTC a Santiago
    const formattedDate = getFormattedDate(created_at);

    return formattedDate;
  }

  /**
   * Determina el tipo de tarjeta basado en los datos
   */
  determineCardType(): 'persona' | 'mascota' {
    // vcardType está en el nivel raíz
    const vcardType = this.cardData?.vcardType;

    if (vcardType === 'persona') {
      return 'persona';
    } else if (vcardType === 'mascota') {
      return 'mascota';
    }

    // Si no se puede determinar, usar el valor por defecto
    return 'persona';
  }
}
