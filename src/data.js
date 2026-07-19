/* ============ DONNÉES (source : carte officielle O'Bresse) ============ */
export const MENU = [
  { id: 'sandwitchs', cat: 'Sandwitchs', cols: ['Seul', 'Menu'], g: 'plats', items: [
    { n: 'Kebab', p: ['9€', '12€'] }, { n: 'Escalope', p: ['9€', '12€'] }, { n: 'Kofte', p: ['9€', '12€'] },
    { n: 'Steak', p: ['9€', '12€'] }, { n: 'Tenders', p: ['9€', '12€'] }, { n: 'Cordon Bleu', p: ['8€', '10,50€'] },
    { n: 'Adana', p: ['8€', '10,50€'] }] },
  { id: 'burgers', cat: 'Burgers', cols: ['Seul', 'Menu'], g: 'plats', items: [
    { n: 'Cheese', p: ['6€', '9€'] }, { n: 'Double Cheese', p: ['7€', '10€'] }, { n: 'Fish', p: ['6€', '9€'] },
    { n: 'Chicken', p: ['6€', '9€'] }, { n: "Bap's", p: ['7€', '10€'] }, { n: 'Vegi', p: ['6€', '9€'] },
    { n: "Chicken Bap's", p: ['7€', '10€'] }, { n: 'Special', p: ['9€', '11,50€'] }] },
  { id: 'tacos', cat: 'Tacos', cols: ['Seul', 'Menu'], g: 'plats', items: [
    { n: 'Tacos', p: ['9,5€', '12,50€'] }, { n: 'Maxi Tacos', p: ['12€', '15€'] }],
    notes: ['Supp Viande +1€ — Kebab / Escalope / Kofte / Steak / Tenders / Cordon Bleu',
      'Gratiné +1,50€ — Raclette / cheddar / Modza / Chèvre Miel'] },
  { id: 'assiettes', cat: 'Assiettes', cols: ['Prix'], g: 'plats', items: [
    { n: 'Kebab', p: ['15€'] }, { n: 'Escalope', p: ['14€'] }, { n: 'Kofte', p: ['14€'] }, { n: 'Steak', p: ['14€'] },
    { n: 'Tenders', p: ['14€'] }, { n: 'Cordon Bleu', p: ['14€'] }, { n: 'Royal', p: ['19€'] }] },
  { id: 'grillades', cat: 'Grillades', cols: ['Prix'], g: 'grill', items: [
    { n: 'Cotelettes', p: ['18€'] }, { n: 'Beyti', note: 'adana ou Brochette', p: ['17€'] }, { n: 'Adana', p: ['16€'] },
    { n: 'Aile de Poulet', p: ['16€'] }, { n: 'Iskender', p: ['16€'] }] },
  { id: 'accompagnement', cat: 'Accompagnement & Box', cols: ['Prix'], g: 'box', items: [
    { n: '4 Oignon Ring', p: ['3€'] }, { n: '8 Oignon Ring', p: ['6€'] }, { n: '4 Modza Stick', p: ['3€'] },
    { n: '8 Modza Stick', p: ['6€'] }, { n: '4 Nugget', p: ['3€'] }, { n: '4 Chili Chees', p: ['3€'] }] },
  { id: 'mixte', cat: 'Mixte', cols: ['Prix'], g: 'box', items: [
    { n: '3 Tenders / 4 Wings', p: ['10€'] }, { n: '6 Tenders / 8 Wings', p: ['18€'] },
    { n: '9 Tenders / 12 Wings', p: ['25€'] }, { n: '12 Tenders / 16 Wings', p: ['32€'] }] },
  { id: 'wings', cat: 'Wings', cols: ['Prix'], g: 'box', items: [
    { n: '8 Wings', p: ['10€'] }, { n: '16 Wings', p: ['16€'] }, { n: '24 Wings', p: ['24€'] }, { n: '32 Wings', p: ['32€'] }] },
  { id: 'tenders', cat: 'Tenders', cols: ['Prix'], g: 'box', items: [
    { n: '6 Tenders', p: ['10€'] }, { n: '12 Tenders', p: ['16€'] }, { n: '18 Tenders', p: ['24€'] }, { n: '24 Tenders', p: ['32€'] }] },
  { id: 'tasty', cat: 'Tasty', cols: ['Seul', 'Menu'], g: 'autres', items: [{ n: 'Tasty', p: ['9,5€', '12,50€'] }] },
  { id: 'enfant', cat: 'Menu Enfant', cols: ['Prix'], g: 'autres', items: [
    { n: 'Kebab', p: ['7€'] }, { n: 'Burger', p: ['7€'] }, { n: 'Tenders', p: ['7€'] }, { n: 'Nugget', p: ['7€'] }] },
  { id: 'boissons', cat: 'Boissons', cols: ['Prix'], g: 'drinks', items: [
    { n: 'Canette 33cl', p: ['2€'] }, { n: 'Bouteille 1,5l', p: ['3,50€'] }, { n: 'Eau 50cl', p: ['1,50€'] }, { n: 'Café', p: ['1,80€'] }] },
  { id: 'dessert', cat: 'Dessert', cols: [], g: 'drinks', items: [], notes: ['Desserts du jour — demandez en caisse.'] },
];

