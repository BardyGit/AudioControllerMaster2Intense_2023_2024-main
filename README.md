# Projet M2 INTENSE de lecteur audio avec WebComponents

Lecteur audio en WebCompoennts avec un visualiseur et gestion de playlist.  
Codé en JavaScript, utilise la bibliothèque Butterchurn pour fournir des effets visuels synchronisés avec la lecture audio.

## Fonctionnalités

- **Lecture audio** : Possibilité de lire des fichiers audio directement dans votre navigateur et de manipuler la piste (avancer,reculer,pause,play,baisser le son,changer de musique,visualisez l'avancement de la musique)
- **Gestion de la playlist** : Visualisez et jouez des sons depuis votre playlist, système de file d'attente (queue) mis en place.
- **Visualisation audio** : Représentation visuelle de votre audio avec divers effets, possibilité de choisir parmis les thèmes visuels prédéfinis, de laissez défiler les thèmes ou les choisir aléatoirement.
- **Égaliseur** : Possibilité de jouer sur les différentes fréquences et modifier l'audio en cours de lecture (Low frequency, Low-Mid-Frequency, Hi-Mid-Frequency et Hi-frequency)

## Disposition des éléments

 - Sur la gauche : la liste des thèmes (visualisation) ainsi que le bouton aléatoire.
 - Au centre :
   - en haut : le lecteur audio
   - milieu gauche : la playlist
   - milieu droite : la file d'attente (vide par défaut)
   - milieu bas : l'égaliseur
 - Sur la droite : titre du thème en cours 

## Setup

1. Clonez le dépôt avec `git clone https://github.com/BardyGit/AudioControllerMaster2Intense_2023_2024-main.git`
2. Lancer le index.html avec 'live-server'
