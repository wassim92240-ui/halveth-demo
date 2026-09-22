const commerceCurrency = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });
const commercePlanFallback = [
  { id: 'free', name: 'Free', monthlyCents: 0, audience: 'Pour démarrer sans frein', features: ['Goal Engine et parcours personnel', 'Recherche, visites et messages', 'Private Dossier, partage et révocation', 'Aide et tickets de résolution', 'Jusqu’à 2 logements publiés ou gérés', 'Suggestions partenaires discrètes, sans suivi publicitaire'] },
  { id: 'premium', name: 'Premium', monthlyCents: 790, audience: 'Pour avancer sereinement', features: ['Tout Free, sans suggestion partenaire', 'Rental Life et réutilisation du dossier', 'Rappels, historique et exports personnels', 'HALVETH Proof et suivi renforcé', 'Jusqu’à 5 logements publiés ou gérés'] },
  { id: 'gold', name: 'Gold', monthlyCents: 1990, audience: 'Pour les parcours exigeants', features: ['Tout Premium', 'Multi-projets locatifs et déménagement', 'Outils avancés de préparation et scénarios', 'Accompagnement prioritaire selon disponibilité', 'Jusqu’à 15 logements publiés ou gérés'] },
  { id: 'pro', name: 'Pro', monthlyCents: 6900, audience: 'Pour agences et professionnels', features: ['Jusqu’à 30 logements actifs', '5 membres d’équipe inclus', 'Portefeuille, tickets et suivi opérationnel', 'Exports d’activité et suivi administratif', 'Aucun accès aux documents non partagés'] }
];
let commercePlans = commercePlanFallback;
let commerceSubscription = null;
let subscriptionDialog = null;
let sponsorRemovalDialog = null;
const sponsorPreferenceKey = 'halvethSponsorSuggestions';

function commercePrice(plan) { return plan.monthlyCents ? `${commerceCurrency.format(plan.monthlyCents / 100)} / mois` : 'Gratuit'; }
function commercePlanCard(plan, selected = '') {
  const card = document.createElement('article'); card.className = `commerce-plan ${plan.id === 'gold' ? 'featured' : ''}`;
  const tag = document.createElement('span'); tag.className = 'commerce-tag'; tag.textContent = plan.id === 'gold' ? 'LE PLUS COMPLET' : plan.id === 'free' ? 'POUR COMMENCER' : plan.id === 'pro' ? 'POUR ÉQUIPES' : 'POUR ALLER PLUS LOIN';
  const title = document.createElement('h3'); title.textContent = plan.name;
  const audience = document.createElement('p'); audience.className = 'commerce-audience'; audience.textContent = plan.audience;
  const price = document.createElement('strong'); price.className = 'commerce-price'; price.textContent = commercePrice(plan);
  const list = document.createElement('ul'); plan.features.forEach((feature) => { const item = document.createElement('li'); item.textContent = feature; list.append(item); });
  const button = document.createElement('button'); button.type = 'button'; button.className = plan.id === 'gold' ? 'primary-button full' : 'secondary-button full'; button.dataset.planSelect = plan.id; button.textContent = selected === plan.id ? 'Offre sélectionnée' : plan.id === 'free' ? 'Choisir Free' : `Choisir ${plan.name}`;
  card.append(tag, title, audience, price, list, button); return card;
}

