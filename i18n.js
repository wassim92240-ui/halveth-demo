/* HALVETH language foundation: UI language is intentionally independent from
   the Country Pack that determines the rules of a rental. */
const halvethLanguagePreferenceKey = 'halvethUiLanguage';
const halvethLanguages = [
  ['af', 'Afrikaans'], ['am', 'አማርኛ'], ['ar', 'العربية', 'rtl'], ['as', 'অসমীয়া'], ['az', 'Azərbaycanca'], ['bn', 'বাংলা'], ['bg', 'Български'], ['zh-Hans', '简体中文'], ['zh-Hant', '繁體中文'], ['hr', 'Hrvatski'], ['cs', 'Čeština'], ['da', 'Dansk'], ['nl', 'Nederlands'], ['en', 'English'], ['et', 'Eesti'], ['fi', 'Suomi'], ['fr', 'Français'], ['de', 'Deutsch'], ['el', 'Ελληνικά'], ['gu', 'ગુજરાતી'], ['ha', 'Hausa'], ['he', 'עברית', 'rtl'], ['hi', 'हिन्दी'], ['hu', 'Magyar'], ['id', 'Bahasa Indonesia'], ['it', 'Italiano'], ['ja', '日本語'], ['kn', 'ಕನ್ನಡ'], ['ko', '한국어'], ['ku', 'Kurdî'], ['lo', 'ລາວ'], ['lv', 'Latviešu'], ['lt', 'Lietuvių'], ['ml', 'മലയാളം'], ['ms', 'Bahasa Melayu'], ['mr', 'मराठी'], ['ne', 'नेपाली'], ['no', 'Norsk'], ['or', 'ଓଡ଼ିଆ'], ['fa', 'فارسی', 'rtl'], ['pl', 'Polski'], ['pt-BR', 'Português (Brasil)'], ['pt-PT', 'Português (Portugal)'], ['pa', 'ਪੰਜਾਬੀ'], ['ro', 'Română'], ['ru', 'Русский'], ['si', 'සිංහල'], ['sk', 'Slovenčina'], ['sl', 'Slovenščina'], ['so', 'Soomaali'], ['es', 'Español'], ['sw', 'Kiswahili'], ['sv', 'Svenska'], ['ta', 'தமிழ்'], ['te', 'తెలుగు'], ['th', 'ไทย'], ['tr', 'Türkçe'], ['uk', 'Українська'], ['ur', 'اردو', 'rtl'], ['uz', 'O‘zbek'], ['vi', 'Tiếng Việt'], ['yo', 'Yorùbá'], ['zu', 'isiZulu']
].map(([code, nativeName, direction = 'ltr']) => ({ code, nativeName, direction }));

function getHalvethLanguage(code) { return halvethLanguages.find((language) => language.code === code) || halvethLanguages.find((language) => language.code === 'fr'); }
function savedHalvethLanguage() { return getHalvethLanguage(localStorage.getItem(halvethLanguagePreferenceKey) || 'fr'); }
function languageReady(language) { return language.code === 'fr'; }

const languageDialog = document.createElement('dialog');
languageDialog.className = 'language-dialog';
languageDialog.innerHTML = '<div class="language-dialog-head"><div><p class="eyebrow">HALVETH GLOBAL</p><h2>Choisissez votre langue</h2><p>Votre langue d’interface ne définit jamais les règles du logement : elles dépendent toujours de son pays ou de sa juridiction.</p></div><button class="language-close" type="button" aria-label="Fermer">×</button></div><label class="language-search-label">Rechercher une langue<input id="languageSearch" type="search" autocomplete="off" placeholder="Ex. العربية, हिन्दी, Español…" /></label><div id="languageList" class="language-list" role="list"></div><p id="languageDialogStatus" class="language-dialog-status"></p>';
document.body.append(languageDialog);

const marketingLanguageButton = document.createElement('button');
marketingLanguageButton.type = 'button'; marketingLanguageButton.className = 'marketing-language'; marketingLanguageButton.id = 'marketingLanguage';
document.querySelector('.marketing-actions')?.prepend(marketingLanguageButton);

