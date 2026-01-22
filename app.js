let data;
let scriptureText = {};
let introductionData;
let randomMusingsData;
let attributeIndex = {}; 
let deferredPrompt;
const installBtn = document.getElementById("install-btn");

window.addEventListener("beforeinstallprompt", event => {
  event.preventDefault();
  deferredPrompt = event;
  if (installBtn) installBtn.hidden = false;
});

if (installBtn) {
  installBtn.onclick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;

    deferredPrompt = null;
    installBtn.hidden = true;
  };
}

const topBar = document.getElementById('top-bar');
const topNav = document.querySelector('#top-bar .top-nav');

const ATTRIBUTE_GLOSSES = {
beauty: "delightful excellence",
creativity: "bringing something new into being",
eternity: "existing without beginning or end",
extravagance: "giving far more than necessary",
faithfulness: "steadfast loyalty",
forgiveness: "willingness to pardon wrongdoing",
freedom: "unrestricted choice",
grace: "kindness that is not deserved",
goodness: "moral perfection",
holiness: "purity that is set apart",
joy: "deep overflowing gladness",
justice: "fairness rightly applied",
life: "the source of all being",
love: "self‑giving commitment for others",
mercy: "compassion instead of punishment",
omnipotence: "unlimited power to act",
omnipresence: "presence everywhere at all times",
omniscience: "knowing everything perfectly",
patience: "calm endurance without complaint",
peace: "inner stillness and harmony",
sovereignty: "complete control",
transcendence: "existence beyond created limits",
truth: "reality expressed without distortion",
uniqueness: "one‑of‑a‑kind distinct identity",
wisdom: "right knowledge applied well",
};

// ======= Make urls clickable =======
function linkify(text) {
  const urlRegex = /(https?:\/\/[^\s)]+)/g;

  return text.replace(urlRegex, url =>
    `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`
  );
}

Promise.all([
  fetch('data.json').then(r => r.json()),
  fetch('scriptureText.json').then(r => r.json()),
  fetch('introduction.json').then(r => r.json()),
  fetch('randomMusings.json').then(r => r.json())
]).then(([dataJson, scriptureJson, introJson, musingsJson]) => {
  data = dataJson;
  scriptureText = scriptureJson.scriptureText;
  introductionData = introJson.introduction;
  randomMusingsData = musingsJson.randomMusings;

  buildAttributeIndex();
  showLaunch();
});

if (installBtn) {
  installBtn.onclick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;

    if (result.outcome === "accepted") {
      console.log("App installed");
    }

    deferredPrompt = null;
    installBtn.hidden = true;
  };
}

function toggleTheme() {
  document.body.classList.toggle("dark");

  const mode = document.body.classList.contains("dark")
    ? "dark"
    : "light";

  localStorage.setItem("theme", mode);
}

// restore preference on load
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
  document.body.classList.remove("dark");
}

document.addEventListener("DOMContentLoaded", () => {
  const holder = document.getElementById("mini-launch-icon");
  if (holder) holder.innerHTML = buildMiniLaunchIconSvg();
});

const app = document.getElementById('app');
const title = document.getElementById('page-title')
const backButton = document.getElementById('back-button');
if (!backButton) {
console.warn("Back button not found in DOM");
}
title.textContent = "Know God Better";

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  showInstallButton();
});

function isIOS() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

if (isIOS() && !window.navigator.standalone) {
  installBtn.hidden = false;
  installBtn.onclick = () => {
    alert(
      "On iPhone or iPad:\n\nTap Share → Add to Home Screen."
    );
  };
}

window.addEventListener("appinstalled", () => {
  deferredPrompt = null;
  if (installBtn) installBtn.hidden = true;
});

function buildAttributeIndex() {
  data.attributes.forEach(attr => {
    // canonical name
    attributeIndex[attr.name.toLowerCase()] = attr;

    // aliases
    if (attr.aliases) {
      attr.aliases.forEach(alias => {
        attributeIndex[alias.toLowerCase()] = attr;
      });
    }
  });
}