function buildPublicOffers() {
  const anchor = document.querySelector('.home-promise'); if (!anchor || document.querySelector('#commerceOffers')) return;
  const offers = document.createElement('section'); offers.id = 'commerceOffers'; offers.className = 'commerce-offers';
  const principles = document.createElement('section'); principles.className = 'commerce-principles'; principles.innerHTML = '<article><span>◈</span><div><strong>La sécurité reste gratuite</strong><p>Private Dossier, contrôle des partages et révocation restent accessibles à tous.</p></div></article><article><span>⌂</span><div><strong>On paie pour gagner du temps</strong><p>Les offres évoluent avec le volume, l’organisation et les besoins de suivi.</p></div></article><article><span>▥</span><div><strong>Une offre dédiée aux pros</strong><p>Les agences paient pour l’équipe et le portefeuille, jamais pour voir plus de données privées.</p></div></article>';
  const intro = document.createElement('div'); intro.className = 'commerce-offers-intro'; intro.innerHTML = '<p class="eyebrow">DES OFFRES CLAIRES, SANS SURPRISE</p><h2>Choisissez le niveau d’accompagnement qui vous convient.</h2><p>Ces prix sont des hypothèses de lancement à ajuster avant ouverture des paiements. Vous pouvez commencer gratuitement ; aucun paiement n’est demandé tant que la solution sécurisée n’est pas connectée.</p>';
  const grid = document.createElement('div'); grid.className = 'commerce-plan-grid'; commercePlans.forEach((plan) => grid.append(commercePlanCard(plan)));
  const note = document.createElement('p'); note.className = 'commerce-payment-note'; note.textContent = 'Free peut contenir de petites suggestions partenaires clairement signalées. Elles ne sont jamais placées dans vos documents, messages, candidatures ou démarches sensibles, et n’utilisent aucun suivi publicitaire dans cette version.';
  offers.append(intro, principles, grid, note); anchor.insertAdjacentElement('afterend', offers);
  const heroActions = document.querySelector('.home-hero .welcome-actions');
  if (heroActions && !document.querySelector('#discoverOffers')) { const button = document.createElement('button'); button.type = 'button'; button.id = 'discoverOffers'; button.className = 'welcome-login'; button.textContent = 'Voir les offres'; button.addEventListener('click', () => offers.scrollIntoView({ behavior: 'smooth', block: 'start' })); heroActions.append(button); }
}

function buildAccountOfferCard() {
  const accountPanel = document.querySelector('.settings-panel[data-settings-panel="account"]'); if (!accountPanel || document.querySelector('#commerceAccountCard')) return;
  const card = document.createElement('div'); card.id = 'commerceAccountCard'; card.className = 'panel settings-card commerce-account-card';
  card.innerHTML = '<div class="panel-heading"><div><h2>Mon offre HALVETH</h2><p id="commerceSubscriptionText">Chargement de votre offre…</p></div><button type="button" class="text-button" id="commerceOpenOffers">Modifier mon offre</button></div><div class="commerce-account-state"><span>◈</span><div><strong id="commerceSubscriptionName">Free</strong><small id="commerceSubscriptionDetail">Aucun paiement activé.</small></div></div><label class="commerce-sponsor-choice" id="commerceSponsorChoice"><input id="sponsorSuggestions" type="checkbox" checked /><span></span><div><strong>Suggestions partenaires discrètes</strong><small>Uniquement avec Free, hors espaces sensibles. Aucun suivi publicitaire dans cette version.</small></div></label><div class="commerce-ad-removal" id="commerceAdRemoval"><div><strong>Retirer les suggestions définitivement</strong><small>Achat unique · 3,99 € · valable sur tous vos appareils après confirmation du paiement.</small></div><button type="button" class="secondary-button" id="sponsorRemovalPurchase">Retirer pour 3,99 €</button></div>';
  accountPanel.append(card);
  buildSubscriptionDialog();
  $('#commerceOpenOffers').addEventListener('click', openSubscriptionDialog);
  const toggle = $('#sponsorSuggestions'); const saved = localStorage.getItem(sponsorPreferenceKey); toggle.checked = saved !== 'off';
  toggle.addEventListener('change', () => { localStorage.setItem(sponsorPreferenceKey, toggle.checked ? 'on' : 'off'); renderSponsorCard(); toast(toggle.checked ? 'Les suggestions partenaires sont activées.' : 'Les suggestions partenaires sont masquées sur cet appareil.'); });
  $('#sponsorRemovalPurchase').addEventListener('click', openSponsorRemovalDialog);
}

