#!/bin/bash

# Script para limpiar espacio y configurar el proyecto

echo "🧹 Limpiando espacio en disco..."

# Limpiar cache de npm
npm cache clean --force

# Limpiar logs de npm
rm -rf ~/.npm/_logs/*

# Limpiar cache del sistema (si es posible)
sudo apt-get autoremove -y 2>/dev/null || true
sudo apt-get autoclean -y 2>/dev/null || true

echo "📦 Intentando instalar dependencias básicas..."

# Instalar solo las dependencias esenciales
npm install react@^18.2.0 react-dom@^18.2.0 --save --no-audit --no-fund

echo "🎨 Configurando Tailwind..."

# Instalar Tailwind sin dependencias opcionales
npm install -D tailwindcss@^3.3.0 --no-audit --no-fund

echo "✅ Configuración básica completada"

echo "🚀 Para iniciar el proyecto:"
echo "npm run dev"