function renderTextWithAttributeRefs(text) {
  if (!text) return "";

  return text.replace(/●([A-Za-z]+)/g, (match, word) => {
    const key = word.toLowerCase();
    const attr = attributeIndex[key];

    if (!attr) return match; // safety net

    return `
      <span
        class="attr-ref"
        style="color:${attr.color}"
        onclick="openDefinitionModal(${JSON.stringify(attr).replace(/"/g, '&quot;')})"
      >
        ●${word}
      </span>
    `;
  });
}

function buildLaunchIconSvg() {
  const launchColours = [
    "#d41a17", "#d43f17", "#d46417", "#d48917", "#d4ad17",
    "#b6d417", "#8fd417", "#41d417", "#17d447", "#17d46f",
    "#17b6d4", "#1768d4", "#1741d4", "#1f17d4",
    "#6f17d4", "#9717d4", "#b617d4", "#d41789"
  ];

  const rOuter = 100;
  const rApex  = 45;   // controls ray angle
  const count  = launchColours.length;

  const baseAngle = (2 * Math.PI) / count;
  const baseHalf  = baseAngle / 2;

  const triangles = launchColours.map((color, i) => {
    const theta = i * baseAngle - Math.PI / 2;

    const ax = Math.cos(theta) * rApex;
    const ay = Math.sin(theta) * rApex;

    const bx1 = Math.cos(theta - baseHalf) * rOuter;
    const by1 = Math.sin(theta - baseHalf) * rOuter;

    const bx2 = Math.cos(theta + baseHalf) * rOuter;
    const by2 = Math.sin(theta + baseHalf) * rOuter;

    return `
      <path
        d="M ${ax} ${ay} L ${bx1} ${by1} L ${bx2} ${by2} Z"
        fill="${color}"
      />
    `;
  }).join("");

  return `
  <svg
    viewBox="-110 -110 220 220"
    width="180"
    height="180"
    aria-hidden="true"
    style="display:block;"
  >
    <!-- white circular underlay -->
    <circle cx="0" cy="0" r="${rOuter-2}" fill="white"/>

    <!-- coloured triangles -->
    ${triangles}

    <!-- central white disc -->
    <circle cx="0" cy="0" r="34" fill="white"/>
  </svg>
`;

}

function buildMiniLaunchIconSvg() {
  const launchColours = [
    "#d41a17", "#d43f17", "#d46417", "#d48917", "#d4ad17",
    "#b6d417", "#8fd417", "#41d417", "#17d447", "#17d46f",
    "#17b6d4", "#1768d4", "#1741d4", "#1f17d4",
    "#6f17d4", "#9717d4", "#b617d4", "#d41789"
  ];

  const rOuter = 14;
  const rApex  = 6;
  const count  = launchColours.length;

  const baseAngle = (2 * Math.PI) / count;
  const baseHalf  = baseAngle / 2;

  const triangles = launchColours.map((color, i) => {
    const theta = i * baseAngle - Math.PI / 2;

    const ax = Math.cos(theta) * rApex;
    const ay = Math.sin(theta) * rApex;
    const bx1 = Math.cos(theta - baseHalf) * rOuter;
    const by1 = Math.sin(theta - baseHalf) * rOuter;
    const bx2 = Math.cos(theta + baseHalf) * rOuter;
    const by2 = Math.sin(theta + baseHalf) * rOuter;

    return `<path d="M ${ax} ${ay} L ${bx1} ${by1} L ${bx2} ${by2} Z" fill="${color}"/>`;
  }).join("");

  return `
    <svg viewBox="-16 -16 32 32" width="22" height="22">
      <circle cx="0" cy="0" r="${rOuter - 1.5}" fill="white"/>
      ${triangles}
      <circle cx="0" cy="0" r="4.5" fill="white"/>
    </svg>
  `;
}

