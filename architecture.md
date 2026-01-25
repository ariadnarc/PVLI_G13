# 🏛️ Arquitectura del Proyecto — Wally Like an Egyptian

Este documento contiene un UML de la arquitectura del juego, incluyendo su estructura de carpetas, organización de escenas, managers, datos de configuración y flujo general.

El proyecto está desarrollado en JavaScript utilizando Phaser 3 como motor de juego.

---

## 📁 Estructura General del Proyecto
root
│ main.js
│
├── config/
├── core/
├── lib/
├── menus/
├── overlay/
└── scenes/

Cada carpeta corresponde a un ámbito funcional distinto del juego.

## 🏗️ Decisiones de Arquitectura

- Phaser 3 + Escenas Modulares
- Cada minijuego es una escena completamente independiente
- Managers centralizados (Sound, Player, Input, Pause): aseguran comportamiento consistente en todo el juego.
- Menús basados en MenuBase: se reutiliza comportamiento de botones, estilos y entrada.
- Overlay vs Scene: las superposiciones no reinician la escena actual → mejor UX.
- Configuración aislada en /config: facilita ajustar dificultad, probabilidades o diálogos sin tocar lógica.
- Flow limpio de juego: MapScene es el HUB principal desde el que se accede a todo.

## ✏️ Diagrama UML con todos los archivos, descripción y relaciones

![UML](wallyLikeAnEgyptian/assets/architecture/WallyLikeAnEgyptianUML.png)