function buildSponsorRemovalDialog() {
  if (sponsorRemovalDialog) return;
  sponsorRemovalDialog = document.createElement('dialog'); sponsorRemovalDialog.className = 'subscription-dialog sponsor-removal-dialog';
  sponsorRemovalDialog.innerHTML = '<div class="subscription-dialog-content"><button type="button" class="close subscription-close" aria-label="Fermer">×</button><p class="eyebrow">OPTION FREE</p><h2>Retirer les suggestions définitivement</h2><p class="modal-copy">Cette option est un achat unique de 3,99 €. Elle enlèvera les suggestions partenaires pour ce compte sur tous vos appareils, après confirmation du paiement sécurisé.</p><p class="commerce-payment-note">Le paiement n’est pas encore connecté : votre demande peut être préparée, mais aucun montant ne sera débité et les suggestions resteront affichées tant que le paiement n’est pas confirmé.</p><div class="modal-actions"><button type="button" class="secondary-button" id="cancelSponsorRemoval">Annuler</button><button type="button" class="primary-button" id="confirmSponsorRemoval">Préparer l’achat à 3,99 €</button></div></div>';
  document.body.append(sponsorRemovalDialog);
  sponsorRemovalDialog.querySelector('.subscription-close').addEventListener('click', () => sponsorRemovalDialog.close());
  $('#cancelSponsorRemoval').addEventListener('click', () => sponsorRemovalDialog.close());
  $('#confirmSponsorRemoval').addEventListener('click', requestAdsRemoval);
  sponsorRemovalDialog.addEventListener('click', (event) => { if (event.target === sponsorRemovalDialog) sponsorRemovalDialog.close(); });
}

function openSponsorRemovalDialog() { buildSponsorRemovalDialog(); if (typeof sponsorRemovalDialog.showModal === 'function') sponsorRemovalDialog.showModal(); else sponsorRemovalDialog.setAttribute('open', ''); }

function buildSubscriptionDialog() {
  if (subscriptionDialog) return;
  subscriptionDialog = document.createElement('dialog'); subscriptionDialog.id = 'subscriptionDialog'; subscriptionDialog.className = 'subscription-dialog';
  const content = document.createElement('div'); content.className = 'subscription-dialog-content';
  const close = document.createElement('button'); close.type = 'button'; close.className = 'close subscription-close'; close.textContent = '×'; close.setAttribute('aria-label', 'Fermer'); close.addEventListener('click', () => subscriptionDialog.close());
  const eyebrow = document.createElement('p'); eyebrow.className = 'eyebrow'; eyebrow.textContent = 'MON OFFRE HALVETH';
  const title = document.createElement('h2'); title.textContent = 'Changer d’offre';
  const text = document.createElement('p'); text.className = 'modal-copy'; text.textContent = 'Choisissez l’offre adaptée à votre situation. Aucun paiement ne peut être prélevé tant que le paiement sécurisé n’est pas connecté.';
  const grid = document.createElement('div'); grid.id = 'subscriptionChoices'; grid.className = 'subscription-choice-grid';
  content.append(close, eyebrow, title, text, grid); subscriptionDialog.append(content); document.body.append(subscriptionDialog);
  subscriptionDialog.addEventListener('click', (event) => { if (event.target === subscriptionDialog) subscriptionDialog.close(); });
}

function renderSubscriptionChoices() {
  const grid = $('#subscriptionChoices'); if (!grid) return; grid.replaceChildren(); const selected = commerceSubscription?.planId || 'free';
  commercePlans.forEach((plan) => { const card = commercePlanCard(plan, selected); card.classList.add('subscription-choice'); const button = card.querySelector('button'); delete button.dataset.planSelect; button.dataset.planAccountSelect = plan.id; button.textContent = selected === plan.id ? 'Offre actuelle' : plan.id === 'free' ? 'Passer à Free' : `Choisir ${plan.name}`; grid.append(card); });
}

function openSubscriptionDialog() { renderSubscriptionChoices(); if (typeof subscriptionDialog.showModal === 'function') subscriptionDialog.showModal(); else subscriptionDialog.setAttribute('open', ''); }

