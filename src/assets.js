// Photos réelles (inlinées en base64 dans le build « fichier unique »).
import brocheMachine from './assets/broche-machine.jpg';
import heroKebab from './assets/hero-kebab.jpg';
import kebabPlein from './assets/kebab-plein.jpg';
import band from './assets/band-kebab.jpg';
import interior from './assets/interior.jpg';

export const PHOTOS = {
  hero: heroKebab,          // accueil : kebab + frites, étalonné cinéma
  broche: brocheMachine,    // « Née du feu » : la vraie machine (panneaux rouges)
  kebab: kebabPlein,        // carte vedette de la galerie
  band,                     // bande cinématique pleine largeur
  interior,                 // la salle du restaurant (contact)
};