function iconTheme() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2" y="5" width="20" height="14" rx="7" ry="7"></rect>
      <circle cx="9" cy="12" r="4"></circle>
    </svg>
  `;
}

function iconHome() {
  return `
    <svg viewBox="0 0 24 24"
     fill="none"
     stroke="currentColor"
     stroke-width="1.8"
     stroke-linecap="round"
     stroke-linejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <line x1="12" y1="2"  x2="12" y2="6"/>
      <line x1="12" y1="18" x2="12" y2="22"/>
      <line x1="2"  y1="12" x2="6"  y2="12"/>
      <line x1="18" y1="12" x2="22" y2="12"/>
      <line x1="4.5" y1="4.5" x2="7.5" y2="7.5"/>
      <line x1="16.5" y1="16.5" x2="19.5" y2="19.5"/>
      <line x1="16.5" y1="7.5" x2="19.5" y2="4.5"/>
      <line x1="4.5" y1="19.5" x2="7.5" y2="16.5"/>
    </svg>
  `;
}

function iconIntro() {
  return `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
         stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M2 5h8a4 4 0 0 1 4 4v10H6a4 4 0 0 1-4-4z"/>
      <path d="M22 5h-8a4 4 0 0 0-4 4v10h8a4 4 0 0 0 4-4z"/>
    </svg>
  `;
}


function iconReflection() {
  return `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
         stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 21
               C10 19, 4 14.5, 4 9
               A4 4 0 0 1 12 7
               A4 4 0 0 1 20 9
               C20 14.5, 14 19, 12 21z"/>
    </svg>
  `;
}


function iconMusings() {
  return `
    <svg viewBox="0 0 24 24"
         fill="none"
         stroke="currentColor"
         stroke-width="1.8"
         stroke-linecap="round"
         stroke-linejoin="round">

      <g transform="translate(-4 -4) scale(1.2)">
        <!-- main cloud -->
        <path d="
          M6 10
          a4 4 0 0 1 7.5-1.5
          a3.5 3.5 0 0 1 1.5 6.8
          H7
          a3 3 0 0 1 -1 -5.3
          z
        "/>

        <!-- trailing bubbles -->
        <circle cx="8" cy="17" r="3"/>
        <circle cx="5.5" cy="23" r="1.2"/>

      </g>
    </svg>
  `;
}



function iconAbout() {
  return `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
         stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="11" x2="12" y2="16"/>
      <circle cx="12" cy="7" r="1"/>
    </svg>
  `;
}

function renderTopNav(active) {
  return `
    <div class="top-nav">
      <button class="icon-btn ${active === 'home' ? 'active' : ''}" onclick="showHome()">
        ${iconHome()}
      </button>

      <button class="icon-btn ${active === 'intro' ? 'active' : ''}" onclick="showIntroduction()">
        ${iconIntro()}
      </button>

      <button class="icon-btn ${active === 'reflection' ? 'active' : ''}" onclick="showReflection()">
        ${iconReflection()}
      </button>

      <button class="icon-btn ${active === 'musings' ? 'active' : ''}" onclick="showRandomMusings()">
        ${iconMusings()}
      </button>

      <button class="icon-btn ${active === 'about' ? 'active' : ''}" onclick="showAbout()">
        ${iconAbout()}
      </button>
    </div>
  `;
}



function showLaunch() {
  app.className = "launch";
  title.textContent = "Know God Better";
  backButton.hidden = true;
  document.getElementById("icon-bar").style.display = "none";
  topNav.innerHTML = "";
  app.innerHTML = `
      
  <div class="launch-container">
  <div class="theme-toggle" onclick="toggleTheme()">
    ${iconTheme()}
      <span>Light / Dark</span>
      </div>
      <h1 class="launch-title">Know God Better</h1>

      <div class="launch-icon launch-clickable" onclick="showHome()">
        ${buildLaunchIconSvg()}
      </div>

      <div class="launch-bars">
  <button class="launch-bar" onclick="showHome()">
    <span class="launch-bar-icon">${iconHome()}</span>
    <span class="launch-bar-label">Attributes</span>
  </button>

  <button class="launch-bar" onclick="showIntroduction()">
    <span class="launch-bar-icon">${iconIntro()}</span>
    <span class="launch-bar-label">Introduction</span>
  </button>

  <button class="launch-bar" onclick="showReflection()">
    <span class="launch-bar-icon">${iconReflection()}</span>
    <span class="launch-bar-label">Reflection</span>
  </button>

  <button class="launch-bar" onclick="showRandomMusings()">
    <span class="launch-bar-icon">${iconMusings()}</span>
    <span class="launch-bar-label">Random Musings</span>
  </button>

  <button class="launch-bar" onclick="showAbout()">
    <span class="launch-bar-icon">${iconAbout()}</span>
    <span class="launch-bar-label">About</span>
  </button>
  </div>  
  `;
}




function showHome() {
  app.className = "";
  title.textContent = "Attributes";

  backButton.hidden = false;
  backButton.onclick = showLaunch;

  document.getElementById("icon-bar").style.display = "flex";
  topNav.innerHTML = renderTopNav('home');

  app.innerHTML = `

  
    <p class="page-instruction">
      <em>
        God's Attributes: His Glory. 
        Tap one of the coloured attributes below to explore its meaning and implications.
        Then use the back arrow at the top to return to this page.
      </em>
    </p>

    <div class="attributes-grid">
      ${data.attributes.map(attr => `
        <div class="attribute-card" onclick="showAttribute('${attr.id}')">
          <div class="attribute-dot" style="background:${attr.color}"></div>
          <div class="attribute-name">${attr.name}</div>
        </div>
      `).join("")}
    </div>
  `;
}

function showAttribute(id) {
  app.className = "";
  const attr = data.attributes.find(a => a.id === id);
  title.textContent = `The Glory of God - ${attr.name}`;
  backButton.hidden = false;
  backButton.onclick = showHome;
  document.getElementById("icon-bar").style.display = "flex";

  topNav.innerHTML = renderTopNav('home');

  // render the attribute page
  app.innerHTML = `
    <h2 class="attribute-name" data-gloss="${ATTRIBUTE_GLOSSES[attr.id] || ''}">${attr.name}</h2>

    <p><em>${attr.loveLabel}</em></p>
    <p>${attr.loveSummary}</p>

    <h3>Definition</h3>
    <p>${renderTextWithAttributeRefs(attr.definition)}</p>

    ${attr.whatThatMeans ? `
      <h3>What that means</h3>
      <p>${renderTextWithAttributeRefs(attr.whatThatMeans)}</p>
    ` : ""}

    ${attr.whatItDoesNotMean && attr.whatItDoesNotMean.length ? `
      <h3>What it does not mean</h3>
      <ul>
        ${attr.whatItDoesNotMean
          .map(item => `<li>${renderTextWithAttributeRefs(item)}</li>`)
          .join("")}
      </ul>
    ` : ""}

    ${attr.scripture && attr.scripture.length ? `
      <h3>Scripture</h3>
      <p class="scripture-link" onclick="openScriptureModal(${JSON.stringify(attr.scripture).replace(/"/g, '&quot;')})">
        📖 View Scripture
      </p>
    ` : ""}
  `;

  // add tooltip listeners for desktop hover and mobile tap
  const headings = document.querySelectorAll('.attribute-name');

headings.forEach(h => {
  h.addEventListener('mouseenter', showGlossTooltip); // desktop
  h.addEventListener('mouseleave', hideGlossTooltip);

  h.addEventListener('touchstart', showGlossTooltip); // mobile
  h.addEventListener('touchend', hideGlossTooltip);
});
}

// tooltip functions
function showGlossTooltip(event) {
  const heading = event.currentTarget;
  const gloss = heading.getAttribute('data-gloss');
  if (!gloss) return;

  const tooltip = document.getElementById('tooltip');
  tooltip.textContent = gloss;

  const rect = heading.getBoundingClientRect();
  tooltip.style.top = `${rect.bottom + window.scrollY + 6}px`;
  tooltip.style.left = `${rect.left + window.scrollX}px`;

  tooltip.classList.add('visible');
}

function hideGlossTooltip() {
  const tooltip = document.getElementById('tooltip');
  tooltip.classList.remove('visible');
}


function showRandomMusings() {
  app.className = "";
  title.textContent = "Random Musings";
  backButton.hidden = false;
  backButton.onclick = showHome;
  document.getElementById("icon-bar").style.display = "flex";
  topNav.innerHTML = renderTopNav('musings');


  const headings = randomMusingsData.filter(
    item => item.type === "heading"
  );
  
  app.innerHTML = `
    <ul class="intro-outline">
      ${headings.map((h, i) => `
        <li onclick="openRandomMusing(${i})">
          ${h.text}
        </li>
      `).join("")}
    </ul>
  `;
}
  function showUpdateNotification() {
  const banner = document.getElementById('update-notice');
  banner.style.display = 'block';

  banner.onclick = () => {
    window.location.reload();
  };
}

function showAbout() {
  title.textContent = "About this App";
  backButton.hidden = false;
  backButton.onclick = showHome;
  document.getElementById("icon-bar").style.display = "flex";
  topNav.innerHTML = renderTopNav('about');

  app.innerHTML = `
    <div class="about-content">
      <p>
        Scripture quotations taken from <em>The Holy Bible, New International Version (Anglicised), NIV®</em>.<br>
        Copyright © 1979, 1984, 2011 by Biblica, Inc.®<br>
        Used by permission under the General Use Guidelines. All rights reserved.
      </p>

      <p>
        This resource is written from an orthodox historic Christian perspective:<br>
        God is one in essence and three in persons — Father, Son and Holy Spirit.<br>
        Scripture is received as the authoritative witness to God's self-revelation.<br>
        Salvation is by grace alone, through faith alone, in Christ alone.
      </p>
      <div class="about-author">
  <strong>About the author</strong><br>
  Chris Stiven is a member of the leadership team at Vine Evangelical Church, Sevenoaks, UK.<br>
  <a href="https://www.vec.org.uk/" target="_blank" rel="noopener">
    www.vec.org.uk
  </a><br>
  <a href="mailto:chris.stiven@vec.org.uk">
    chris.stiven@vec.org.uk
  </a>