function buildAdminCommerce() {
  const administration = document.querySelector('#administration'); if (!administration || document.querySelector('#commerceAdmin')) return;
  const block = document.createElement('section'); block.id = 'commerceAdmin'; block.className = 'commerce-admin panel';
  const head = document.createElement('div'); head.className = 'panel-heading'; head.innerHTML = '<div><p class="eyebrow">GESTION COMMERCIALE & AIDE</p><h2>Revenus, offres et tickets</h2><p>Les montants encaissés proviennent uniquement d’un prestataire de paiement connecté.</p></div><button type="button" class="text-button" id="commerceAdminRefresh">Actualiser</button>';
  const body = document.createElement('div'); body.id = 'commerceAdminBody'; body.className = 'commerce-admin-body'; body.textContent = 'Connectez un compte administrateur pour afficher les données de gestion.';
  block.append(head, body); administration.insertBefore(block, administration.querySelector('.admin-footnote'));
  $('#commerceAdminRefresh').addEventListener('click', loadAdminCommerce);
  document.querySelector('[data-page-link="administration"]')?.addEventListener('click', () => window.setTimeout(loadAdminCommerce, 50));
}

function setSubscriptionDisplay(subscription) {
  commerceSubscription = subscription || null;
  const plan = commercePlans.find((item) => item.id === subscription?.planId) || commercePlans[0];
  const status = subscription?.status || 'active_free';
  const name = $('#commerceSubscriptionName'); const detail = $('#commerceSubscriptionDetail'); const text = $('#commerceSubscriptionText');
  if (!name || !detail || !text) return;
  name.textContent = plan.name;
  if (status === 'payment_pending') { detail.textContent = `${commercePrice(plan)} · paiement non activé`; text.textContent = `Votre choix ${plan.name} est enregistré, sans débit.`; }
  else { detail.textContent = plan.id === 'free' ? 'Accès gratuit actif.' : commercePrice(plan); text.textContent = `Votre offre actuelle : ${plan.name}.`; }
  const sponsorChoice = $('#commerceSponsorChoice'); if (sponsorChoice) { sponsorChoice.hidden = plan.id !== 'free'; $('#sponsorSuggestions').checked = localStorage.getItem(sponsorPreferenceKey) !== 'off'; }
  const removal = $('#commerceAdRemoval'); const removalButton = $('#sponsorRemovalPurchase');
  if (removal) { removal.hidden = plan.id !== 'free'; if (subscription?.adsRemoved) { removal.querySelector('strong').textContent = 'Suggestions partenaires retirées'; removal.querySelector('small').textContent = 'Achat définitif confirmé pour ce compte.'; removalButton.hidden = true; } else if (subscription?.adsRemovalStatus === 'payment_pending') { removal.querySelector('strong').textContent = 'Retrait définitif en attente'; removal.querySelector('small').textContent = '3,99 € · aucun débit effectué tant que le paiement sécurisé reste indisponible.'; removalButton.hidden = true; } else { removalButton.hidden = false; } }
  renderSponsorCard();
}

function renderSponsorCard() {
  document.querySelector('#halvethSponsorCard')?.remove();
  const freePlan = !commerceSubscription || commerceSubscription.planId === 'free';
  if (!freePlan || commerceSubscription?.adsRemoved || localStorage.getItem(sponsorPreferenceKey) === 'off') return;
  const dashboard = document.querySelector('[data-page="dashboard"] .dashboard-grid, [data-page="dashboard"] .page-heading');
  if (!dashboard) return;
  const card = document.createElement('aside'); card.id = 'halvethSponsorCard'; card.className = 'halveth-sponsor-card';
  card.innerHTML = '<span class="halveth-sponsor-label">PARTENAIRE SÉLECTIONNÉ</span><div><strong>Préparer votre assurance habitation</strong><p>Un exemple d’emplacement sobre, pertinent pour votre parcours et toujours séparé de vos démarches HALVETH.</p></div><button type="button" class="text-button" id="sponsorInfo">Pourquoi cette suggestion ?</button>';
  dashboard.insertAdjacentElement('afterend', card);
  $('#sponsorInfo')?.addEventListener('click', () => toast('Suggestion affichée car votre offre Free autorise les partenaires. Aucun ciblage à partir de vos documents ou messages.'));
}

