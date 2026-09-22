const halvethTutorialKey = 'halvethTutorialCompletedV1';
const tutorialSteps = [
  { eyebrow: 'BIENVENUE DANS HALVETH', title: 'Votre location, enfin dans le bon ordre.', text: 'Pas besoin de comprendre tous les outils. HALVETH commence par votre situation et vous propose une prochaine étape claire.', points: ['Choisissez simplement ce que vous voulez faire', 'Vous gardez toujours la décision finale'], destination: 'goal', action: 'Choisir mon objectif' },
  { eyebrow: 'VOTRE DOSSIER, VOS RÈGLES', title: 'Partagez moins, mais partagez mieux.', text: 'Vos documents restent privés par défaut. Vous décidez quoi partager, avec qui et pour combien de temps.', points: ['Aucun envoi automatique de document', 'Un accès peut être retiré à tout moment'], destination: 'dossier', action: 'Découvrir Private Dossier' },
  { eyebrow: 'UNE ACTION À LA FOIS', title: 'HALVETH vous indique la suite utile.', text: 'Recherche, candidature, bail, incident ou départ : l’application organise le parcours sans multiplier les menus.', points: ['Une prochaine action compréhensible', 'Votre situation peut évoluer sans recommencer'], destination: 'dashboard', action: 'Ouvrir mon espace' }
];
let tutorialIndex = 0;
const tutorialDialog = document.createElement('dialog'); tutorialDialog.className = 'tutorial-dialog';
tutorialDialog.innerHTML = '<div class="tutorial-visual"><span class="brand-mark">H</span><i></i><b></b></div><div class="tutorial-content"><div class="tutorial-top"><div class="tutorial-progress" aria-label="Progression du tutoriel"></div><button type="button" class="tutorial-skip">Passer le guide</button></div><p class="eyebrow" id="tutorialEyebrow"></p><h2 id="tutorialTitle"></h2><p id="tutorialText"></p><ul id="tutorialPoints"></ul><div class="tutorial-actions"><button type="button" class="secondary-button" id="tutorialPrevious">Retour</button><button type="button" class="primary-button" id="tutorialNext"></button></div></div>';
document.body.append(tutorialDialog);

function renderTutorial() {
  const step = tutorialSteps[tutorialIndex];
  $('#tutorialEyebrow').textContent = step.eyebrow; $('#tutorialTitle').textContent = step.title; $('#tutorialText').textContent = step.text; $('#tutorialNext').textContent = step.action; $('#tutorialPrevious').hidden = tutorialIndex === 0;
  const progress = tutorialDialog.querySelector('.tutorial-progress'); progress.replaceChildren(); tutorialSteps.forEach((_, index) => { const dot = document.createElement('i'); dot.classList.toggle('active', index <= tutorialIndex); progress.append(dot); });
  const points = $('#tutorialPoints'); points.replaceChildren(); step.points.forEach((point) => { const item = document.createElement('li'); item.textContent = point; points.append(item); });
}
function closeTutorial(completed = false) { if (completed) localStorage.setItem(halvethTutorialKey, 'true'); if (typeof tutorialDialog.close === 'function') tutorialDialog.close(); else tutorialDialog.removeAttribute('open'); }
function openHalvethTutorial() { tutorialIndex = 0; renderTutorial(); if (typeof tutorialDialog.showModal === 'function' && !tutorialDialog.open) tutorialDialog.showModal(); else tutorialDialog.setAttribute('open', ''); }
window.openHalvethTutorial = openHalvethTutorial;

// A direct link keeps the guide reachable even when the visitor is already connected.
if (location.hash === '#tutorial') window.setTimeout(openHalvethTutorial, 0);

$('#tutorialPrevious').addEventListener('click', () => { if (tutorialIndex > 0) { tutorialIndex -= 1; renderTutorial(); } });
$('#tutorialNext').addEventListener('click', () => { const step = tutorialSteps[tutorialIndex]; if (tutorialIndex < tutorialSteps.length - 1) { tutorialIndex += 1; renderTutorial(); return; } closeTutorial(true); history.pushState(null, '', `#${step.destination}`); showPage(step.destination); });
tutorialDialog.querySelector('.tutorial-skip').addEventListener('click', () => closeTutorial(true));
tutorialDialog.addEventListener('click', (event) => { if (event.target === tutorialDialog) closeTutorial(true); });

const homeTutorialButton = document.createElement('button'); homeTutorialButton.type = 'button'; homeTutorialButton.className = 'welcome-login tutorial-home-button'; homeTutorialButton.textContent = 'Voir le guide rapide'; homeTutorialButton.addEventListener('click', openHalvethTutorial); document.querySelector('.welcome-actions')?.append(homeTutorialButton);
const dashboardTutorialButton = document.createElement('button'); dashboardTutorialButton.type = 'button'; dashboardTutorialButton.className = 'text-button dashboard-tutorial-button'; dashboardTutorialButton.textContent = '◉ Guide de démarrage'; dashboardTutorialButton.addEventListener('click', openHalvethTutorial); document.querySelector('#dashboard .dashboard-greeting > div:first-child')?.append(dashboardTutorialButton);
