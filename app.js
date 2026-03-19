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
const classicSongs = [
  { title: "Holy, Holy, Holy", url: "https://youtu.be/JwuDSw-9cUQ" },
  { title: "Be Thou My Vision", url: "https://youtu.be/AN2xrjfNdaU" },
  { title: "How Great Thou Art", url: "https://youtu.be/Cc0QVWzCv9k" },
  { title: "Great Is Thy Faithfulness", url: "https://youtu.be/ErwiBz1QA4o" },
  { title: "O Worship the King", url: "https://youtu.be/MWe1j0G_-aM" },
  { title: "Praise to the Lord, the Almighty", url: "https://youtu.be/BNq0WtMSmIY" },
  { title: "Crown Him with Many Crowns", url: "https://youtu.be/bFEY_GrunQc" },
  { title: "All Hail the Power of Jesus Name", url: "https://youtu.be/_hmtxrFgrEA" },
  { title: "Immortal, Invisible, God Only Wise", url: "https://youtu.be/4oGuGzCFEWI" },
  { title: "O for a Thousand Tongues to Sing", url: "https://youtu.be/4O9kw3cILpg" },
  { title: "Love Divine, All Loves Excelling", url: "https://youtu.be/JGGcqhKShQ8" },
  { title: "And Can It Be", url: "https://youtu.be/sQeIGbKqiw8" },
  { title: "Rock of Ages", url: "https://youtu.be/CLuuhNkPF-4" },
  { title: "The King of Love My Shepherd Is", url: "https://youtu.be/WLdPoQnylnA" },
  { title: "This Is My Father’s World", url: "https://youtu.be/EMAsxu_HwaA" },
  { title: "All Creatures of Our God and King", url: "https://youtu.be/ReuzmyzKsUw" },
  { title: "Joyful Joyful We Adore Thee", url: "https://youtu.be/cHaiPTpK4RI" },
  { title: "Fairest Lord Jesus", url: "https://youtu.be/DY7HjUxGS6U" },
  { title: "To God Be the Glory", url: "https://youtu.be/-15v9iworAU" },
  { title: "Blessed Assurance", url: "https://youtu.be/MUb-bSva-o4" },
  { title: "I Stand Amazed in the Presence", url: "https://youtu.be/Ou1AfpGUlu8" },
  { title: "Jesus Paid It All", url: "https://youtu.be/YPYn7CErBpM" },
  { title: "Rejoice the Lord Is King", url: "https://youtu.be/AhEUCSzaU8M" },
  { title: "Guide Me O Thou Great Redeemer", url: "https://youtu.be/5j48TLIRb4Q" },
  { title: "Be Still My Soul", url: "https://youtu.be/QYbX9wmQTlI" }
];

const contemporarySongs = [
  { title: "Living Hope", url: "https://youtu.be/ifFovH-dhHw" },
  { title: "Holy Forever", url: "https://youtu.be/IkHgxKemCRk" },
  { title: "Great Are You Lord", url: "https://youtu.be/3jCnAAeEJSQ" },
  { title: "This I Believe (The Creed)", url: "https://youtu.be/nNiYUPsHgls" },
  { title: "10,000 Reasons", url: "https://youtu.be/DXDGE_lRI0E" },
  { title: "How Great Is Our God", url: "https://youtu.be/KBD18rsVJHk" },
  { title: "What a Beautiful Name", url: "https://youtu.be/r5L6QlAH3L4" },
  { title: "Oceans", url: "https://youtu.be/dy9nwe9_xzw" },
  { title: "The Blessing", url: "https://youtu.be/jiko8DSRMZI" },
  { title: "Way Maker", url: "https://youtu.be/q8IlqzROqTY" },
  { title: "Gratitude", url: "https://youtu.be/dQdfs5S6jyA" },
  { title: "Battle Belongs", url: "https://youtu.be/johgSkNj3-A" },
  { title: "This Is Our God", url: "https://youtu.be/lC_eI8B1qGI" },
  { title: "Faithful One", url: "https://youtu.be/8lhLiLXS5qQ" },
  { title: "Trust in God", url: "https://youtu.be/iJE4yahElBQ" },
  { title: "Refiner's Fire", url: "https://youtu.be/rII4UzVTuQo" },
  { title: "See a Victory", url: "https://youtu.be/jEK6_rz26z0" },
  { title: "Sovereign Over Us", url: "https://youtu.be/Lay-r2g52SQ" },
  { title: "Goodness of God", url: "https://youtu.be/IvSuGyJQ6oM" },
  { title: "Lion and the Lamb", url: "https://youtu.be/q1SXPODm0uE" },
  { title: "No Longer Slaves", url: "https://youtu.be/f8TkUMJtK5k" },
  { title: "Forever", url: "https://youtu.be/HKzS4SjBeb8" },
  { title: "Jesus Messiah", url: "https://youtu.be/tdxSC1tHJn0" },
  { title: "The Lord Almighty Reigns (Psalm 93)", url: "https://youtu.be/YfG0Efz49VU" },
  { title: "Revelation Song", url: "https://youtu.be/7we9YBUAvb4" }
];
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

function openModal(title, content) {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";

  const modal = document.createElement("div");
  modal.className = "modal";

  modal.innerHTML = `
    <button class="modal-close">&times;</button>
    <h3>${title}</h3>
    ${content}
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  
// 👇 NEW: click outside to close
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) {
    close();
  }
});
  // ✨ fade IN
  setTimeout(() => {
    overlay.classList.add("show");
    modal.classList.add("show");
  }, 10);

  // ✨ close with fade OUT
  function close() {
    overlay.classList.remove("show");
    modal.classList.remove("show");

    setTimeout(() => {
      overlay.remove();
    }, 200);
  }

  overlay.querySelector('.modal-close')
    .addEventListener('click', close);
}

  function escListener(e) {
    if (e.key === 'Escape') close();
  }

  document.addEventListener('keydown', escListener);


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
  const footerHtml = `
  <p style="text-align:center; margin-top:1rem;">
    Let reflection give way to thanks and worship.
  </p>

  <p style="text-align:center; margin-top:1rem;">
    When you're ready, choose a hymn or song as a response of worship.
  </p>

  <div class="reflection-actions">
  <button class="reflection-btn" onclick="playRandomSong(classicSongs)">
    🎼 Listen to a classic hymn
  </button>
  <button class="reflection-btn" onclick="playRandomSong(contemporarySongs)">
    🎧 Listen to a contemporary worship song
  </button>
</div>
`;

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

function getYouTubeId(url) {
  const regExp = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

function playSong(song) {
  const videoId = getYouTubeId(song.url);

  if (!videoId) {
    window.open(song.url, "_blank");
    return;
  }

  openModal(
    song.title,
    `
    <p style="margin-bottom:1rem;">
      As you listen, consider which of God's attributes are reflected here.
    </p>

    <div style="position:relative;padding-bottom:56.25%;height:0;">
      <iframe 
        src="https://www.youtube.com/embed/${videoId}"
        style="position:absolute;top:0;left:0;width:100%;height:100%;"
        frameborder="0"
        allow="autoplay; encrypted-media"
        allowfullscreen>
      </iframe>
    </div>

    <p style="margin-top:1rem;">
      <a href="${song.url}" target="_blank">Open in YouTube</a>
    </p>
    `
  );
}

function playRandomSong(list) {
  const song = list[Math.floor(Math.random() * list.length)];
  playSong(song);
}