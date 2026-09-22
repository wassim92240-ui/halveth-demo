(function addPrivacyGuardrails() {
  const list = document.querySelector('.legal-list');
  if (!list || document.getElementById('privacyMatchingGuardrail')) return;

  const matching = document.createElement('article');
  matching.id = 'privacyMatchingGuardrail';
  const matchingTitle = document.createElement('h2');
  matchingTitle.textContent = 'Matching objectif';
  const matchingText = document.createElement('p');
  matchingText.textContent = 'Les rapprochements utilisent seulement la ville, le type de logement et le budget indiqué. HALVETH ne crée pas de note de « bon » ou « mauvais » locataire et refuse les critères personnels hors sujet.';
  matching.append(matchingTitle, matchingText);

  const optionalChoice = document.createElement('article');
  const optionalTitle = document.createElement('h2');
  optionalTitle.textContent = 'Choix facultatifs';
  const optionalText = document.createElement('p');
  optionalText.textContent = 'Un réglage optionnel ne modifie pas l’accès au service. Son activation comme son retrait sont datés dans le compte afin que la personne puisse le comprendre et le modifier.';
  optionalChoice.append(optionalTitle, optionalText);

  list.insertBefore(matching, list.lastElementChild);
  list.insertBefore(optionalChoice, list.lastElementChild);
}());
