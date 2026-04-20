'use strict';

/* ═══════════════════════════════════════
   STATE
═══════════════════════════════════════ */
let selectedGender = 'Pria';

const DIET_IDS  = ['d0','d1','d2','d3','d4'];
const KURUS_IDS = ['k0','k1','k2','k3','k4'];

/* ═══════════════════════════════════════
   STAGE 1 → STAGE 2  (animasi timbangan)
═══════════════════════════════════════ */
document.getElementById('startBtn').addEventListener('click', function () {
  document.getElementById('needle').classList.add('needle-go');
  document.getElementById('personSvg').classList.add('person-go');

  setTimeout(() => {
    document.getElementById('scaleStage').style.display = 'none';
    const fs = document.getElementById('formStage');
    fs.style.display = 'flex';
    fs.classList.add('fade-in');
  }, 2050);
});

/* ═══════════════════════════════════════
   GENDER SELECTION
═══════════════════════════════════════ */
function selectGender(g) {
  selectedGender = g;
  document.getElementById('gPria').classList.toggle('active', g === 'Pria');
  document.getElementById('gWanita').classList.toggle('active', g === 'Wanita');
}

/* ═══════════════════════════════════════
   CALCULATE BMI
   Kategori (standar Asia + WHO Ob III):
     < 18.5          → Kurus
     18.5 – 22.9     → Normal
     23.0 – 24.9     → Berlebih
     25.0 – 29.9     → Obesitas I
     30.0 – 39.9     → Obesitas II
     ≥ 40            → Obesitas III
═══════════════════════════════════════ */
function calcBMI() {
  const w = parseFloat(document.getElementById('weight').value);
  const h = parseFloat(document.getElementById('height').value);

  if (!w || !h || w < 20 || h < 50) {
    alert('Mohon isi berat dan tinggi badan dengan benar ya!');
    return;
  }

  const hm       = h / 100;
  const bmi      = w / (hm * hm);
  const minIdeal = (18.5 * hm * hm).toFixed(1);
  const maxIdeal = (22.9 * hm * hm).toFixed(1);

  let category, cls, msg, indIdx;

  if (bmi < 18.5) {
    category = '🌡️ Kurus';
    cls      = 'cat-kurus';
    indIdx   = 0;
    msg      = `Berat badan kamu kurang dari batas normal. Berat badan ideal kamu adalah ${minIdeal} kg sampai ${maxIdeal} kg. Kondisi ini berisiko menyebabkan kurang gizi, daya tahan tubuh menurun, dan kepadatan tulang yang tidak optimal.`;

  } else if (bmi < 23) {
    category = '✅ Normal';
    cls      = 'cat-normal';
    indIdx   = 1;
    msg      = `Berat badan kamu berada di rentang normal dan ideal. Pertahankan pola makan sehat dan gaya hidup aktif yang sudah kamu jalani!`;

  } else if (bmi < 25) {
    category = '⚠️ Berlebih';
    cls      = 'cat-over';
    indIdx   = 2;
    msg      = `Berat badan kamu sedikit di atas batas normal (overweight). Berat badan ideal kamu adalah ${minIdeal} kg sampai ${maxIdeal} kg. Hati-hati, kondisi ini meningkatkan risiko tekanan darah tinggi, kolesterol tinggi, dan diabetes.`;

  } else if (bmi < 30) {
    category = '🚨 Obesitas Tingkat I';
    cls      = 'cat-ob1';
    indIdx   = 3;
    msg      = `Berat badan kamu masuk kategori obesitas tingkat I. Berat badan ideal kamu adalah ${minIdeal} kg sampai ${maxIdeal} kg. Kondisi ini berisiko menimbulkan diabetes, penyakit jantung, dan gangguan pernapasan. Segera mulai program penurunan berat badan yang terencana.`;

  } else if (bmi < 40) {
    category = '🆘 Obesitas Tingkat II';
    cls      = 'cat-ob2';
    indIdx   = 4;
    msg      = `Berat badan kamu masuk kategori obesitas tingkat II. Berat badan ideal kamu adalah ${minIdeal} kg sampai ${maxIdeal} kg. Risiko kesehatan sangat tinggi, meliputi diabetes, penyakit jantung, dan gangguan pernapasan berat. Segera konsultasikan dengan dokter dan mulailah program penurunan berat badan.`;

  } else {
    category = '🆘 Obesitas Tingkat III';
    cls      = 'cat-ob3';
    indIdx   = 5;
    msg      = `Berat badan kamu masuk kategori obesitas tingkat III (morbid obesity). Berat badan ideal kamu adalah ${minIdeal} kg sampai ${maxIdeal} kg. Ini adalah kondisi medis serius dengan risiko sangat tinggi terhadap penyakit jantung, diabetes tipe 2, stroke, sleep apnea, dan berbagai komplikasi lainnya. Segera konsultasikan dengan dokter spesialis untuk penanganan medis yang tepat.`;
  }

  /* ── peringatan mendekati batas ── */
  const bmiR         = Math.round(bmi * 10) / 10;
  const borderWarnEl = document.getElementById('borderWarning');
  let   borderMsg    = '';

  if (bmiR >= 19 && bmiR <= 20 && bmi < 23) {
    borderMsg = '⚠️ Hati-hati: BMI kamu mendekati batas bawah (kurus). Jaga asupan nutrisimu!';
  } else if (bmiR >= 23.5 && bmiR <= 24.5 && bmi < 25) {
    borderMsg = '⚠️ Hati-hati: BMI kamu mendekati batas berlebih. Perhatikan pola makanmu!';
  }

  if (borderMsg) {
    borderWarnEl.textContent   = borderMsg;
    borderWarnEl.style.display = 'block';
  } else {
    borderWarnEl.style.display = 'none';
  }

  /* ── update kartu hasil ── */
  document.getElementById('resultBmiNum').textContent   = bmi.toFixed(1);
  document.getElementById('resultCategory').textContent = category;
  document.getElementById('resultMsg').textContent      = msg;
  document.getElementById('resultCard').className       = 'result-card ' + cls;

  /* ── indikator posisi pada ruler (6 titik) ── */
  for (let i = 0; i < 6; i++) {
    const ind = document.getElementById('ind' + i);
    if (!ind) continue;
    ind.style.background = i === indIdx ? '#1e1b4b' : '#fff';
    ind.style.transform  = i === indIdx ? 'scale(1.6)' : 'scale(1)';
  }

  /* ── tampilkan panel kanan yang sesuai ── */
  document.getElementById('tipsDiet').style.display   = 'none';
  document.getElementById('tipsKurus').style.display  = 'none';
  document.getElementById('tipsNormal').style.display = 'none';

  if (bmi < 18.5) {
    document.getElementById('tipsKurus').style.display  = 'block';
  } else if (bmi < 23) {
    document.getElementById('tipsNormal').style.display = 'block';
  } else {
    /* berlebih, ob I, ob II, ob III → tampilkan tips diet */
    document.getElementById('tipsDiet').style.display   = 'block';
  }

  /* ── transisi ke stage hasil ── */
  document.getElementById('formStage').style.display = 'none';
  const rs = document.getElementById('resultStage');
  rs.style.display = 'grid';
  rs.classList.add('fade-in');
}