</div>

    </div>
  `;
}
function openScriptureModal(refs) {
  const content = refs.map(ref => {
    const text = scriptureText[ref] || "<em>Text not found.</em>";

    return `
      <div class="scripture-block">
        <h4>${ref}</h4>
        <p>${text}</p>
      </div>
    `;
  }).join("");

 openModal(
  "Scripture",
  `
    <div class="scripture-scroll">${content}</div>
    <div class="scripture-footer">
      Scripture quoted from NIV (UK)
    </div>
  `
);
}

function openModal(titleText, bodyHtml) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';

  overlay.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true">
      <button class="modal-close" aria-label="Close">✕</button>
      <h3>${titleText}</h3>
      ${bodyHtml}
    </div>
  `;

  document.body.appendChild(overlay);

  function close() {
    document.removeEventListener('keydown', escListener);
    overlay.remove();
  }

  overlay.addEventListener('click', e => {
    if (e.target === overlay) close();
  });

  overlay.querySelector('.modal-close')
    .addEventListener('click', close);

  function escListener(e) {
    if (e.key === 'Escape') close();
  }

  document.addEventListener('keydown', escListener);
}

function stripClickableDots(text) {
  return text.replace(/●(\w+)/g, '$1');
}

  function openDefinitionModal(attr) {
  openModal(
    attr.name,
    `
      <p>${stripClickableDots(attr.definition)}</p>
    `
  );
}
function showReflection() {
  app.className = "";
  title.textContent = "Reflection";
  backButton.hidden = false;
  backButton.onclick = showHome;
  document.getElementById("icon-bar").style.display = "flex";
 
  const shuffled = [...data.attributes]
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);

 //  Build mini-grid markup
  const gridHtml = `
    <div class="reflection-grid">
      ${shuffled.map(attr => `
        <div class="attribute-card" onclick='openDefinitionModal(${JSON.stringify(attr).replace(/"/g, '&quot;')})'>
          <div class="attribute-dot" style="background:${attr.color}"></div>
          <div class="attribute-name">${attr.name}</div>
        </div>
      `).join("")}
    </div>
  `;

  // Add the "Let your thinking lead..." paragraph
  const footerHtml = `<p style="text-align:center; margin-top:1rem;">
    Let reflection give way to thanks and worship.
  </p>`;

  // Optional: add an introductory sentence about creative thinking
  const introHtml = `<p style="text-align:center; margin-bottom:1rem;">
    Hold these attributes together before God. Consider how they interpenetrate — and what that reveals of His glory: one light, many colours.
  </p>`;

  
  app.innerHTML = introHtml + gridHtml + footerHtml;
}



