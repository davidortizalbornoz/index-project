import { AbstractControl, ValidationErrors } from '@angular/forms';

/**
 * Función de validación personalizada para RUT chileno
 * @param control - El control del formulario a validar
 * @returns ValidationErrors | null - Error de validación o null si es válido
 */
export function validateRut(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null; // Permitir que Validators.required maneje el caso vacío
  }

  const rut = control.value.toString().replace(/\./g, '').replace(/-/g, '');

  // Verificar formato básico
  if (!/^\d{7,8}[0-9kK]$/.test(rut)) {
    return { invalidFormat: true };
  }

  // Extraer número y dígito verificador
  const numero = rut.slice(0, -1);
  const dv = rut.slice(-1).toUpperCase();

  // Calcular dígito verificador
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

  return dv === dvEsperado ? null : { invalidRut: true };
}
