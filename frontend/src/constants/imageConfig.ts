// Image generation constants - Flux API Styles

export const IMAGE_STYLES = {
  NO_STYLE: 1,
  BOKEH: 2,
  FOOD: 3,
  IPHONE: 4,
  FILM_NOIR: 5,
  CUBIST: 6,
  PIXEL: 7,
  DARK_FANTASY: 8,
  VAN_GOGH: 9,
  CARICATURE: 10,
  STATUE: 11,
  WATERCOLOR: 12,
  OIL_PAINTING: 13,
  MANGA: 14,
  SKETCH: 15,
  COMIC: 16,
  KAWAII: 17,
  CHIBI: 18,
  DISNEY: 19,
  PIXAR: 20,
  FUNKO_POP: 21,
  GHIBLI: 68,
} as const;

export const IMAGE_STYLE_OPTIONS = [
  // Fotografía
  { value: 1, label: '📷 No Style (Fotográfico)', category: 'Fotografía' },
  { value: 2, label: '📷 Bokeh', category: 'Fotografía' },
  { value: 3, label: '🍔 Food', category: 'Fotografía' },
  { value: 4, label: '📱 iPhone', category: 'Fotografía' },
  { value: 5, label: '🎬 Film Noir', category: 'Fotografía' },
  
  // Arte
  { value: 6, label: '🎨 Cubist', category: 'Arte' },
  { value: 7, label: '🎮 Pixel Art', category: 'Arte' },
  { value: 8, label: '🌑 Dark Fantasy', category: 'Arte' },
  { value: 9, label: '🖌️ Van Gogh', category: 'Arte' },
  { value: 10, label: '😄 Caricature', category: 'Arte' },
  { value: 11, label: '🗿 Statue', category: 'Arte' },
  { value: 12, label: '🎨 Watercolor', category: 'Arte' },
  { value: 13, label: '🖼️ Oil Painting', category: 'Arte' },
  { value: 68, label: '🎬 Ghibli', category: 'Arte' },
  
  // Cartoon/Anime
  { value: 14, label: '📚 Manga', category: 'Cartoon' },
  { value: 15, label: '✏️ Sketch', category: 'Cartoon' },
  { value: 16, label: '💬 Comic', category: 'Cartoon' },
  { value: 17, label: '🌸 Kawaii', category: 'Cartoon' },
  { value: 18, label: '👶 Chibi', category: 'Cartoon' },
  { value: 19, label: '🏰 Disney', category: 'Cartoon' },
  { value: 20, label: '💡 Pixar', category: 'Cartoon' },
  { value: 21, label: '🎭 Funko Pop', category: 'Cartoon' },
  
  // Logo
  { value: 27, label: '📊 3D Logo', category: 'Logo' },
  { value: 28, label: '⚡ Minimalist Logo', category: 'Logo' },
  { value: 29, label: '🎨 Cartoon Logo', category: 'Logo' },
  { value: 57, label: '🎨 Graffiti Logo', category: 'Logo' },
  
  // Juegos
  { value: 24, label: '🎮 Minecraft', category: 'Juegos' },
  { value: 26, label: '⚡ Pokemon', category: 'Juegos' },
  { value: 59, label: '🎮 Fortnite', category: 'Juegos' },
  
  // Otros
  { value: 61, label: '🤖 Cyberpunk', category: 'Otros' },
  { value: 64, label: '🔧 Steampunk', category: 'Otros' },
] as const;

export const IMAGE_SIZES = {
  SQUARE: '1-1',
  LANDSCAPE_16_9: '16-9',
  PORTRAIT_9_16: '9-16',
  LANDSCAPE_3_2: '3-2',
  PORTRAIT_2_3: '2-3',
  STANDARD_4_3: '4-3',
  PORTRAIT_3_4: '3-4',
  SXGA_5_4: '5-4',
  PORTRAIT_4_5: '4-5',
} as const;

export const IMAGE_SIZE_OPTIONS = [
  { value: '1-1', label: '⬜ 1:1 (Cuadrado - 1024×1024)', description: 'Ideal para posts de Instagram' },
  { value: '16-9', label: '📺 16:9 (Landscape HD - 1920×1080)', description: 'Ideal para banners y YouTube' },
  { value: '9-16', label: '📱 9:16 (Portrait HD - 1080×1920)', description: 'Ideal para Stories' },
  { value: '3-2', label: '📷 3:2 (Landscape - 1536×1024)', description: 'Formato fotográfico clásico' },
  { value: '2-3', label: '🖼️ 2:3 (Portrait - 1024×1536)', description: 'Ideal para posters' },
  { value: '4-3', label: '🖥️ 4:3 (Standard - 1440×1080)', description: 'Formato tradicional' },
  { value: '3-4', label: '📄 3:4 (Portrait - 1080×1440)', description: 'Documentos verticales' },
  { value: '5-4', label: '🖥️ 5:4 (SXGA - 1280×1024)', description: 'Monitores clásicos' },
  { value: '4-5', label: '📱 4:5 (Portrait - 1024×1280)', description: 'Posts verticales' },
] as const;

export type ImageStyleId = typeof IMAGE_STYLES[keyof typeof IMAGE_STYLES];
export type ImageSize = typeof IMAGE_SIZES[keyof typeof IMAGE_SIZES];