function showIntroduction() {
  app.className = "";

  // Header state (explicit, every time)
  backButton.hidden = false;
  backButton.onclick = showHome;   // or showHome, your choice
  title.textContent = "Introduction";

  document.getElementById("icon-bar").style.display = "flex";
  topNav.innerHTML = renderTopNav('intro');

  // Page content
  const headings = introductionData.filter(
    item => item.type === "heading"
  );

  app.innerHTML = `
    <ul class="intro-outline">
      ${headings.map((h, i) => `
        <li onclick="openIntroSection(${i})">
          ${h.text}
        </li>
      `).join("")}
    </ul>
  `;
}


function openIntroSection(index) {
  const headings = introductionData
    .map((item, i) => ({ item, i }))
    .filter(x => x.item.type === "heading");

  const start = headings[index].i + 1;
  const end = headings[index + 1]
    ? headings[index + 1].i
    : introductionData.length;

  const sectionItems = introductionData.slice(start, end);

  const bodyHtml = sectionItems.map(item => {
    if (item.type === "paragraph") {
      return `<p>${item.text}</p>`;
    }

    if (item.type === "list") {
      return `
        <ul>
          ${item.items.map(li => `<li>${li}</li>`).join("")}
        </ul>
      `;
    }

    return "";
  }).join("");

  openModal(headings[index].item.text, bodyHtml);
}


