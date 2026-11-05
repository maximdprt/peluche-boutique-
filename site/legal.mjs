// Modèles de pages légales (droit français). À FAIRE RELIRE PAR UN PROFESSIONNEL.
// Les données viennent de CONFIG.company : tout ce qui manque reste surligné.
import { CONFIG as C } from './data.mjs';

const t = (s) => (s.startsWith('[') ? `<span class="todo">${s}</span>` : s);
const co = C.company;

export const LEGAL = {
  'mentions-legales.html': {
    title: 'Mentions légales',
    html: `
<h2>Éditeur du site</h2>
<p>Le site ${C.domain} est édité par :<br>
${t(co.name)}, ${t(co.form)}<br>
Siège social : ${t(co.address)}<br>
SIRET : ${t(co.siret)}<br>
TVA : ${t(co.vat)}<br>
Email : <a class="link" href="mailto:${C.email}">${C.email}</a><br>
Directeur de la publication : ${t(co.director)}</p>
<h2>Hébergeur</h2>
<p>${t(co.host)}</p>
<h2>Propriété intellectuelle</h2>
<p>Les textes, photos, logos et éléments graphiques de ce site appartiennent à ${C.brand} ou font l'objet d'une autorisation d'utilisation. Toute reproduction sans autorisation est interdite.</p>
<h2>Médiation de la consommation</h2>
<p>Conformément aux articles L611-1 et suivants du Code de la consommation, tu peux recourir gratuitement au médiateur suivant : ${t(co.mediator)}. Tu peux aussi utiliser la plateforme européenne de règlement des litiges en ligne : <a class="link" href="https://ec.europa.eu/consumers/odr" rel="noopener" target="_blank">ec.europa.eu/consumers/odr</a>.</p>
<h2>Données personnelles</h2>
<p>Voir notre <a class="link" href="confidentialite.html">politique de confidentialité</a>.</p>`,
  },

  'cgv.html': {
    title: 'Conditions générales de vente',
    html: `
<p>Dernière mise à jour : <span class="todo">[À COMPLÉTER : date]</span></p>
<h2>1. Objet</h2>
<p>Les présentes conditions générales de vente (CGV) s'appliquent à toutes les ventes de produits réalisées sur le site ${C.domain} par ${t(co.name)}, ${t(co.form)}, SIRET ${t(co.siret)}, dont le siège est situé ${t(co.address)} (ci-après « ${C.brand} »), auprès de consommateurs.</p>
<h2>2. Produits</h2>
<p>Les produits sont des peluches décrites et photographiées avec la plus grande exactitude possible. De légères différences de teinte peuvent exister selon l'écran utilisé. Les dimensions sont indiquées à ±1 cm. Âge conseillé : à partir de ${C.ageMin} ans. Les porte-clés ne conviennent pas aux enfants de moins de 36 mois.</p>
<h2>3. Prix</h2>
<p>Les prix sont indiqués en euros, toutes taxes comprises, hors frais de livraison. Les frais de livraison sont indiqués avant la validation de la commande. Toute réduction de prix est calculée à partir du prix le plus bas pratiqué au cours des 30 jours précédant la réduction (article L112-1-1 du Code de la consommation).</p>
<h2>4. Commande</h2>
<p>Le client sélectionne ses produits, valide son panier, renseigne ses coordonnées, choisit son mode de livraison et procède au paiement. La commande est ferme après la confirmation du paiement. Un email de confirmation récapitulant la commande est envoyé au client.</p>
<h2>5. Paiement</h2>
<p>Le paiement s'effectue en ligne par <span class="todo">[À COMPLÉTER : carte bancaire, PayPal, Apple Pay, Google Pay…]</span>, via un prestataire sécurisé. ${C.brand} n'a jamais accès aux données bancaires complètes du client.</p>
<h2>6. Livraison</h2>
<p>Les produits sont expédiés depuis la ${C.shipFrom} sous 1 jour ouvré, puis livrés en ${C.deliveryDays[0]} à ${C.deliveryDays[1]} jours ouvrés en France métropolitaine <span class="todo">[À VÉRIFIER]</span>. La livraison est offerte à partir de ${C.freeShipping} € d'achat. En cas de retard de plus de 30 jours, le client peut annuler sa commande dans les conditions de l'article L216-6 du Code de la consommation.</p>
<h2>7. Droit de rétractation</h2>
<p>Le client dispose d'un délai de 14 jours à compter de la réception pour exercer son droit de rétractation sans avoir à se justifier (article L221-18 du Code de la consommation). ${C.brand} étend ce délai à ${C.returnDays} jours. Pour l'exercer, le client adresse une déclaration claire à <a class="link" href="mailto:${C.email}">${C.email}</a> ou utilise le formulaire ci-dessous. Les frais de retour sont à la charge <span class="todo">[À COMPLÉTER : du client / de ${C.brand}]</span>. Le remboursement intervient dans les 14 jours suivant la réception du retour, par le même moyen de paiement.</p>
<p><b>Exception :</b> conformément à l'article L221-28, 3° du Code de la consommation, le droit de rétractation ne s'applique pas aux produits personnalisés (peluches avec un prénom brodé).</p>
<p><b>Formulaire de rétractation :</b> « À l'attention de ${t(co.name)}, ${t(co.address)}, ${C.email} : je vous notifie par la présente ma rétractation du contrat portant sur la vente du bien ci-dessous : [produit], commandé le [date] / reçu le [date], nom du consommateur, adresse du consommateur, date. »</p>
<h2>8. Garanties légales</h2>
<p>Tous les produits bénéficient de la garantie légale de conformité (articles L217-3 à L217-20 du Code de la consommation) pendant 2 ans à compter de la livraison, et de la garantie des vices cachés (articles 1641 à 1649 du Code civil). En cas de défaut de conformité, le client peut demander la réparation ou le remplacement du produit, ou, à défaut, une réduction du prix ou la résolution de la vente.</p>
<h2>9. Données personnelles</h2>
<p>Voir la <a class="link" href="confidentialite.html">politique de confidentialité</a>.</p>
<h2>10. Médiation et litiges</h2>
<p>En cas de litige, le client s'adresse d'abord au service client. À défaut d'accord, il peut recourir gratuitement au médiateur de la consommation : ${t(co.mediator)}. Les présentes CGV sont soumises au droit français.</p>`,
  },

  'confidentialite.html': {
    title: 'Politique de confidentialité',
    html: `
<h2>Responsable du traitement</h2>
<p>${t(co.name)}, ${t(co.address)}. Contact : <a class="link" href="mailto:${C.email}">${C.email}</a>.</p>
<h2>Données collectées et finalités</h2>
<table><thead><tr><th>Données</th><th>Pourquoi</th><th>Base légale</th><th>Durée</th></tr></thead><tbody>
<tr><td>Nom, adresse, email, téléphone</td><td>Traiter et livrer ta commande</td><td>Exécution du contrat</td><td>Durée de la relation + 3 ans</td></tr>
<tr><td>Factures</td><td>Obligations comptables</td><td>Obligation légale</td><td>10 ans</td></tr>
<tr><td>Email (newsletter)</td><td>T'envoyer nos nouveautés</td><td>Consentement</td><td>Jusqu'à ta désinscription, 3 ans max sans activité</td></tr>
<tr><td>Messages au service client</td><td>Te répondre</td><td>Intérêt légitime</td><td>3 ans</td></tr>
</tbody></table>
<h2>Destinataires</h2>
<p>Tes données sont transmises uniquement aux prestataires nécessaires : hébergeur, prestataire de paiement, transporteur, outil d'emailing <span class="todo">[À COMPLÉTER : noms des prestataires]</span>. Elles ne sont jamais vendues.</p>
<h2>Tes droits</h2>
<p>Tu disposes d'un droit d'accès, de rectification, d'effacement, d'opposition, de limitation et de portabilité. Écris à <a class="link" href="mailto:${C.email}">${C.email}</a>. Tu peux aussi saisir la CNIL (<a class="link" href="https://www.cnil.fr" rel="noopener" target="_blank">cnil.fr</a>).</p>`,
  },

  'cookies.html': {
    title: 'Politique de cookies',
    html: `
<h2>Ce que ce site enregistre</h2>
<p>Ce site n'utilise <b>aucun cookie publicitaire ni de mesure d'audience</b>. Il enregistre uniquement dans ton navigateur (stockage local) le contenu de ton panier, pour que tu le retrouves d'une page à l'autre. Ce stockage est strictement nécessaire au fonctionnement du site et ne demande pas de consentement.</p>
<h2>Polices de caractères</h2>
<p>Les polices du site sont chargées depuis Google Fonts. Ton adresse IP est donc transmise à Google lors du chargement. <span class="todo">[À VÉRIFIER : héberger les polices sur ton serveur pour supprimer ce transfert]</span></p>
<h2>Si tu ajoutes des outils</h2>
<p>Si tu ajoutes plus tard un outil de statistiques, un pixel publicitaire ou un chat, il faudra ajouter un bandeau de consentement et mettre cette page à jour.</p>
<h2>Supprimer les données</h2>
<p>Tu peux vider ton panier ou effacer les données du site dans les réglages de ton navigateur.</p>`,
  },
};
