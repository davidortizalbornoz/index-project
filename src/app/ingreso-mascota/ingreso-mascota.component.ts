import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { validateRut } from '../utils/rut.utils';

@Component({
  selector: 'app-ingreso-mascota',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDividerModule,
    MatSnackBarModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule
  ],
  templateUrl: './ingreso-mascota.component.html',
  styleUrl: './ingreso-mascota.component.css'
})
export class IngresoMascotaComponent {
  title = 'Registro de Mascota';

  mascotaForm: FormGroup;
  selectedImage: File | null = null;
  imagePreview: string | null = null;

  especies = [
    { value: 'perro', viewValue: 'Perro' },
    { value: 'gato', viewValue: 'Gato' },
    { value: 'ave', viewValue: 'Ave' },
    { value: 'otro', viewValue: 'Otro' }
  ];

  isLoading = false;

  // Datos de ejemplo para el formulario
  private sampleDataSets = [
    {
      nombre: 'Max',
      especie: 'perro',
      raza: 'Golden Retriever',
      edad: 3,
      peso: 25.5,
      color: 'Dorado',
      observaciones: 'Muy amigable y juguetón. Le encanta jugar con pelotas.',
      tutorNombre: 'Carlos González',
      tutorRut: '12.345.678-5',
      tutorTelefono: '+56 9 8765 4321',
      tutorDireccion: 'Av. Providencia 1234, Santiago'
    },
    {
      nombre: 'Luna',
      especie: 'gato',
      raza: 'Siamés',
      edad: 2,
      peso: 4.2,
      color: 'Crema con puntos negros',
      observaciones: 'Gata tranquila y cariñosa. Le gusta dormir en lugares altos.',
      tutorNombre: 'Ana Pérez',
      tutorRut: '20.686.957-7',
      tutorTelefono: '+56 9 7654 3210',
      tutorDireccion: 'Calle Las Condes 567, Las Condes'
    },
    {
      nombre: 'Rocky',
      especie: 'perro',
      raza: 'Pastor Alemán',
      edad: 5,
      peso: 35.0,
      color: 'Negro y marrón',
      observaciones: 'Perro guardián muy leal. Excelente con niños.',
      tutorNombre: 'Miguel Rodríguez',
      tutorRut: '15.123.456-9',
      tutorTelefono: '+56 9 6543 2109',
      tutorDireccion: 'Av. Apoquindo 890, Las Condes'
    }
  ];

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.mascotaForm = new FormGroup({
      nombre: new FormControl('', [Validators.required, Validators.minLength(2)]),
      especie: new FormControl('', [Validators.required]),
      raza: new FormControl('', [Validators.required, Validators.minLength(2)]),
      edad: new FormControl(null),
      peso: new FormControl(null),
      color: new FormControl(''),
      observaciones: new FormControl(''),
      // Campos del tutor/responsable
      tutorNombre: new FormControl('', [Validators.required, Validators.minLength(2)]),
      tutorRut: new FormControl('', [Validators.required, validateRut]),
      tutorTelefono: new FormControl('', [Validators.required]),
      tutorDireccion: new FormControl('', [Validators.required, Validators.minLength(10)])
    });
  }

  /**
   * Carga datos de ejemplo en el formulario
   */
  cargarDatosEjemplo() {
    // Seleccionar un conjunto de datos aleatorio
    const randomIndex = Math.floor(Math.random() * this.sampleDataSets.length);
    const sampleData = this.sampleDataSets[randomIndex];

    // Limpiar imagen previa si existe
    this.removeImage();

    // Cargar los datos en el formulario
    this.mascotaForm.patchValue(sampleData);

    // Marcar los campos como válidos para que no muestren errores
    Object.keys(this.mascotaForm.controls).forEach(key => {
      const control = this.mascotaForm.get(key);
      if (control) {
        control.markAsTouched();
        control.markAsDirty();
      }
    });

    this.mostrarMensaje('Datos de ejemplo cargados', 'success');
  }

  async registrarMascota() {
    if (this.mascotaForm.invalid) {
      this.mostrarMensaje('Por favor, complete todos los campos requeridos (Nombre, Especie, Raza, Tutor y RUT)', 'error');
      this.marcarCamposInvalidos();
      return;
    }
    this.isLoading = true;

    let base64Image: string | null = null;

    try {
      let requestData: any;

      if (this.selectedImage) {
        // Si hay imagen, convertir a base64 y enviar como JSON
        console.log('[IngresoMascotaComponent] Preparando envío con imagen en base64...');

        // Convertir imagen a base64 (solo una vez)
        base64Image = await this.convertImageToBase64(this.selectedImage);

        requestData = {
          vcardType: 'mascota',
          imageBase64: base64Image,
          imageName: this.selectedImage.name,
          imageType: this.selectedImage.type,
          data: this.mascotaForm.value
        };
      } else {
        // Si no hay imagen, enviar solo datos
        console.log('[IngresoMascotaComponent] Preparando envío sin imagen...');

        requestData = {
          vcardType: 'mascota',
          data: this.mascotaForm.value
        };
      }

      console.log('[IngresoMascotaComponent] Enviando datos al backend:', {
        hasImage: !!this.selectedImage,
        imageName: this.selectedImage?.name,
        formData: this.mascotaForm.value
      });

      // Enviar JSON al backend
      const response: any = await this.http.post('http://127.0.0.1:3000/register', requestData, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }),
        observe: 'response'
      }).toPromise();

      // Verificar si la respuesta es exitosa (status 201)
      if (response && response.status === 201) {
        console.log('[IngresoMascotaComponent] Mascota registrada exitosamente en backend:', {
          status: response.status,
          responseBody: response.body,
          sentData: this.mascotaForm.value,
          hasImage: !!this.selectedImage
        });

        this.mostrarMensaje('Mascota registrada exitosamente', 'success');

        // Preparar cardData con la imagen base64 si existe
        let cardData = response.body || this.mascotaForm.value;

        // Si hay imagen seleccionada, agregar la imagen base64 al objeto response
        if (this.selectedImage && base64Image) {
          // Asegurar que existe el objeto image en cardData
          if (!cardData.image) {
            cardData.image = {};
          }

          // Agregar la imagen base64 al objeto image (mantener estructura original)
          cardData.image.imageBase64 = base64Image;

          console.log('[IngresoMascotaComponent] Imagen base64 agregada a cardData:', {
            hasImage: true,
            imageLength: base64Image.length
          });
        }

        console.log('Navegando a register-card con datos:', cardData);
        this.router.navigate(['/register-card'], {
          state: {
            cardData: cardData,
            cardType: 'mascota'
          }
        });
      } else {
        console.log('[IngresoMascotaComponent] Respuesta del backend (no 201):', {
          status: response?.status,
          responseBody: response?.body,
          sentData: this.mascotaForm.value
        });
        this.mostrarMensaje('Mascota registrada exitosamente', 'success');

        let cardData = response?.body || this.mascotaForm.value;

        // Si hay imagen seleccionada, agregar la imagen base64 al objeto response
        if (this.selectedImage && base64Image) {
          // Asegurar que existe el objeto image en cardData
          if (!cardData.image) {
            cardData.image = {};
          }

          // Agregar la imagen base64 al objeto image (mantener estructura original)
          cardData.image.imageBase64 = base64Image;
        }

        this.router.navigate(['/register-card'], {
          state: {
            cardData: cardData,
            cardType: 'mascota'
          }
        });
      }
    } catch (error) {
      console.error('Error al registrar mascota:', error);

      if (error instanceof HttpErrorResponse) {
        if (error.status === 0) {
          this.mostrarMensaje('Error de conexión: No se puede conectar al servidor. Verifique que el servidor esté ejecutándose.', 'error');
        } else if (error.status === 403) {
          this.mostrarMensaje('Error de CORS: El servidor no permite peticiones desde este origen.', 'error');
        } else if (error.status === 201) {
          // Si el error es 201, significa que fue exitoso
          this.mostrarMensaje('Mascota registrada exitosamente', 'success');

          let cardData = this.mascotaForm.value;

          // Si hay imagen seleccionada, agregar la imagen base64
          if (this.selectedImage && base64Image) {
            // Asegurar que existe el objeto image en cardData
            if (!cardData.image) {
              cardData.image = {};
            }

            // Agregar la imagen base64 al objeto image
            cardData.image.imageBase64 = base64Image;
          }

          console.log('Navegando a register-card desde catch con datos:', cardData);
          this.router.navigate(['/register-card'], {
            state: {
              cardData: cardData,
              cardType: 'mascota'
            }
          });
        } else {
          this.mostrarMensaje(`Error del servidor: ${error.status} - ${error.message}`, 'error');
        }
      } else {
        this.mostrarMensaje('Error al registrar mascota. Intente nuevamente.', 'error');
      }
    } finally {
      this.isLoading = false;
    }
  }

  private marcarCamposInvalidos() {
    Object.keys(this.mascotaForm.controls).forEach(key => {
      const control = this.mascotaForm.get(key);
      if (control?.invalid) {
        control.markAsTouched();
      }
    });
  }

  private limpiarFormulario() {
    this.mascotaForm.reset();
  }

  private mostrarMensaje(mensaje: string, tipo: 'success' | 'error') {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: tipo === 'success' ? ['success-snackbar'] : ['error-snackbar']
    });
  }

    // Métodos para manejo de imagen
  async onImageSelected(event: any): Promise<void> {
    const file = event.target.files[0];
    if (file) {
      // Validar archivo
      const validation = this.validateFile(file);
      if (!validation.isValid) {
        this.mostrarMensaje(validation.error || 'Error al validar el archivo', 'error');
        return;
      }

      try {
        // Comprimir imagen si es necesario
        const compressedFile = await this.validateAndCompressImage(file);
        this.selectedImage = compressedFile;

        // Crear preview
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagePreview = e.target.result;
        };
        reader.readAsDataURL(compressedFile);

        this.mostrarMensaje('Imagen cargada y optimizada exitosamente', 'success');
      } catch (error) {
        console.error('[IngresoMascotaComponent] Error al procesar imagen:', error);
        this.mostrarMensaje('Error al procesar la imagen. Intente con otra imagen.', 'error');
      }
    }
  }

  removeImage(): void {
    this.selectedImage = null;
    this.imagePreview = null;
  }

  /**
   * Valida el archivo según la configuración
   */
  private validateFile(file: File): { isValid: boolean; error?: string } {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    const maxFileSize = 5 * 1024 * 1024; // 5MB (antes de compresión)

    console.log('[IngresoMascotaComponent] Validando archivo:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      allowedTypes: allowedTypes,
      maxFileSize: maxFileSize
    });

    // Validar tipo de archivo
    if (!allowedTypes.includes(file.type)) {
      console.warn('[IngresoMascotaComponent] Tipo de archivo no permitido:', file.type);
      return {
        isValid: false,
        error: `Tipo de archivo no permitido. Tipos permitidos: ${allowedTypes.join(', ')}`
      };
    }

    // Validar tamaño
    if (file.size > maxFileSize) {
      const maxSizeMB = maxFileSize / (1024 * 1024);
      console.warn('[IngresoMascotaComponent] Archivo excede tamaño máximo:', {
        fileSize: file.size,
        maxSize: maxFileSize,
        maxSizeMB: maxSizeMB
      });
      return {
        isValid: false,
        error: `El archivo excede el tamaño máximo permitido (${maxSizeMB}MB). Se intentará comprimir automáticamente.`
      };
    }

    console.log('[IngresoMascotaComponent] Archivo validado exitosamente');
    return { isValid: true };
  }

  /**
   * Comprime una imagen para reducir su tamaño
   */
  private async compressImage(file: File, maxSizeMB: number = 5): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calcular nuevas dimensiones manteniendo aspect ratio
        const maxWidth = 800;
        const maxHeight = 600;
        let { width, height } = img;

        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Dibujar imagen redimensionada
        ctx?.drawImage(img, 0, 0, width, height);

        // Convertir a blob con compresión
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            });

            console.log('[IngresoMascotaComponent] Imagen comprimida:', {
              originalSize: file.size,
              compressedSize: compressedFile.size,
              originalName: file.name,
              dimensions: `${width}x${height}`
            });

            resolve(compressedFile);
          } else {
            reject(new Error('Error al comprimir imagen'));
          }
        }, 'image/jpeg', 0.7); // Calidad 70%
      };

      img.onerror = () => reject(new Error('Error al cargar imagen'));
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Valida el tamaño del archivo y lo comprime si es necesario
   */
  private async validateAndCompressImage(file: File): Promise<File> {
    const maxSizeBytes = 5 * 1024 * 1024; // 5MB

    if (file.size <= maxSizeBytes) {
      console.log('[IngresoMascotaComponent] Archivo dentro del límite de tamaño:', file.size, 'bytes');
      return file;
    }

    console.log('[IngresoMascotaComponent] Archivo excede límite, comprimiendo...', file.size, 'bytes');
    return await this.compressImage(file, 5);
  }

  /**
   * Convierte una imagen a base64
   */
  private convertImageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        console.log('[IngresoMascotaComponent] Imagen convertida a base64:', {
          originalSize: file.size,
          base64Length: result.length,
          imageName: file.name,
          imageType: file.type
        });
        resolve(result);
      };
      reader.onerror = () => reject(new Error('Error al convertir imagen a base64'));
      reader.readAsDataURL(file);
    });
  }

  // Getters para facilitar el acceso en el template
  get nombre() { return this.mascotaForm.get('nombre'); }
  get especie() { return this.mascotaForm.get('especie'); }
  get raza() { return this.mascotaForm.get('raza'); }
  get edad() { return this.mascotaForm.get('edad'); }
  get peso() { return this.mascotaForm.get('peso'); }
  get color() { return this.mascotaForm.get('color'); }
  get observaciones() { return this.mascotaForm.get('observaciones'); }
  get tutorNombre() { return this.mascotaForm.get('tutorNombre'); }
  get tutorRut() { return this.mascotaForm.get('tutorRut'); }
  get tutorTelefono() { return this.mascotaForm.get('tutorTelefono'); }
  get tutorDireccion() { return this.mascotaForm.get('tutorDireccion'); }
}
