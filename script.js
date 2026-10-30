const WA_PHONE = '6281315354397';

const nameCard = document.getElementById('nameCard');
const apologyCard = document.getElementById('apologyCard');
const treatCard = document.getElementById('treatCard');
const dealCard = document.getElementById('dealCard');

const nicknameInput = document.getElementById('nickname');
const submitName = document.getElementById('submitName');

const apologyTitle = document.getElementById('apologyTitle');
const apologyText = document.getElementById('apologyText');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');

const treatGreeting = document.getElementById('treatGreeting');
const popup = document.getElementById('popup');
const popupTitle = document.getElementById('popupTitle');
const popupMsg = document.getElementById('popupMsg');
const heartsContainer = document.getElementById('hearts');

const treatItems = document.querySelectorAll('.treat-item');
const chosenTreatText = document.getElementById('chosenTreatText');
const waSendBtn = document.getElementById('waSendBtn');
const redirectTimerText = document.getElementById('redirectTimerText');
const restartBtn = document.getElementById('restartBtn');

let noScale = 1.0;
let yesScale = 1.0;
let noClickCount = 0;
let nickname = 'Sayang';
let redirectTimeout = null;

const noPhrases = [
  "Enggak 🙁",
  "Beneran gamau? 🥺",
  "Aku tau kamu maunya apinya nyala lagi 😭",
  "Kita nyalain lagi dari awal yaa? 🥺",
  "Aku beliin cireng beneran sumpah 🥟",
  "Jangan ngambek dong ayang 🤍",
  "Masa tega sama aku? 🥺",
  "Pencet yang kiri aja yaa 🤍",
  "Maafin aku plisss 🥺🙏"
];

// Step 1: Input Nickname Validation & Next
function proceedToApology() {
  const entered = nicknameInput.value.trim();
  
  if (!entered) {
    nicknameInput.classList.add('shake');
    setTimeout(() => nicknameInput.classList.remove('shake'), 400);
    alert('Isi dulu nama panggilan kesayangan kamu dong 🥺🤍');
    nicknameInput.focus();
    return;
  }

  nickname = entered;

  nameCard.style.display = 'none';
  apologyCard.style.display = 'block';

  apologyTitle.textContent = `${nickname}, maafin aku ya 🥺`;
  apologyText.innerHTML = `
    Aku bener-bener minta maaf soal api TikTok kita <b>628 hari</b> yang mati tadi malem... 😭🔥<br><br>
    Apinya gak bisa di-restore lagi padahal kamu maunya tetep nyala... Sumpah aku nyesel banget.<br><br>
    Jangan ngambek lagi yaa, ${nickname}? Maafin aku yaa? 🤍
  `;
}

submitName.addEventListener('click', proceedToApology);

nicknameInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    proceedToApology();
  }
});

// Step 2: "Enggak" button shrinks & changes text
noBtn.addEventListener('click', () => {
  noClickCount++;
  noScale -= 0.12;
  if (noScale < 0.25) noScale = 0.25;

  yesScale += 0.15;
  if (yesScale > 1.8) yesScale = 1.8;

  noBtn.style.transform = `scale(${noScale})`;
  yesBtn.style.transform = `scale(${yesScale})`;

  const phraseIndex = noClickCount % noPhrases.length;
  noBtn.textContent = noPhrases[phraseIndex];
});

// Step 2: "Maafin" clicked
yesBtn.addEventListener('click', () => {
  popup.classList.add('active');
  popupTitle.textContent = `Makasih ya, ${nickname}! 🤍`;
  popupMsg.textContent = `Aku janji kita bakal nyalain api TikTok baru & gak bakal teledor lagi! ✨`;
  generateHearts();

  setTimeout(() => {
    popup.classList.remove('active');
    apologyCard.style.display = 'none';
    treatCard.style.display = 'block';

    treatGreeting.textContent = `Makasih, ${nickname} 🥰`;

    // Reset scales
    noScale = 1.0;
    yesScale = 1.0;
    noBtn.style.transform = 'scale(1)';
    yesBtn.style.transform = 'scale(1)';
    noBtn.textContent = noPhrases[0];
  }, 1800);
});

// Step 3: Choose Treat & Prepare WhatsApp Redirect
treatItems.forEach((item) => {
  item.addEventListener('click', () => {
    const treat = item.getAttribute('data-treat');
    chosenTreatText.textContent = treat;

    // Pop up modal konfirmasi iOS saat diklik
    popup.classList.add('active');
    popupTitle.textContent = `Deal ya, ${nickname}! 🥰`;
    popupMsg.textContent = `Pilihan kamu: ${treat}`;
    generateHearts();

    // Construct WhatsApp message & URL
    const waMessage = 
`Pokoknya kamu harus tanggung jawab yaa! 😤

Api TikTok 628 hari mati tadi malem gara-gara kamu teledor, mana gak bisa di-restore lagi padahal aku maunya nyala terus! 😭💔

Sesuai janji kamu di web tadi, aku tagih traktiran damai:
👉 *${treat}*

Awas aja kalau gak dibeliin sekarang! 😠💨`;

    const waUrl = `https://api.whatsapp.com/send?phone=${WA_PHONE}&text=${encodeURIComponent(waMessage)}`;
    waSendBtn.href = waUrl;

    setTimeout(() => {
      popup.classList.remove('active');
      treatCard.style.display = 'none';
      dealCard.style.display = 'block';
      generateHearts();

      // Countdown and auto-redirect to WA
      let countdown = 2;
      redirectTimerText.textContent = `Membuka WhatsApp otomatis dalam ${countdown} detik...`;

      if (redirectTimeout) clearInterval(redirectTimeout);

      const timerInterval = setInterval(() => {
        countdown--;
        if (countdown > 0) {
          redirectTimerText.textContent = `Membuka WhatsApp otomatis dalam ${countdown} detik...`;
        } else {
          clearInterval(timerInterval);
          redirectTimerText.textContent = `Mengalihkan ke WhatsApp...`;
          window.location.href = waUrl;
        }
      }, 1000);
    }, 1200);
  });
});

// If user clicks the WA button directly
waSendBtn.addEventListener('click', () => {
  redirectTimerText.textContent = `Membuka WhatsApp...`;
});

// Restart button
restartBtn.addEventListener('click', () => {
  dealCard.style.display = 'none';
  nameCard.style.display = 'block';
  noClickCount = 0;
  noScale = 1.0;
  yesScale = 1.0;
  noBtn.textContent = noPhrases[0];
  noBtn.style.transform = 'scale(1)';
  yesBtn.style.transform = 'scale(1)';
});

function generateHearts() {
  for (let i = 0; i < 14; i++) {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.style.left = `${Math.random() * 100 - 50}px`;
    heart.style.top = `${Math.random() * 30 - 15}px`;
    heart.style.animationDelay = `${Math.random() * 0.2}s`;
    heartsContainer.appendChild(heart);
    setTimeout(() => heart.remove(), 1600);
  }
}