export const SAUCES = ['Blanche', 'Harissa', 'Samouraï', 'Algérienne', 'Andalouse', 'Ketchup', 'Mayonnaise', 'Moutarde', 'Barbecue', 'Burger', 'Curry', 'Chili Thai', 'Biggy Burger', 'Marocaine', 'Américaine'];
export const SUPP = ['Kebab', 'Escalope', 'Kofte', 'Steak', 'Tenders', 'Cordon Bleu'];
export const GRAT = ['Raclette', 'cheddar', 'Modza', 'Chèvre Miel'];

/* avis 100% RÉELS — fiche Google O'Bresse */
export const REVIEWS = [
  { n: 'Musa Isiksoy', c: '#C2185B', d: 'il y a 2 semaines', t: 'Excellent ! Un kebab 100% veau fais maison qui est très bon. Le restaurant est très propre avec un beau décor, je recommande fortement avec un accueil chaleureux.' },
  { n: 'Jülide Şen', c: '#7B1FA2', d: 'il y a 2 semaines', t: "Contente d'avoir ce genre de restaurant dans le coin avec une broche maison 100% veau !" },
  { n: 'Ines Boudabban', c: '#E91E63', d: 'il y a 2 semaines', t: "Incroyable ! C'est super bon le kebab est excellent bon accueil bref foncezzzz si vous voulez bien manger." },
  { n: 'geraldine chene', c: '#8E24AA', d: 'il y a 1 semaine', t: 'Viande de qualité faite 100% maison au veau, personnel accueillant et à l\'écoute ainsi que des prix très abordables, une très bonne adresse à découvrir.' },
  { n: 'Huseyin Cengiz', c: '#795548', d: 'il y a 2 semaines', t: 'Accueil, personnel, nourriture excellent ! Le goût des viandes est vraiment exceptionnel. Recommande fortement.' },
  { n: 'Keziban Gulsever', c: '#43A047', d: 'il y a 1 semaine', t: 'La viande est excellente qui est faite maison. Si vous voulez manger un bon kebab de veau n\'hésitez pas foncer !!!' },
];

/* Étapes du montage 3D du sandwich (dans l'ordre de construction) */
export const BUILD_STEPS = [
  { key: 'pain', label: 'Pain', hint: 'Galette chaude' },
  { key: 'sauce', label: 'Sauce', hint: 'Blanche maison' },
  { key: 'salade', label: 'Salade', hint: 'Croquante & fraîche' },
  { key: 'tomates', label: 'Tomates', hint: 'Coupées minute' },
  { key: 'oignons', label: 'Oignons', hint: 'Rouges émincés' },
  { key: 'viande', label: 'Viande', hint: '100 % veau · broche' },
  { key: 'frites', label: 'Frites', hint: 'Croustillantes' },
];

export const FAQ = [
  { q: 'La viande est-elle vraiment faite maison ?', a: "Oui. La broche est montée à la main dans le restaurant, couche par couche, 100 % veau. Elle rôtit progressivement devant la source de chaleur et n'est tranchée qu'au moment de la commande." },
  { q: 'Quels sont vos horaires ?', a: 'Le restaurant est ouvert et ferme à 23:00. Pour les horaires précis du jour, le mieux reste de nous appeler au 06 51 28 06 74.' },
  { q: 'Peut-on commander à emporter ?', a: 'Oui, sur place ou à emporter. Appelez-nous pour préparer votre commande à l\'avance et éviter l\'attente.' },
  { q: 'Quel budget prévoir ?', a: 'Comptez entre 10 et 20 € par personne. Les sandwichs démarrent à 8 €, les menus à 9 €, et les assiettes à 14 €.' },
  { q: 'Proposez-vous des menus enfant ?', a: 'Oui, à 7 € : kebab, burger, tenders ou nuggets, servis avec frites, une boisson et un jouet.' },
];