const languageSettingsCard = document.createElement('div');
languageSettingsCard.className = 'panel settings-card language-settings-card';
languageSettingsCard.innerHTML = '<div class="panel-heading"><div><h2>Langue de l’application</h2><p>La langue de l’écran ne change jamais les règles applicables à votre logement.</p></div><button class="text-button" type="button" id="settingsLanguage">Modifier</button></div><div class="language-settings-current"><span>◎</span><div><strong id="settingsLanguageName"></strong><small id="settingsLanguageStatus"></small></div></div>';
document.querySelector('#settings .settings-panel[data-settings-panel="account"]')?.append(languageSettingsCard);

function languageStatusText(language) { return languageReady(language) ? 'Pack français disponible.' : 'Préférence enregistrée. Le pack complet sera affiché après traduction et contrôle humain.'; }
function updateLanguageSurfaces() {
  const language = savedHalvethLanguage();
  document.documentElement.lang = language.code;
  document.documentElement.dir = language.direction;
  marketingLanguageButton.textContent = `◎ ${language.nativeName}`;
  $('#settingsLanguageName').textContent = language.nativeName;
  $('#settingsLanguageStatus').textContent = languageStatusText(language);
  document.querySelector('#appIntroLanguage')?.replaceChildren(document.createTextNode(`◎ ${language.nativeName}`));
}

function renderLanguageList(filter = '') {
  const normalized = filter.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const current = savedHalvethLanguage(); const list = $('#languageList'); list.replaceChildren();
  const matches = halvethLanguages.filter((language) => `${language.nativeName} ${language.code}`.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().includes(normalized));
  matches.forEach((language) => { const item = document.createElement('button'); item.type = 'button'; item.className = 'language-option'; item.dataset.code = language.code; item.setAttribute('role', 'listitem'); item.setAttribute('aria-pressed', String(language.code === current.code)); item.innerHTML = `<span>${language.nativeName}</span><small>${language.code}${language.direction === 'rtl' ? ' · RTL' : ''}</small><b>${languageReady(language) ? 'Disponible' : 'À traduire'}</b>`; list.append(item); });
  if (!matches.length) { const empty = document.createElement('p'); empty.className = 'language-empty'; empty.textContent = 'Cette langue sera ajoutée au catalogue mondial HALVETH.'; list.append(empty); }
}

function openLanguageDialog() { renderLanguageList(''); $('#languageSearch').value = ''; $('#languageDialogStatus').textContent = ''; if (typeof languageDialog.showModal === 'function') languageDialog.showModal(); else languageDialog.setAttribute('open', ''); $('#languageSearch').focus(); }
function closeLanguageDialog() { if (typeof languageDialog.close === 'function') languageDialog.close(); else languageDialog.removeAttribute('open'); }
function selectHalvethLanguage(code) { const language = getHalvethLanguage(code); localStorage.setItem(halvethLanguagePreferenceKey, language.code); updateLanguageSurfaces(); renderLanguageList($('#languageSearch').value); $('#languageDialogStatus').textContent = languageReady(language) ? 'Le français est actif sur cet appareil.' : `${language.nativeName} est enregistré. HALVETH ne basculera pas vers une traduction incomplète : le français reste affiché jusqu’à la validation du pack choisi.`; }

marketingLanguageButton.addEventListener('click', openLanguageDialog);
$('#settingsLanguage').addEventListener('click', openLanguageDialog);
const appIntroLanguageButton = document.createElement('button'); appIntroLanguageButton.type = 'button'; appIntroLanguageButton.className = 'app-intro-language'; appIntroLanguageButton.id = 'appIntroLanguage'; appIntroLanguageButton.addEventListener('click', openLanguageDialog); document.querySelector('.app-intro-header')?.append(appIntroLanguageButton);
languageDialog.querySelector('.language-close').addEventListener('click', closeLanguageDialog);
$('#languageSearch').addEventListener('input', (event) => renderLanguageList(event.target.value));
$('#languageList').addEventListener('click', (event) => { const option = event.target.closest('.language-option'); if (option) selectHalvethLanguage(option.dataset.code); });
languageDialog.addEventListener('click', (event) => { if (event.target === languageDialog) closeLanguageDialog(); });
updateLanguageSurfaces();