/* ═══════════════════════════════════════
   TOGGLE ACCORDION
   Prefix 'd' → tips diet (dc / dbd)
   Prefix 'k' → tips kurus (tk / dbk)
═══════════════════════════════════════ */
function toggleTip(id) {
  const prefix = id[0];
  const num    = id.slice(1);
  const cardId = prefix === 'd' ? 'dc'  + num : 'tk'  + num;
  const bodyId = prefix === 'd' ? 'dbd' + num : 'dbk' + num;

  const card   = document.getElementById(cardId);
  const body   = document.getElementById(bodyId);
  const isOpen = card.classList.contains('open');

  /* tutup semua dalam grup yang sama */
  const group = prefix === 'd' ? DIET_IDS : KURUS_IDS;
  group.forEach(gid => {
    const gNum  = gid.slice(1);
    const gCard = document.getElementById(prefix === 'd' ? 'dc'  + gNum : 'tk'  + gNum);
    const gBody = document.getElementById(prefix === 'd' ? 'dbd' + gNum : 'dbk' + gNum);
    if (gCard) gCard.classList.remove('open');
    if (gBody) gBody.classList.remove('show');
  });

  if (!isOpen) {
    card.classList.add('open');
    body.classList.add('show');
  }
}

/* ═══════════════════════════════════════
   RESET
═══════════════════════════════════════ */
function resetAll() {
  document.getElementById('weight').value = '';
  document.getElementById('height').value = '';
  selectedGender = 'Pria';
  selectGender('Pria');

  /* tutup semua accordion */
  [...DIET_IDS, ...KURUS_IDS].forEach(id => {
    const prefix = id[0];
    const num    = id.slice(1);
    const card   = document.getElementById(prefix === 'd' ? 'dc'  + num : 'tk'  + num);
    const body   = document.getElementById(prefix === 'd' ? 'dbd' + num : 'dbk' + num);
    if (card) card.classList.remove('open');
    if (body) body.classList.remove('show');
  });

  document.getElementById('resultStage').style.display = 'none';
  document.getElementById('formStage').style.display   = 'none';

  const ss = document.getElementById('scaleStage');
  ss.style.display = 'flex';

  /* reset animasi jarum */
  const needle = document.getElementById('needle');
  needle.classList.remove('needle-go');
  void needle.offsetWidth;
  document.getElementById('personSvg').classList.remove('person-go');
}
