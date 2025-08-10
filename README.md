# Sistema de Registro de Personas y Mascotas con QR

Sistema web desarrollado en Angular para el registro de personas y mascotas, con generación automática de códigos QR para identificación.

## 🚀 Características

### Funcionalidades Principales
- **Registro de Personas**: Formulario completo con validaciones
- **Registro de Mascotas**: Formulario específico para mascotas
- **Generación de QR**: Códigos QR únicos para cada registro
- **Tarjetas Virtuales**: Visualización de información en formato tarjeta
- **Validación de RUT**: Validación automática de RUT chileno
- **Carga de Imágenes**: Soporte para imágenes con compresión automática
- **Datos de Ejemplo**: Funcionalidad para cargar datos de prueba

### Tecnologías Utilizadas
- **Angular 20**: Framework principal
- **Angular Material**: Componentes de UI
- **TypeScript**: Lenguaje de programación
- **QRCode**: Generación de códigos QR
- **Reactive Forms**: Formularios reactivos con validaciones

## 📋 Requisitos Previos

- Node.js (versión 18 o superior)
- npm (incluido con Node.js)
- Angular CLI

## 🛠️ Instalación

1. **Clonar el repositorio**
   ```bash
   git clone [URL_DEL_REPOSITORIO]
   cd index-project
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar el proyecto**
   ```bash
   npm start
   ```

4. **Abrir en el navegador**
   ```
   http://localhost:4200
   ```

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── home/                    # Componente principal
│   ├── ingreso-persona/         # Formulario de registro de personas
│   ├── ingreso-mascota/         # Formulario de registro de mascotas
│   ├── virtual-card/            # Visualización de tarjetas virtuales
│   ├── services/
│   │   └── qr.service.ts        # Servicio para generación de QR
│   └── utils/
│       ├── date.utils.ts        # Utilidades para manejo de fechas
│       └── rut.utils.ts         # Utilidades para validación de RUT
├── styles.css                   # Estilos globales
└── main.ts                      # Punto de entrada
```

## 🎯 Funcionalidades Detalladas

### Registro de Personas
- Formulario con campos: nombre, apellido, email, teléfono, RUT
- Validación automática de RUT chileno
- Carga de imagen de perfil (máximo 5MB)
- Compresión automática de imágenes
- Datos de ejemplo disponibles

### Registro de Mascotas
- Formulario con campos: nombre, especie, raza, edad, peso, color
- Información del tutor/responsable
- Observaciones adicionales
- Carga de imagen de la mascota
- Validaciones completas

### Generación de QR
- Códigos QR únicos para cada registro
- Personalización de colores según tipo (persona/mascota)
- Descarga de códigos QR en formato PNG
- Integración con servicios externos

### Tarjetas Virtuales
- Visualización elegante de información registrada
- Diseño responsivo
- Información del tutor/responsable
- Fecha de registro con zona horaria de Santiago

## 🔧 Configuración

### Variables de Entorno
El proyecto está configurado para conectarse a un backend. Asegúrate de configurar las URLs correctas en los servicios.

### Zona Horaria
El sistema está configurado para mostrar fechas en la zona horaria de Santiago, Chile (UTC-3).

## 📱 Uso

1. **Página Principal**: Selecciona el tipo de registro (Persona o Mascota)
2. **Formulario de Registro**: Completa todos los campos requeridos
3. **Carga de Imagen**: Opcional, máximo 5MB
4. **Datos de Ejemplo**: Usa el botón "Cargar Datos de Ejemplo" para pruebas
5. **Registro**: Haz clic en "Registrar" para enviar los datos
6. **Tarjeta Virtual**: Visualiza la información registrada con su QR

## 🧪 Pruebas

### Datos de Ejemplo Disponibles
- **Personas**: 3 conjuntos de datos de ejemplo
- **Mascotas**: 3 conjuntos de datos de ejemplo
- **RUTs válidos**: Incluidos en los datos de ejemplo

### Validaciones Implementadas
- RUT chileno válido
- Email válido
- Teléfono válido
- Campos requeridos
- Tamaño de imagen (máximo 5MB)

## 🚀 Despliegue

### Build para Producción
```bash
npm run build
```

### Servidor de Producción
```bash
npm run start:prod
```

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 👥 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Para soporte técnico o preguntas sobre el proyecto, contacta al equipo de desarrollo.

---

**Desarrollado con ❤️ en Angular**
