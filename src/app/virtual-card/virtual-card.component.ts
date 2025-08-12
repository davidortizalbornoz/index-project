import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { getFormattedDate } from '../utils/date.utils';

@Component({
  selector: 'app-virtual-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    HttpClientModule
  ],
  templateUrl: './virtual-card.component.html',
  styleUrl: './virtual-card.component.css'
})
export class VirtualCardComponent implements OnInit {
  cardData: any = null;
  cardType: 'persona' | 'mascota' = 'persona';
  isLoading: boolean = true;
  error: string | null = null;

  // Propiedades para la imagen
  profileImageUrl: string | null = null;
  hasProfileImage: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.loadCardData();
  }

  /**
   * Carga los datos de la tarjeta desde el backend usando el nanoId
   */
  async loadCardData(): Promise<void> {
    try {
      // Extraer el nanoId de la URL
      const nanoId = this.route.snapshot.paramMap.get('nanoId');

      if (!nanoId) {
        this.error = 'NanoId no encontrado en la URL';
        this.isLoading = false;
        return;
      }

      console.log('Cargando datos para nanoId:', nanoId);

      // Hacer la llamada al backend
      const response = await this.http.get(`http://127.0.0.1:3000/${nanoId}`).toPromise();

      console.log('Respuesta del backend:', response);

      this.cardData = response;

      // Determinar el tipo de tarjeta
      this.cardType = this.determineCardType();

      // Procesar imagen si existe
      this.processProfileImage();

    } catch (error) {
      console.error('Error al cargar datos de la tarjeta:', error);
      this.error = 'Error al cargar los datos de la tarjeta';
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Procesa la imagen del perfil si existe en los datos
   */
  processProfileImage(): void {
    if (!this.cardData) return;

    // Buscar la imagen en response.image.imagePathS3
    const imagePathS3 = this.cardData?.image?.imagePathS3;

    if (imagePathS3) {
      console.log('Imagen encontrada en cardData.image.imagePathS3:', imagePathS3);
      this.profileImageUrl = imagePathS3;
      this.hasProfileImage = true;
    } else {
      console.log('No se encontró imagen en cardData.image.imagePathS3');
      this.hasProfileImage = false;
      this.profileImageUrl = null;
    }
  }

  /**
   * Maneja errores de carga de imagen
   */
  onImageError(event: any): void {
    console.error('Error al cargar la imagen del perfil:', event);
    this.hasProfileImage = false;
    this.profileImageUrl = null;
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

  getTipoRegistro(): string {
    return this.cardType === 'persona' ? 'PERSONA' : 'MASCOTA';
  }

  getColorTipo(): string {
    return this.cardType === 'persona' ? '#2c3e50' : '#3498db';
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
}