async function loadSubscription() {
  const token = localStorage.getItem(apiTokenKey); if (!token) { setSubscriptionDisplay(null); return; }
  try { const data = await apiCall('/subscription', { headers: { authorization: `Bearer ${token}` } }); if (data?.plans?.length) { commercePlans = data.plans; refreshOfferCards(data.subscription?.planId || ''); } setSubscriptionDisplay(data?.subscription); } catch { setSubscriptionDisplay(null); }
}

function refreshOfferCards(selected = '') {
  const grid = document.querySelector('.commerce-plan-grid'); if (!grid) return; grid.replaceChildren(); commercePlans.forEach((plan) => grid.append(commercePlanCard(plan, selected)));
}

async function selectPlan(planId, source = 'public') {
  const token = localStorage.getItem(apiTokenKey);
  if (!token) { toast('Créez votre espace pour choisir une offre.'); history.pushState(null, '', '#signup'); showPage('signup'); return; }
  try {
    const result = await apiCall('/subscription', { method: 'PUT', headers: { authorization: `Bearer ${token}` }, body: JSON.stringify({ planId }) });
    setSubscriptionDisplay(result?.subscription); refreshOfferCards(planId); if (source === 'account') subscriptionDialog?.close();
    toast(planId === 'free' ? 'L’offre Free est active.' : 'Votre offre est préparée : aucun paiement ne sera prélevé avant la connexion sécurisée.');
  } catch (error) { toast(error.message || 'Impossible d’enregistrer cette offre.'); }
}

async function requestAdsRemoval() {
  const token = localStorage.getItem(apiTokenKey); if (!token) { toast('Connectez-vous pour préparer cet achat.'); return; }
  try { const result = await apiCall('/subscription/ads-removal', { method: 'POST', headers: { authorization: `Bearer ${token}` } }); setSubscriptionDisplay(result.subscription); sponsorRemovalDialog?.close(); toast('Achat préparé : aucun montant n’a été débité.'); } catch (error) { toast(error.message || 'Impossible de préparer cet achat.'); }
}

