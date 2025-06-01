# 🎨 Clara Design System

Este documento describe la paleta de colores personalizada "Clara" implementada en el proyecto, que está integrada con shadcn/ui y Tailwind CSS v4.

## 🌈 Paleta de Colores

### Colores Principales

#### Clara Sage (Verde Salvia) - Color Principal
- **Base**: `bg-clara-sage` / `text-clara-sage-foreground`
- **HEX Original**: `#899387`
- **Uso**: Calendarios, elementos principales de navegación
- **Variantes**: `clara-sage-50` hasta `clara-sage-900`

#### Clara Terracotta (Terracota) - Color Secundario
- **Base**: `bg-clara-terracotta` / `text-clara-terracotta-foreground` 
- **HEX Original**: `#ae8276`
- **Uso**: Resúmenes importantes, notificaciones de Clara
- **Variantes**: `clara-terracotta-50` hasta `clara-terracotta-900`

#### Clara Forest (Verde Bosque) - Acciones
- **Base**: `bg-clara-forest` / `text-clara-forest-foreground`
- **HEX Original**: `#343b34`
- **Uso**: Botones de acción, elementos seleccionados

#### Clara Warm Gray (Gris Cálido) - Neutral
- **Base**: `bg-clara-warm-gray` / `text-clara-warm-gray-foreground`
- **HEX Original**: `#d7d4d5`
- **Uso**: Fondos de tarjetas, elementos neutros

#### Clara Beige - Complementario
- **Base**: `bg-clara-beige` / `text-clara-beige-foreground`
- **HEX Original**: `#c9b096`
- **Uso**: Elementos de resumen, información complementaria

## 🛠️ Cómo Usar

### Clases Disponibles

```css
/* Colores principales */
.bg-clara-sage
.bg-clara-terracotta  
.bg-clara-forest
.bg-clara-warm-gray
.bg-clara-beige

/* Textos (automáticamente optimizados para contraste) */
.text-clara-sage-foreground        /* Blanco para fondos oscuros */
.text-clara-warm-gray-foreground   /* Texto oscuro para fondos claros */

/* Variantes de intensidad (solo para sage y terracotta) */
.bg-clara-sage-50    /* Más claro */
.bg-clara-sage-100
.bg-clara-sage-200
.bg-clara-sage-300
.bg-clara-sage-400
.bg-clara-sage-500   /* Base */
.bg-clara-sage-600
.bg-clara-sage-700
.bg-clara-sage-800
.bg-clara-sage-900   /* Más oscuro */
```

### Ejemplos de Uso

#### Tarjeta con color principal
```tsx
<div className="bg-clara-sage rounded-3xl p-6 shadow-lg">
  <h2 className="text-clara-sage-foreground font-bold">Título</h2>
  <p className="text-clara-sage-foreground/80">Descripción</p>
</div>
```

#### Botón de acción
```tsx
<Button className="bg-clara-forest hover:bg-clara-forest/90 text-clara-forest-foreground">
  Crear Evento
</Button>
```

#### Tarjeta neutral
```tsx
<div className="bg-clara-warm-gray rounded-3xl p-6">
  <h3 className="text-clara-warm-gray-foreground font-semibold">Contenido</h3>
</div>
```

## 🎯 Mapeo de Colores de Actividades

Las actividades usan un sistema de mapeo inteligente que convierte colores estándar a la paleta Clara:

```tsx
// Colores originales → Colores Clara
"bg-green-500"  → "bg-clara-sage"           // Verde principal
"bg-red-500"    → "bg-clara-terracotta"     // Terracotta principal  
"bg-blue-500"   → "bg-clara-sage-200"       // Verde pastel
"bg-yellow-500" → "bg-clara-beige/70"       // Beige suave
"bg-purple-500" → "bg-clara-terracotta-200" // Rosa pastel
```

## 🌙 Modo Oscuro

El sistema incluye automáticamente variantes para modo oscuro:

```css
.dark {
  --clara-sage: oklch(0.514 0.024 134.76);      /* Más oscuro */
  --clara-terracotta: oklch(0.525 0.052 42.85); /* Más oscuro */
  /* Los textos foreground se mantienen legibles */
}
```

## 📱 Responsive y Accesibilidad

- **Contraste automático**: Los colores `foreground` están optimizados automáticamente
- **Responsive**: Todos los colores funcionan en cualquier tamaño de pantalla
- **Accesibilidad**: Cumple con WCAG 2.1 para contraste de colores

## 🔧 Personalización Avanzada

### Agregar nuevos colores
Para agregar nuevos colores a la paleta Clara, edita `/src/styles.css`:

```css
:root {
  /* Nuevo color */
  --clara-nuevo-color: oklch(0.7 0.05 180);
  --clara-nuevo-color-foreground: oklch(0.98 0 0);
}

@theme inline {
  --color-clara-nuevo-color: var(--clara-nuevo-color);
  --color-clara-nuevo-color-foreground: var(--clara-nuevo-color-foreground);
}
```

### Modificar colores existentes
Simplemente cambia los valores oklch en las variables CSS. El formato es:
- `oklch(lightness chroma hue)`
- `lightness`: 0-1 (oscuro a claro)
- `chroma`: 0-0.4 (gris a saturado)  
- `hue`: 0-360 (círculo cromático)

## 🎨 Filosofía de Diseño

La paleta Clara está diseñada para:

1. **Profesionalismo**: Colores tierra y naturales que transmiten confianza
2. **Calidez**: Tonos que hacen que la aplicación se sienta acogedora
3. **Consistencia**: Sistema coherente que escala a toda la aplicación
4. **Flexibilidad**: Fácil de personalizar y extender
5. **Accesibilidad**: Contraste óptimo en todos los escenarios

## 📊 Casos de Uso por Color

| Color | Componente | Uso Recomendado |
|-------|------------|-----------------|
| `clara-sage` | Calendarios, navegación | Elementos principales de UI |
| `clara-terracotta` | Alertas, resúmenes | Información importante |
| `clara-forest` | Botones, selecciones | Acciones del usuario |
| `clara-warm-gray` | Fondos, contenido | Elementos neutros |
| `clara-beige` | Highlights, complementos | Información secundaria |

¡Disfruta creando interfaces hermosas y consistentes con la paleta Clara! 🚀
