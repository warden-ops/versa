/* Anciennes adresses de versacapital.ca vers les pages du nouveau site.
   GitHub Pages ne peut pas envoyer de HTTP 301. En production, public/ contient
   une page HTML (actualisation immédiate, canonique, noindex) pour chaque
   ancienne adresse. Ce plugin envoie un vrai 301 pendant `vite` et `vite preview`.
   Le fichier public/_redirects reprend la même liste pour un hébergeur qui le lit
   (Cloudflare Pages, Netlify). */

export const redirections = [
  ['/expertise-equipe-financement-equipement-commercial', '/a-propos/'],
  ['/en/expertise-equipe-financement-equipement-commercial', '/en/about/'],
  ['/financement-dequipement-industriel-et-commercial-neuf-ou-usage', '/financement-equipements/'],
  ['/en/financement-dequipement-industriel-et-commercial-neuf-ou-usage', '/en/equipment-financing/'],
  ['/temoignages-financement-equipement-commercial', '/temoignages/'],
  ['/en/temoignages-financement-equipement-commercial', '/en/testimonials/'],
  ['/questions-frequemment-posees', '/faq/'],
  ['/en/questions-frequemment-posees', '/en/faq/'],
  ['/politique-de-confidentialite-sms', '/politique-de-confidentialite/#sms'],
  ['/en/politique-de-confidentialite-sms', '/en/privacy-policy/#sms'],
  ['/en/politique-de-confidentialite', '/en/privacy-policy/'],
  ['/portfolio-items', '/financement-equipements/'],
  ['/en/portfolio-items', '/en/equipment-financing/'],
  ['/portfolio-items/credit-bail-financement-equipement-commercial', '/credit-bail/'],
  ['/en/portfolio-items/credit-bail-financement-equipement-commercial', '/en/leasing/'],
  ['/portfolio-items/refinancement-dequipements-financement-commercial', '/refinancement-equipements/'],
  ['/en/portfolio-items/refinancement-dequipements-financement-commercial', '/en/equipment-refinancing/'],
  ['/portfolio-items/affacturage-financement-equipement-commercial', '/affacturage/'],
  ['/en/portfolio-items/affacturage-financement-equipement-commercial', '/en/factoring/'],
  ['/portfolio-items/pret-aux-entreprises-financement-equipement-commercial', '/pret-a-terme/'],
  ['/en/portfolio-items/pret-aux-entreprises-financement-equipement-commercial', '/en/term-loan/'],
  ['/portfolio-items/financement-equipements-commercial', '/financement-equipements/'],
  ['/en/portfolio-items/financement-equipements-commercial', '/en/equipment-financing/'],
  ['/portfolio-items/experience-client-financement-equipement-commercial', '/experience-client/'],
  ['/en/portfolio-items/experience-client-financement-equipement-commercial', '/en/client-experience/'],
  ['/services/affacturage', '/affacturage/'],
  ['/en/services/affacturage', '/en/factoring/'],
  ['/services/pret-aux-entreprises', '/pret-a-terme/'],
  ['/en/services/pret-aux-entreprises', '/en/term-loan/'],
  ['/en/soumission', '/en/quote/'],
  ['/en/a-propos', '/en/about/'],
];

export function destination(urlPath) {
  const path = (urlPath || '/').split('?')[0];
  const bare = path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;
  const hit = redirections.find(([from]) => from === bare);
  return hit ? hit[1] : null;
}

export function redirectionsAnciennes() {
  const handler = (req, res, next) => {
    const dest = destination(req.url || '/');
    if (!dest) return next();
    res.statusCode = 301;
    res.setHeader('Location', dest);
    res.setHeader('Cache-Control', 'no-store');
    res.end();
  };
  return {
    name: 'redirections-anciennes',
    configureServer(server) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler);
    },
  };
}