function openRandomMusing(index) {
  const headings = randomMusingsData
    .map((item, i) => ({ item, i }))
    .filter(x => x.item.type === "heading");

  const start = headings[index].i + 1;
  const end = headings[index + 1]
    ? headings[index + 1].i
    : randomMusingsData.length;

  const sectionItems = randomMusingsData.slice(start, end);

    if (!sectionItems.length) {
  openModal(
    headings[index].item.text,
    "<p><em>Content coming shortly.</em></p>"
  );
  return;
}
  const bodyHtml = sectionItems.map(item => {
   if (item.type === "paragraph") {
  return `<p>${linkify(renderTextWithAttributeRefs(item.text))}</p>`
  ;
  
}

    if (item.type === "list") {
      return `
        <ul>
          ${item.items.map(li =>
            `<li>${renderTextWithAttributeRefs(li)}</li>`
          ).join("")}
        </ul>
      `;
      
    }

    return "";
  }).join("");
  openModal(headings[index].item.text, bodyHtml);
}



// ======= PWA Update UX =======
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js').then(reg => {
    // When a new SW is found
    reg.addEventListener('updatefound', () => {
      const newWorker = reg.installing;
      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          // New version is waiting
          showUpdateNotice();
        }
      });
    });
  });
}

// Show update banner
function showUpdateNotice() {
  const notice = document.getElementById('update-notice');
  if (!notice) return;

  notice.classList.add('show');

  notice.onclick = () => {
    notice.textContent = "Refreshing…";
    notice.style.cursor = "default";
    // Activate new SW and reload
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ action: 'skipWaiting' });
    }
    window.location.reload(true);
  };
}

// Tell SW to skip waiting when page requests it
navigator.serviceWorker.addEventListener('controllerchange', () => {
  console.log("Service worker activated, page will reload");
});

