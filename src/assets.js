// Photos réelles (inlinées en base64 dans le build « fichier unique »).
import brocheMachine from './assets/broche-machine.jpg';
import kebab from './assets/kebab.jpg';
import heroKebab from './assets/hero-kebab.jpg';
import kebabPlein from './assets/kebab-plein.jpg';
import interior from './assets/interior.jpg';

export const PHOTOS = {
  hero: heroKebab,          // accueil : kebab + frites, shooting culinaire
  broche: brocheMachine,    // « Née du feu » : la vraie machine (panneaux rouges)
  kebab: kebabPlein,        // carte vedette de la galerie
  kebabClient: kebab,       // photo du produit réel (dispo si besoin)
  interior,                 // la salle du restaurant (contact)
};
