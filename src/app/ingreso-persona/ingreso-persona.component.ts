import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
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
  selector: 'app-ingreso-persona',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDividerModule,
    MatSnackBarModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule
  ],
  templateUrl: './ingreso-persona.component.html',
  styleUrl: './ingreso-persona.component.css'
})
export class IngresoPersonaComponent {
  title = 'Registro de Persona';

  personaForm: FormGroup;
  selectedImage: File | null = null;
  imagePreview: string | null = null;

  isLoading = false;

  // Datos de ejemplo para el formulario
  private sampleDataSets = [
    {
      nombre: 'María',
      apellido: 'González',
      email: 'maria.gonzalez@email.com',
      telefono: '+56 9 1234 5678',
      tutorNombre: 'Carlos González',
      tutorRut: '12.345.678-5',
      tutorTelefono: '+56 9 8765 4321',
      tutorDireccion: 'Av. Providencia 1234, Santiago'
    },
    {
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'juan.perez@email.com',
      telefono: '+56 9 2345 6789',
      tutorNombre: 'Ana Pérez',
      tutorRut: '20.686.957-7',
      tutorTelefono: '+56 9 7654 3210',
      tutorDireccion: 'Calle Las Condes 567, Las Condes'
    },
    {
      nombre: 'Sofía',
      apellido: 'Rodríguez',
      email: 'sofia.rodriguez@email.com',
      telefono: '+56 9 3456 7890',
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
    this.personaForm = new FormGroup({
      nombre: new FormControl('', [Validators.required, Validators.minLength(2)]),
      apellido: new FormControl('', [Validators.required, Validators.minLength(2)]),
      email: new FormControl('', [Validators.email]),
      telefono: new FormControl(''),
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
    this.personaForm.patchValue(sampleData);

    // Marcar los campos como válidos para que no muestren errores
    Object.keys(this.personaForm.controls).forEach(key => {
      const control = this.personaForm.get(key);
      if (control) {
        control.markAsTouched();
        control.markAsDirty();
      }
    });

    // Verificar el estado del formulario después de cargar datos
    console.log('[IngresoPersonaComponent] Estado del formulario después de cargar datos de ejemplo:');
    console.log('Formulario válido:', this.personaForm.valid);
    console.log('Formulario inválido:', this.personaForm.invalid);
    console.log('Datos cargados:', sampleData);

    this.mostrarMensaje('Datos de ejemplo cargados', 'success');
  }

  async registrarPersona() {
    this.debugFormState(); // For debugging
    if (this.personaForm.invalid) {
      this.mostrarMensaje('Por favor, complete todos los campos requeridos (Nombre, Apellido, Tutor y RUT)', 'error');
      this.marcarCamposInvalidos();
      return;
    }
    this.isLoading = true;

    let base64Image: string | null = null;

    try {
      let requestData: any;

      if (this.selectedImage) {
        // Si hay imagen, convertir a base64 y enviar como JSON
        console.log('[IngresoPersonaComponent] Preparando envío con imagen en base64...');

        // Convertir imagen a base64 (solo una vez)
        base64Image = await this.convertImageToBase64(this.selectedImage);

        requestData = {
          vcardType: 'persona',
          imageBase64: base64Image,
          imageName: this.selectedImage.name,
          imageType: this.selectedImage.type,
          data: this.personaForm.value
        };
      } else {
        // Si no hay imagen, enviar solo datos
        console.log('[IngresoPersonaComponent] Preparando envío sin imagen...');

        requestData = {
          vcardType: 'persona',
          data: this.personaForm.value
        };
      }

      console.log('[IngresoPersonaComponent] Enviando datos al backend:', {
        hasImage: !!this.selectedImage,
        imageName: this.selectedImage?.name,
        formData: this.personaForm.value
      });

      // Enviar JSON al backend
      const response: any = await this.http.post('http://127.0.0.1:3000/register', requestData, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }),
        observe: 'response'
      }).toPromise();

      // Verificar si la respuesta es exitosa (status 200 o 201)
      if (response && (response.status === 200 || response.status === 201)) {
        console.log('[IngresoPersonaComponent] Persona registrada exitosamente en backend:', {
          status: response.status,
          responseBody: response.body,
          sentData: this.personaForm.value,
          hasImage: !!this.selectedImage
        });

        this.mostrarMensaje('Persona registrada exitosamente', 'success');

        // Preparar cardData con la imagen base64 si existe
        let cardData = response.body || this.personaForm.value;

        // Si hay imagen seleccionada, agregar la imagen base64 al objeto response
        if (this.selectedImage && base64Image) {
          // Asegurar que existe el objeto image en cardData
          if (!cardData.image) {
            cardData.image = {};
          }

          // Agregar la imagen base64 al objeto image (mantener estructura original)
          cardData.image.imageBase64 = base64Image;

          console.log('[IngresoPersonaComponent] Imagen base64 agregada a cardData:', {
            hasImage: true,
            imageLength: base64Image.length
          });
        }

        console.log('Navegando a register-card con datos:', cardData);
        this.router.navigate(['/register-card'], {
          state: {
            cardData: cardData,
            cardType: 'persona'
          }
        });
      } else {
        console.log('[IngresoPersonaComponent] Respuesta del backend inesperada:', {
          status: response?.status,
          responseBody: response?.body,
          sentData: this.personaForm.value
        });
        // Aún así, considerar como exitoso si tenemos respuesta
        this.mostrarMensaje('Persona registrada exitosamente', 'success');

        let cardData = response?.body || this.personaForm.value;

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
            cardType: 'persona'
          }
        });
      }
    } catch (error) {
      console.error('Error al registrar persona:', error);

      if (error instanceof HttpErrorResponse) {
        if (error.status === 0) {
          this.mostrarMensaje('Error de conexión: No se puede conectar al servidor. Verifique que el servidor esté ejecutándose.', 'error');
        } else if (error.status === 403) {
          this.mostrarMensaje('Error de CORS: El servidor no permite peticiones desde este origen.', 'error');
        } else if (error.status === 200 || error.status === 201) {
          // Si el error es 200 o 201, significa que fue exitoso
          this.mostrarMensaje('Persona registrada exitosamente', 'success');

          let cardData = this.personaForm.value;

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
              cardType: 'persona'
            }
          });
        } else {
          console.error('[IngresoPersonaComponent] Error HTTP:', error);
          this.mostrarMensaje(`Error del servidor: ${error.status} - ${error.message}`, 'error');
        }
      } else {
        this.mostrarMensaje('Error al registrar persona. Intente nuevamente.', 'error');
      }
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Convierte una imagen a base64
   */
  private convertImageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        console.log('[IngresoPersonaComponent] Imagen convertida a base64:', {
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

  private marcarCamposInvalidos() {
    Object.keys(this.personaForm.controls).forEach(key => {
      const control = this.personaForm.get(key);
      if (control?.invalid) {
        control.markAsTouched();
        control.markAsDirty();
      }
    });
  }

  private limpiarFormulario() {
    this.personaForm.reset();
  }

  /**
   * Valida un RUT chileno manualmente para pruebas
   */
  private validateRutManual(rut: string): boolean {
    if (!rut) return false;

    const cleanRut = rut.toString().replace(/\./g, '').replace(/-/g, '');
    if (!/^\d{7,8}[0-9kK]$/.test(cleanRut)) return false;

    const numero = cleanRut.slice(0, -1);
    const dv = cleanRut.slice(-1).toUpperCase();

    let suma = 0;
    let multiplicador = 2;

    for (let i = numero.length - 1; i >= 0; i--) {
      suma += parseInt(numero[i]) * multiplicador;
      multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }

    const dvCalculado = 11 - (suma % 11);
    let dvEsperado = '';

    if (dvCalculado === 11) {
      dvEsperado = '0';
    } else if (dvCalculado === 10) {
      dvEsperado = 'K';
    } else {
      dvEsperado = dvCalculado.toString();
    }

    return dv === dvEsperado;
  }

  /**
   * Depura el estado del formulario para identificar campos inválidos
   */
  private debugFormState() {
    console.log('[IngresoPersonaComponent] Estado del formulario:');
    console.log('Formulario válido:', this.personaForm.valid);
    console.log('Formulario inválido:', this.personaForm.invalid);
    console.log('Valores del formulario:', this.personaForm.value);

    Object.keys(this.personaForm.controls).forEach(key => {
      const control = this.personaForm.get(key);
      if (control) {
        console.log(`Campo ${key}:`, {
          valor: control.value,
          válido: control.valid,
          inválido: control.invalid,
          touched: control.touched,
          dirty: control.dirty,
          errores: control.errors
        });
      }
    });

    // Probar validación de RUTs de ejemplo
    console.log('[IngresoPersonaComponent] Probando validación de RUTs:');
    const testRuts = ['12.345.678-5', '20.686.957-7', '15.123.456-9'];
    testRuts.forEach(rut => {
      const control = new FormControl(rut, [Validators.required, validateRut]);
      console.log(`RUT ${rut}:`, {
        válido: control.valid,
        inválido: control.invalid,
        errores: control.errors
      });
    });

    // Verificar si el RUT actual del formulario es válido
    const currentRut = this.personaForm.get('tutorRut')?.value;
    if (currentRut) {
      console.log('[IngresoPersonaComponent] RUT actual del formulario:', currentRut);
      const rutControl = new FormControl(currentRut, [Validators.required, validateRut]);
      const manualValidation = this.validateRutManual(currentRut);
      console.log('Validación del RUT actual:', {
        válido: rutControl.valid,
        inválido: rutControl.invalid,
        errores: rutControl.errors,
        validaciónManual: manualValidation
      });
    }
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
        console.error('[IngresoPersonaComponent] Error al procesar imagen:', error);
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

    console.log('[IngresoPersonaComponent] Validando archivo:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      allowedTypes: allowedTypes,
      maxFileSize: maxFileSize
    });

    // Validar tipo de archivo
    if (!allowedTypes.includes(file.type)) {
      console.warn('[IngresoPersonaComponent] Tipo de archivo no permitido:', file.type);
      return {
        isValid: false,
        error: `Tipo de archivo no permitido. Tipos permitidos: ${allowedTypes.join(', ')}`
      };
    }

    // Validar tamaño
    if (file.size > maxFileSize) {
      const maxSizeMB = maxFileSize / (1024 * 1024);
      console.warn('[IngresoPersonaComponent] Archivo excede tamaño máximo:', {
        fileSize: file.size,
        maxSize: maxFileSize,
        maxSizeMB: maxSizeMB
      });
      return {
        isValid: false,
        error: `El archivo excede el tamaño máximo permitido (${maxSizeMB}MB). Se intentará comprimir automáticamente.`
      };
    }

    console.log('[IngresoPersonaComponent] Archivo validado exitosamente');
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

            console.log('[IngresoPersonaComponent] Imagen comprimida:', {
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
      console.log('[IngresoPersonaComponent] Archivo dentro del límite de tamaño:', file.size, 'bytes');
      return file;
    }

    console.log('[IngresoPersonaComponent] Archivo excede límite, comprimiendo...', file.size, 'bytes');
    return await this.compressImage(file, 5);
  }

  // Getters para facilitar el acceso en el template
  get nombre() { return this.personaForm.get('nombre'); }
  get apellido() { return this.personaForm.get('apellido'); }
  get email() { return this.personaForm.get('email'); }
  get telefono() { return this.personaForm.get('telefono'); }
  get tutorNombre() { return this.personaForm.get('tutorNombre'); }
  get tutorRut() { return this.personaForm.get('tutorRut'); }
  get tutorTelefono() { return this.personaForm.get('tutorTelefono'); }
  get tutorDireccion() { return this.personaForm.get('tutorDireccion'); }
}
