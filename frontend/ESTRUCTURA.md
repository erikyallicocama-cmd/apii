# Estructura del Proyecto AI Assistant

## 📁 Estructura de Carpetas

```
src/
├── components/           # Componentes React organizados por categoría
│   ├── ui/              # Componentes de interfaz reutilizables
│   │   ├── Button.tsx   # Componente de botón
│   │   ├── Card.tsx     # Componentes de tarjeta
│   │   ├── Input.tsx    # Componentes de entrada de texto
│   │   ├── Loading.tsx  # Componentes de carga
│   │   └── index.ts     # Exportaciones de UI
│   ├── layout/          # Componentes de diseño
│   │   ├── Layout.tsx   # Layout principal de la aplicación
│   │   └── index.ts     # Exportaciones de layout
│   ├── features/        # Componentes de funcionalidades específicas
│   │   ├── Home.tsx     # Página principal con selección de servicios
│   │   ├── AiChat.tsx   # Interfaz de chat con IA
│   │   ├── ImageGenerator.tsx # Generador de imágenes
│   │   └── index.ts     # Exportaciones de features
│   └── index.ts         # Exportaciones principales de componentes
├── services/            # Servicios para comunicación con APIs
│   ├── apiClient.ts     # Cliente HTTP base para todas las APIs
│   ├── aiService.ts     # Servicio específico para endpoints de IA
│   ├── imageService.ts  # Servicio específico para endpoints de imágenes
│   └── index.ts         # Exportaciones de servicios
├── hooks/               # Hooks personalizados de React
│   ├── useAsync.ts      # Hook para manejo de estados asíncronos
│   ├── useAi.ts         # Hook específico para operaciones de IA
│   ├── useImage.ts      # Hook específico para operaciones de imágenes
│   └── index.ts         # Exportaciones de hooks
├── types/               # Definiciones de tipos TypeScript
│   ├── api.ts          # Tipos para APIs (request/response DTOs)
│   └── index.ts        # Exportaciones de tipos
├── utils/               # Funciones utilitarias
│   ├── helpers.ts      # Funciones helper (formateo, validación, etc.)
│   └── index.ts        # Exportaciones de utilidades
├── constants/           # Constantes de la aplicación
│   ├── config.ts       # Configuración de la aplicación y endpoints
│   └── index.ts        # Exportaciones de constantes
├── assets/             # Recursos estáticos (imágenes, iconos, etc.)
├── App.tsx             # Componente raíz de la aplicación
├── main.tsx            # Punto de entrada de la aplicación
├── index.css           # Estilos globales con Tailwind CSS
└── vite-env.d.ts       # Tipos para el entorno Vite
```

## 🎯 Principios de Organización

### **Componentes (components/)**
- **ui/**: Componentes reutilizables sin lógica de negocio específica
- **layout/**: Componentes que definen la estructura general de páginas
- **features/**: Componentes que implementan funcionalidades específicas del negocio

### **Servicios (services/)**
- **apiClient.ts**: Cliente HTTP base con configuración común
- **aiService.ts**: Métodos específicos para endpoints de IA
- **imageService.ts**: Métodos específicos para endpoints de imágenes

### **Hooks (hooks/)**
- **useAsync.ts**: Manejo genérico de estados de carga, éxito y error
- **useAi.ts**: Lógica específica para operaciones de IA
- **useImage.ts**: Lógica específica para operaciones de imágenes

### **Types (types/)**
- **api.ts**: Interfaces para requests, responses, DTOs y tipos relacionados con APIs

### **Utils (utils/)**
- **helpers.ts**: Funciones puras para formateo, validación y transformación de datos

### **Constants (constants/)**
- **config.ts**: URLs de APIs, configuración de la app y constantes

## 🔄 Flujo de Datos

1. **Componente** → usa **Hook**
2. **Hook** → llama **Service**
3. **Service** → hace petición HTTP usando **ApiClient**
4. **ApiClient** → retorna datos tipados según **Types**
5. **Hook** → procesa respuesta usando **Utils** si es necesario
6. **Componente** → renderiza UI usando **Components**

## 📦 Exportaciones

Cada carpeta tiene un archivo `index.ts` que re-exporta todos sus módulos, permitiendo importaciones limpias:

```typescript
// ❌ Evitar
import { Button } from './components/ui/Button';
import { Card } from './components/ui/Card';

// ✅ Preferir  
import { Button, Card } from './components';
```

## 🎨 Componentes UI

Los componentes en `ui/` son agnósticos al negocio y reutilizables:
- **Button**: Diferentes variantes (primary, secondary, outline)
- **Card**: Estructura de tarjeta con header, content y footer
- **Input/Textarea**: Campos de entrada con estilos consistentes
- **Loading**: Spinners y dots para estados de carga

## 🚀 Ventajas de esta Estructura

1. **Escalabilidad**: Fácil agregar nuevas funcionalidades
2. **Mantenibilidad**: Separación clara de responsabilidades
3. **Reutilización**: Componentes UI agnósticos al negocio
4. **Testing**: Cada módulo se puede testear independientemente
5. **Developer Experience**: Importaciones limpias y autocompletado
6. **Consistencia**: Patrones claros para toda la aplicación