function adminStat(label, value, tone = '') { const item = document.createElement('article'); item.className = `commerce-admin-stat ${tone}`; const number = document.createElement('strong'); number.textContent = value; const copy = document.createElement('span'); copy.textContent = label; item.append(number, copy); return item; }
function adminChart(title, subtitle, points, currency = false) { const panel = document.createElement('section'); panel.className = 'commerce-chart'; const header = document.createElement('header'); header.innerHTML = `<div><h3>${title}</h3><p>${subtitle}</p></div>`; const bars = document.createElement('div'); bars.className = 'commerce-chart-bars'; const maximum = Math.max(...points.map((point) => point.value), 1); points.forEach((point) => { const bar = document.createElement('article'); const value = document.createElement('strong'); value.textContent = currency ? commerceCurrency.format(point.value / 100) : String(point.value); const column = document.createElement('i'); column.style.height = `${Math.max(7, Math.round((point.value / maximum) * 100))}%`; const label = document.createElement('span'); label.textContent = point.label; bar.append(value, column, label); bars.append(bar); }); panel.append(header, bars); return panel; }
function paymentModule(analytics) { const panel = document.createElement('section'); panel.className = 'commerce-payment-module'; panel.innerHTML = '<div><p class="eyebrow">PAIEMENTS</p><h3>Module de paiement</h3><p>Les encaissements, remboursements et factures apparaîtront ici après connexion d’un prestataire de paiement.</p></div><aside><span class="status-chip awaiting">À connecter</span><strong>0 transaction encaissée</strong><button type="button" class="secondary-button" id="preparePaymentProvider">Préparer la connexion</button></aside>'; panel.querySelector('strong').textContent = `${analytics.payment.transactionsSettled} transaction${analytics.payment.transactionsSettled > 1 ? 's' : ''} encaissée${analytics.payment.transactionsSettled > 1 ? 's' : ''}`; panel.querySelector('#preparePaymentProvider').addEventListener('click', () => toast('Pour activer les paiements, il faudra connecter un prestataire, son compte professionnel et ses clés sécurisées côté serveur.')); return panel; }
function isProductFeedback(ticket) { return ticket.topic === 'Retour produit' || ticket.topic === 'Retour bêta'; }
function ticketRow(ticket) {
  const feedback = isProductFeedback(ticket); const row = document.createElement('article'); row.className = `commerce-ticket${feedback ? ' beta-feedback-ticket' : ''}`;
  const info = document.createElement('div'); const title = document.createElement('strong'); title.textContent = feedback ? 'Retour produit' : ticket.topic; const message = document.createElement('p'); message.textContent = ticket.message; const date = document.createElement('small'); date.textContent = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(ticket.createdAt)); if (feedback) { const labels = { bug: 'Bug', idea: 'Idée', confusing: 'Parcours difficile', other: 'Autre retour' }; const signal = document.createElement('span'); signal.className = `beta-feedback-signal${ticket.blocking ? ' blocking' : ''}`; signal.textContent = ticket.blocking ? `Bloquant · ${labels[ticket.betaKind] || 'Retour'}` : labels[ticket.betaKind] || 'Retour utilisateur'; info.append(signal); } info.append(title, message, date);
  const state = document.createElement('span'); state.className = `status-chip ${ticket.status === 'resolved' ? 'sent' : 'awaiting'}`; state.textContent = ticket.status === 'resolved' ? 'Résolu' : ticket.status === 'in_progress' ? 'En cours' : 'Reçue';
  const actions = document.createElement('div'); actions.className = 'commerce-ticket-actions'; if (ticket.status !== 'resolved') { const progress = document.createElement('button'); progress.type = 'button'; progress.className = 'text-button'; progress.textContent = ticket.status === 'in_progress' ? 'Marquer résolu' : 'Prendre en charge'; progress.dataset.ticketId = ticket.id; progress.dataset.ticketStatus = ticket.status === 'in_progress' ? 'resolved' : 'in_progress'; actions.append(progress); }
  row.append(info, state, actions); return row;
}

