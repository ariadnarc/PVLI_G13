# Cambios realizados para la entrega final

---

## Modificaciones de diseño del juego
- **Sistema de clasificación de jeroglíficos:** se ha cambiado de forma que todos tengan el mismo valor. Ya no hay tiers, y consecuentemente ha cambiado el modo de obtener los símbolos. Para poder descifrar la nota se necesitan 15 jeroglíficos, los cuales están asignados cada uno a un cofre, dispuestos por el mapa con una dificultad preasignada cada uno. 
- **Aplicación de la mecánica "High risk, high reward":** hay una sala oculta a la que no puedes entrar hasta que no tengas un número mínimo de jeroglíficos. Al acceder, podrás jugar a un minijuego que si ganas te dará nuevos jeroglíficos, los 3 de "tier" mas alta y si pierdes te quitará 5 obtenidos con menor "tier". El portal que te lleva al Boss final tiene la misma mecánica. (Seguimos utilizando el "tier" para decidir que jeroglificos estan ligados a los minijuegos mas complicados, aunque ya no tengan un uso en el propio codigo)
- **Implementación de jeroglíficos en el juego:** se han creado sprites para los 15 jeroglíficos que aparecen en el juego y puedes recolectarlos, verlos en tu bitácora y comprobar cuáles has descifrado en la nota de pista.
- **Nota de pista para encontrar a Wally:** se ha implementado la nota que encuentra Mariano en la cafetería que contiene la pista para el objetivo del juego. Al comienzo se ve toda escrita en jeroglíficos y a medida que el jugador va obteniéndolos estos se sustituyen por letras del abecedario convencional.

## Modificaciones en el código
- **Tiers:** hemos eliminado todas las clases que calculaban la probabilidad de obtención y que clasificaba los jeroglíficos y hemos añadido una clase en el config con los datos de sus símbolos y a qué letra corresponden. Como hemos dicho tienen valor a la hora de la implementacion de la sala secreta.
- **SoundManager:** se ha modificado el sistema de sonido creando un SoundManager que controla el audio y sonidos globalmente.
- **Sala Secreta:** se ha implementado el sistema de la sala que comprueba tus jeroglíficos para ver si puedes acceder y que te entrega un array de recompensas o te quita de tus jeroglificos un array de ellos.
- **Boot:** se han movido todas las animaciones y cargas de recursos a la única escena Boot.js.
- **Bitácora y nota:** se han modificado estos archivos para que muestren la información de manera acorde a los cambios de diseño.
- **PreMinigameScene:** se ha eliminado la escena "SelectDifficultyScene", que era la escena que aparecía al abrir cada cofre, y se ha sustituído por esta nueva clase que te informa de qué minijuego contiene, qué jeroglífico ganarás si juegas, y en qué dificultad lo harás.
- **PosMinigameMenu:** se ha modificado para poder enseñar el array de jeroglificos eliminados o añadidios en la sala secreta.
- **Carpeta config:** se han añadido varios archivos que contienen la información preasignada de los objetos movibles, los cofres, los jeroglíficos, y datos sobre las dificultades de los minijuegos.
- **Página web:** se han arreglado errores que había en la página web a nivel visual y se ha eliminado la barra lateral de menú. También se ha reorganizado la distribución de los elementos de nuestra web.
- **Revisión general de errores:** se han arreglado bugs y sistemas que estaban mal hechos.

## Modificaciones estéticas
- **Sonido:** se han compuesto, grabado y añadido varias canciones y sonidos para reforzar la ambientación deseada. Están descritos a fondo en nuestro documento sobre los ![assets de nuestro juego](wallyLikeAnEgyptian/assets.md)
- **Assets:** se han diseñado sprites para todos los jeroglíficos.