async function loadAdminCommerce() {
  const target = $('#commerceAdminBody'); const token = localStorage.getItem(apiTokenKey); if (!target) return;
  if (!token) { target.textContent = 'Connectez-vous avec le compte administrateur autorisé pour accéder au suivi.'; return; }
  target.textContent = 'Chargement du tableau administrateur…';
  try {
    const [overview, financeResult, ticketsResult] = await Promise.all([
      apiCall('/admin/overview', { headers: { authorization: `Bearer ${token}` } }),
      apiCall('/admin/finance', { headers: { authorization: `Bearer ${token}` } }),
      apiCall('/admin/support-requests', { headers: { authorization: `Bearer ${token}` } })
    ]);
    const finance = financeResult.finance; const analytics = overview.analytics || { membersTotal: 0, memberTrend: [], revenueTrend: [], payment: { transactionsSettled: 0 } }; target.replaceChildren();
    const notice = document.createElement('p'); notice.className = 'commerce-admin-notice'; notice.textContent = 'Paiement non connecté : les revenus encaissés restent à 0 €, même si une offre a été choisie.';
    const productFeedback = ticketsResult.requests.filter(isProductFeedback); const stats = document.createElement('div'); stats.className = 'commerce-admin-stats'; stats.append(adminStat('Revenus encaissés', commerceCurrency.format(finance.settledRevenueCents / 100), 'green'), adminStat('Membres', String(analytics.membersTotal), 'blue'), adminStat('Abonnements à finaliser', String(finance.selectedSubscriptions), 'gold'), adminStat('Retours utilisateurs', String(productFeedback.length), 'violet'), adminStat('Bugs bloquants', String(productFeedback.filter((ticket) => ticket.blocking).length), 'red'), adminStat('Tickets résolus', String(overview.tickets.resolved), 'green'));
    const charts = document.createElement('div'); charts.className = 'commerce-chart-grid'; charts.append(adminChart('Évolution des membres', 'Nombre total de comptes HALVETH, mois par mois.', analytics.memberTrend), adminChart('Revenus encaissés', 'Uniquement les paiements réellement confirmés.', analytics.revenueTrend, true));
    const ticketArea = document.createElement('section'); ticketArea.className = 'commerce-ticket-list'; const ticketTitle = document.createElement('h3'); ticketTitle.textContent = 'Tickets d’aide et retours utilisateurs'; const filters = document.createElement('div'); filters.className = 'commerce-ticket-filters'; const ticketItems = document.createElement('div'); const choices = [['all', 'Tous'], ['blocking', 'Bloquants'], ['feedback', 'Retours utilisateurs'], ['help', 'Aide & résolution']]; const renderTickets = (filter) => { const visibleTickets = ticketsResult.requests.filter((ticket) => filter === 'all' || (filter === 'blocking' ? isProductFeedback(ticket) && ticket.blocking : filter === 'feedback' ? isProductFeedback(ticket) : !isProductFeedback(ticket))); ticketItems.replaceChildren(); if (visibleTickets.length) visibleTickets.forEach((ticket) => ticketItems.append(ticketRow(ticket))); else { const empty = document.createElement('p'); empty.className = 'commerce-empty'; empty.textContent = filter === 'blocking' ? 'Aucun bug bloquant signalé pour le moment.' : filter === 'feedback' ? 'Aucun retour utilisateur à traiter pour le moment.' : 'Aucun ticket à traiter pour le moment.'; ticketItems.append(empty); } filters.querySelectorAll('button').forEach((button) => button.classList.toggle('active', button.dataset.ticketFilter === filter)); }; choices.forEach(([value, label]) => { const button = document.createElement('button'); button.type = 'button'; button.className = 'commerce-ticket-filter'; button.dataset.ticketFilter = value; button.textContent = label; button.addEventListener('click', () => renderTickets(value)); filters.append(button); }); ticketArea.append(ticketTitle, filters, ticketItems); renderTickets('all');
    target.append(notice, stats, charts, paymentModule(analytics), ticketArea);
  } catch (error) {
    target.replaceChildren(); const message = document.createElement('p'); message.className = 'commerce-admin-notice'; message.textContent = error?.message === 'Accès administrateur requis.' ? 'Cet espace est protégé. Ajoutez l’adresse du propriétaire dans la liste administrateur sécurisée de HALVETH, puis reconnectez-vous.' : 'Le tableau administrateur n’est pas disponible pour le moment.'; target.append(message);
  }
}

document.addEventListener('click', async (event) => {
  const accountPlan = event.target.closest('[data-plan-account-select]'); if (accountPlan) { await selectPlan(accountPlan.dataset.planAccountSelect, 'account'); return; }
  const plan = event.target.closest('[data-plan-select]'); if (plan) { await selectPlan(plan.dataset.planSelect); return; }
  const ticket = event.target.closest('[data-ticket-id]'); if (ticket) { const token = localStorage.getItem(apiTokenKey); if (!token) return; try { await apiCall('/admin/support-requests', { method: 'PUT', headers: { authorization: `Bearer ${token}` }, body: JSON.stringify({ id: ticket.dataset.ticketId, status: ticket.dataset.ticketStatus }) }); toast(ticket.dataset.ticketStatus === 'resolved' ? 'Ticket marqué comme résolu.' : 'Ticket pris en charge.'); loadAdminCommerce(); } catch (error) { toast(error.message || 'Impossible de mettre à jour ce ticket.'); } }
});

(async () => { buildPublicOffers(); buildAccountOfferCard(); buildAdminCommerce(); try { const publicPlans = await apiCall('/plans'); if (publicPlans?.plans?.length) { commercePlans = publicPlans.plans; refreshOfferCards(); } } catch { /* Les offres de présentation restent visibles hors ligne. */ } loadSubscription(); if (location.hash === '#administration') loadAdminCommerce(); })();
