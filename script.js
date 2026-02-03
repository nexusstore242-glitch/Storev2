/* =======================================================
   NEXUS CORE SYSTEM V.8.5 (FULL PREMIUM FEATURES)
   Code Updated: Fix APK Rendering & Transaction Logic
   ======================================================= */

// --- [1] KONFIGURASI UTAMA ---
const CONFIG = {
    adminWA: "6283125398104", // Ganti Nomor WA Admin
    minDeposit: 10000,
    qrisFile: "assets/qris.png"
};

// --- [2] DATABASE PRODUK APK PREMIUM ---
const apkData = [
    // STREAMING
    { main: "Netflix Premium", logo: "assets/netflix.png", varian: [{ name: "Netflix Sharing 1P1U", price: 22000 }, { name: "Netflix Sharing 1P2U", price: 20000 }, { name: "Netflix Semi-Private", price: 30000 }] },
    { main: "Viu Premium", logo: "assets/viu.png", varian: [{ name: "Viu Anti Limit 6 Bulan", price: 5000 }, { name: "Viu Anti Limit 1 Tahun", price: 8000 }, { name: "Viu Anti Limit Lifetime", price: 12000 }] },
    { main: "WeTV VIP", logo: "assets/wetv.png", varian: [{ name: "WeTV Sharing 1 Bulan", price: 7000 }, { name: "WeTV Sharing TV", price: 10000 }, { name: "WeTV Private 1 Bulan", price: 32000 }] },
    { main: "iQIYI Premium", logo: "assets/iqiyi.png", varian: [{ name: "iQIYI Sharing 3 Bulan", price: 7000 }, { name: "iQIYI Sharing 1 Tahun", price: 12000 }] },
    { main: "Bstation / Bilibili", logo: "assets/bstation.png", varian: [{ name: "Bstation Sharing 3 Bulan", price: 7000 }, { name: "Bstation Sharing 1 Tahun", price: 12000 }] },
    { main: "Loklok", logo: "assets/loklok.png", varian: [{ name: "Loklok Sharing 1 Bulan", price: 18000 }, { name: "Loklok Sharing Basic", price: 15000 }] },
    { main: "Amazon Prime", logo: "assets/amazonprime.png", varian: [{ name: "Prime Sharing 1 Bulan", price: 6000 }, { name: "Prime Private 1 Bulan", price: 15000 }] },
    { main: "HBO Go Max", logo: "assets/hbogo.png", varian: [{ name: "HBO Go Sharing 1 Bulan", price: 12000 }] },
    { main: "Vidio Platinum", logo: "assets/vidio.png", varian: [{ name: "Vidio Mobile Sharing", price: 13000 }, { name: "Vidio Mobile Private", price: 25000 }, { name: "Vidio All Device Sharing", price: 18000 }] },
    
    // MUSIK
    { main: "Spotify Premium", logo: "assets/spotify.png", varian: [{ name: "Spotify Famplan 1 Bln", price: 17500 }, { name: "Spotify Famplan 2 Bln", price: 32000 }] },
    { main: "Youtube Premium", logo: "assets/youtube.png", varian: [{ name: "Youtube Family Plan", price: 4000 }, { name: "Youtube Individual", price: 9000 }, { name: "Youtube Indiv 3 Bulan", price: 25000 }] },

    // DESIGN & EDITING
    { main: "Canva Pro", logo: "assets/canva.png", varian: [{ name: "Canva Member 1 Bulan", price: 2000 }, { name: "Canva Designer 1 Bulan", price: 3000 }, { name: "Canva Lifetime", price: 9000 }, { name: "Canva Owner (Seller)", price: 8000 }] },
    { main: "CapCut Pro", logo: "assets/capcut.png", varian: [{ name: "CapCut Sharing 1 Bulan", price: 6000 }, { name: "CapCut Private 1 Bulan", price: 10000 }, { name: "CapCut Sharing 14 Hari", price: 3000 }, { name: "CapCut Private 14 Hari", price: 6000 }] },
    { main: "Alight Motion", logo: "assets/alightmotion.png", varian: [{ name: "AM Sharing 1 Tahun", price: 3000 }, { name: "AM Private 1 Tahun", price: 5000 }] },
    { main: "Picsart Gold", logo: "assets/picsart.png", varian: [{ name: "Picsart Sharing 1 Bulan", price: 3000 }, { name: "Picsart Private 1 Bulan", price: 6000 }] },
    { main: "Meitu VIP", logo: "assets/meitu.png", varian: [{ name: "Meitu Sharing 1 Bulan", price: 15000 }] },

    // PRODUCTIVITY & AI
    { main: "Scribd", logo: "assets/scribd.png", varian: [{ name: "Scribd Private 30 Hari", price: 6000 }, { name: "Scribd Private 60 Hari", price: 9000 }] },
    { main: "Wattpad Premium", logo: "assets/wattpad.png", varian: [{ name: "Wattpad Sharing 1 Bulan", price: 6000 }, { name: "Wattpad Sharing 1 Tahun", price: 12000 }] },
    { main: "ChatGPT Plus", logo: "assets/chatgpt.png", varian: [{ name: "ChatGPT Sharing 1 Bulan", price: 15000 }, { name: "ChatGPT Private 1 Bulan", price: 40000 }] },
    { main: "Zoom Workplace", logo: "assets/zoom.png", varian: [{ name: "Zoom Private 7 Hari", price: 5000 }, { name: "Zoom Private 14 Hari", price: 8000 }] },

    // BUNDLE
    { main: "Paket Bundle Hemat", logo: "assets/bundle.png", varian: [{ name: "Creator Pack (Canva+CapCut+AM)", price: 15000 }, { name: "AI Pack (ChatGPT+Canva)", price: 17000 }, { name: "Streamer Pack (Netflix+Spotify)", price: 38000 }, { name: "Student Pack (Canva+Scribd)", price: 7000 }] }
];

// --- [3] STATE MANAGEMENT ---
let currentUser = null;
let currentBalance = 0;
let transactionHistory = [];
let currentSosmedMode = 'FOLLOWERS'; 

let pendingOrder = null;       
let selectedGameName = "";     
let selectedGamePrice = 0;     

// --- [4] INISIALISASI ---
document.addEventListener("DOMContentLoaded", () => {
    checkSession();
    setupBannerAutoSlide();
});

function checkSession() {
    const savedUser = localStorage.getItem("nexus_user");
    if (savedUser) {
        currentUser = savedUser;
        currentBalance = parseInt(localStorage.getItem("nexus_balance")) || 0;
        const hist = localStorage.getItem("nexus_history");
        if(hist) transactionHistory = JSON.parse(hist);

        updateUI();
        document.getElementById("auth-screen").style.display = "none";
        document.getElementById("main-interface").style.display = "block";
    } else {
        document.getElementById("auth-screen").style.display = "flex";
    }
}

// --- [5] AUTH ---
function registerUser() {
    const user = document.getElementById("reg-username").value.trim();
    const pin = document.getElementById("reg-pin").value.trim();
    if (user.length < 3 || pin.length < 4) return Swal.fire('Gagal', 'Data tidak valid!', 'error');

    localStorage.setItem("nexus_user", user);
    localStorage.setItem("nexus_pin", pin);
    localStorage.setItem("nexus_balance", 0);
    location.reload();
}

function logout() {
    Swal.fire({ title: 'Logout?', icon: 'warning', showCancelButton: true, confirmButtonText: 'Ya', background: '#111', color: '#fff' })
        .then((r) => { if(r.isConfirmed) { localStorage.removeItem("nexus_user"); location.reload(); }});
}

// --- [6] NAVIGASI ---
function showPage(pageId) {
    if (pageId !== 'store') closeMarketView();
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active-page'));
    const target = document.getElementById(pageId);
    if(target) target.classList.add('active-page');
    
    document.querySelectorAll('.c-nav').forEach(n => n.classList.remove('active'));
    const navMap = { 'home': 0, 'store': 1, 'deposit': 2, 'freelance': 3, 'history': 4 };
    if(navMap[pageId] !== undefined) document.querySelectorAll('.c-nav')[navMap[pageId]].classList.add('active');

    const sb = document.getElementById('sidebar');
    if(sb && sb.classList.contains('open')) toggleSidebar();
}

/* --- UPDATE UI (SINKRONISASI SALDO HEADER & FREELANCE) --- */
function updateUI() {
    // 1. Format Rupiah
    const formattedSaldo = "Rp " + currentBalance.toLocaleString('id-ID');
    
    // 2. Update Saldo di Header & Home
    const balanceIds = ["nav-balance", "home-balance"];
    balanceIds.forEach(id => {
        const el = document.getElementById(id);
        if(el) el.innerText = formattedSaldo;
    });

    // 3. FIX: Update Saldo di Halaman Freelance (Penarikan)
    // Ini yang bikin saldo di freelance jadi sinkron sama header
    const wdDisplay = document.getElementById("wd-balance-display");
    if(wdDisplay) {
        wdDisplay.innerText = formattedSaldo;
    }

    // 4. Update Username
    const userIds = ["nav-username", "sidebar-username"];
    userIds.forEach(id => {
        const el = document.getElementById(id);
        if(el) el.innerText = currentUser;
    });

    // 5. Update PIN di Sidebar
    if(document.getElementById("sidebar-id")) {
        document.getElementById("sidebar-id").innerText = "PIN: " + (localStorage.getItem("nexus_pin") || "****");
    }

    // 6. Render Riwayat
    renderHistory();
}


function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('sidebar-overlay').classList.toggle('show');
}

// --- [7] MARKET & RENDER APK ---

function openMarketView(viewId) {
    document.getElementById('market-menu').style.display = 'none';
    document.querySelectorAll('.market-view').forEach(v => v.style.display = 'none');
    
    const target = document.getElementById(viewId);
    if(target) {
        target.style.display = 'block';
        // OTOMATIS LOAD APK JIKA BUKA MENU PREMIUM
        if (viewId === 'view-apk') renderApkList();
    }
}

function closeMarketView() {
    document.querySelectorAll('.market-view').forEach(v => v.style.display = 'none');
    const menu = document.getElementById('market-menu');
    if(menu) menu.style.display = 'block';
    backToGameSelector();
}

// RENDER DAFTAR APK (PREMIUM)
function renderApkList() {
    const container = document.getElementById("apk-grid-container");
    if (!container) return;
    container.innerHTML = "";

    apkData.forEach((app, index) => {
        const card = document.createElement("div");
        card.className = "prod-card-v2";
        card.onclick = () => openApkVariant(index); // Klik Card buka Modal
        
        card.innerHTML = `
            <img src="${app.logo}" onerror="this.src='https://via.placeholder.com/50?text=APK'">
            <h4>${app.main}</h4>
            <button class="cek-harga-btn">LIHAT HARGA</button>
        `;
        container.appendChild(card);
    });
}

function openApkVariant(index) {
    const app = apkData[index];
    const modal = document.getElementById("variant-modal");
    document.getElementById("modal-apk-title").innerText = app.main.toUpperCase();
    const container = document.getElementById("variant-list-container");
    container.innerHTML = "";

    app.varian.forEach(v => {
        const btn = document.createElement("button");
        btn.className = "cyber-btn-outline"; 
        btn.style.cssText = "width:100%; text-align:left; display:flex; justify-content:space-between; margin-bottom:10px;";
        btn.onclick = () => {
            closeVariantModal();
            buyItem(v.name, v.price);
        };
        btn.innerHTML = `<span>${v.name}</span><strong style="color:var(--red-core);">Rp ${v.price.toLocaleString()}</strong>`;
        container.appendChild(btn);
    });
    modal.style.display = "flex";
}

function closeVariantModal() {
    document.getElementById("variant-modal").style.display = "none";
}

// --- [8] GAME NAVIGASI ---
function openGameProduct(listId) {
    document.getElementById('game-selector').style.display = 'none';
    document.querySelectorAll('.game-product-list').forEach(l => l.style.display = 'none');
    document.getElementById(listId).style.display = 'block';
}

function backToGameSelector() {
    document.querySelectorAll('.game-product-list').forEach(l => l.style.display = 'none');
    const sel = document.getElementById('game-selector');
    if(sel) sel.style.display = 'block';
}

function openStoreTab(category) {
    showPage('store');
    const map = { 'game': 'view-game', 'digital': 'view-pulsa', 'sosmed': 'view-sosmed' };
    if(map[category]) setTimeout(() => openMarketView(map[category]), 100);
}

// --- [9] TRANSAKSI UTAMA ---
function buyItem(itemName, price) {
    // 1. Cek Saldo
    if (currentBalance >= price && price > 0) {
        Swal.fire({
            title: 'Potong Saldo?', text: `Beli ${itemName} seharga Rp ${price.toLocaleString()}?`,
            icon: 'question', showCancelButton: true, confirmButtonText: 'Ya, Beli', cancelButtonText: 'Transfer',
            background: '#111', color: '#fff'
        }).then((res) => {
            if (res.isConfirmed) {
                currentBalance -= price;
                addTransaction(itemName, price, 'out');
                const msg = `*ORDER LUNAS (SALDO)*\nUser: ${currentUser}\nItem: ${itemName}\nStatus: Lunas\n\nProses min!`;
                window.open(`https://wa.me/${CONFIG.adminWA}?text=${encodeURIComponent(msg)}`, '_blank');
            } else {
                checkGameOrInvoice(itemName, price);
            }
        });
    } else {
        checkGameOrInvoice(itemName, price);
    }
}

function checkGameOrInvoice(itemName, price) {
    const games = ["MLBB", "Mobile", "FF", "Free", "HOK", "Roblox", "Akun", "Gmail", "Pubg"];
    if (games.some(g => itemName.includes(g))) {
        selectedGameName = itemName;
        selectedGamePrice = price;
        openTopupModal(itemName);
    } else if (price === 0) {
        const msg = `Halo Admin, cek harga: ${itemName}`;
        window.open(`https://wa.me/${CONFIG.adminWA}?text=${encodeURIComponent(msg)}`, '_blank');
    } else {
        createInvoice(itemName, price, "-");
    }
}

// --- MODAL GAME ID ---
function openTopupModal(gameName) {
    const container = document.getElementById("dynamic-inputs");
    const title = document.getElementById("modal-game-title");
    title.innerText = gameName.toUpperCase(); container.innerHTML = ""; 

    if (gameName.includes("MLBB")) {
        container.innerHTML = `<label style="color:#aaa;font-size:0.8rem">USER ID</label><input type="number" id="inp-id" class="cyber-input"><label style="color:#aaa;font-size:0.8rem">SERVER ID</label><input type="number" id="inp-zone" class="cyber-input">`;
    } else if (gameName.includes("Roblox") || gameName.includes("Akun")) {
        container.innerHTML = `<label style="color:#aaa;font-size:0.8rem">EMAIL/USERNAME</label><input type="text" id="inp-id" class="cyber-input">`;
    } else {
        container.innerHTML = `<label style="color:#aaa;font-size:0.8rem">PLAYER ID</label><input type="number" id="inp-id" class="cyber-input">`;
    }
    document.getElementById("topup-modal").style.display = "flex";
}

function closeTopupModal() { document.getElementById("topup-modal").style.display = "none"; }

function confirmTopupData() {
    const id = document.getElementById("inp-id") ? document.getElementById("inp-id").value : "";
    const zone = document.getElementById("inp-zone") ? document.getElementById("inp-zone").value : "";
    if(!id) return Swal.fire('Data Kosong','Isi ID dulu','warning');
    
    const data = zone ? `${id} (${zone})` : id;
    closeTopupModal();
    createInvoice(selectedGameName, selectedGamePrice, data);
}

// --- INVOICE SYSTEM ---
function createInvoice(item, price, data) {
    pendingOrder = { item, price, data };
    showPage('deposit');
    renderPaymentPage();
}

function renderPaymentPage() {
    const inv = document.getElementById("invoice-area");
    const dep = document.getElementById("deposit-form-area");
    if(pendingOrder) {
        inv.style.display = "block"; dep.style.display = "none";
        document.getElementById("inv-item").innerText = pendingOrder.item;
        document.getElementById("inv-data").innerText = pendingOrder.data;
        document.getElementById("inv-price").innerText = "Rp " + pendingOrder.price.toLocaleString();
    } else {
        inv.style.display = "none"; dep.style.display = "block";
    }
}

function cancelOrder() { pendingOrder = null; renderPaymentPage(); }

function confirmPaymentWA() {
    const user = currentUser || "Guest";
    let msg = "";
    if (pendingOrder) {
        msg = `*STRUK ORDER*%0AUser: ${user}%0AItem: ${pendingOrder.item}%0AData: ${pendingOrder.data}%0AHarga: Rp ${pendingOrder.price.toLocaleString()}%0AStatus: *SUDAH TRANSFER*%0A%0ABukti terlampir 👇`;
    } else {
        const amount = document.getElementById("depo-amount").value;
        if(!amount) return Swal.fire('Error','Isi nominal','error');
        msg = `*DEPOSIT SALDO*%0AUser: ${user}%0ANominal: ${amount}%0AStatus: *SUDAH TRANSFER*%0A%0ABukti terlampir 👇`;
    }
    window.open(`https://wa.me/${CONFIG.adminWA}?text=${msg}`, '_blank');
}

// --- OTHER FEATURES ---
function calcConvert() {
    const sel = document.getElementById('cv-provider');
    const amt = document.getElementById('cv-amount').value;
    const rate = sel.selectedIndex > 0 ? parseFloat(sel.options[sel.selectedIndex].getAttribute('data-rate')) : 0;
    document.getElementById('cv-result').innerText = "Rp " + Math.floor((parseInt(amt)||0)*rate).toLocaleString();
}
function processConvert() {
    const p = document.getElementById('cv-provider').value;
    const a = document.getElementById('cv-amount').value;
    if(!p || !a) return Swal.fire('Error','Lengkapi data','error');
    const msg = `*CONVERT PULSA*%0AProvider: ${p}%0ANominal: ${a}%0A%0AGas min!`;
    window.open(`https://wa.me/${CONFIG.adminWA}?text=${encodeURIComponent(msg)}`, '_blank');
}
function copyText(t) {
    if(navigator.clipboard) navigator.clipboard.writeText(t).then(()=>Swal.fire({icon:'success',title:'TERSALIN',timer:800,showConfirmButton:false,background:'#111',color:'#fff'}));
    else Swal.fire('Error','Copy manual aja','error');
}
function downloadQris() {
    const a = document.createElement('a'); a.href = CONFIG.qrisFile; a.download = 'QRIS.png';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
}
function editProfile() {
    Swal.fire({title:'Ubah Nama',input:'text',inputValue:currentUser,showCancelButton:true,background:'#111',color:'#fff'}).then(r=>{if(r.value){currentUser=r.value;localStorage.setItem("nexus_user",currentUser);updateUI();}});
}
function resetPin() {
    Swal.fire({title:'PIN Baru',input:'number',showCancelButton:true,background:'#111',color:'#fff'}).then(r=>{if(r.value){localStorage.setItem("nexus_pin",r.value);Swal.fire('Sukses','PIN Diganti','success');}});
}
function takeMission(j){ window.open(`https://wa.me/${CONFIG.adminWA}?text=*MISI:* ${j}%0ABukti terlampir`,'_blank'); }
function redeemToken(){
    const t = document.getElementById('token-input').value.trim().toUpperCase();
    if(!t.startsWith("NEXUS-")) return Swal.fire('Gagal','Token salah','error');
    const used = JSON.parse(localStorage.getItem("used_tok")||"[]");
    if(used.includes(t)) return Swal.fire('Gagal','Token hangus','error');
    const r = parseInt(t.split('-')[1]);
    if(!r) return Swal.fire('Error','Token rusak','error');
    currentBalance+=r; used.push(t); localStorage.setItem("used_tok",JSON.stringify(used));
    addTransaction("Klaim Token",r,'in'); Swal.fire('Sukses',`+Rp ${r}`,'success');
}
function withdrawBalance(){
    Swal.fire({title:'Tarik Saldo',input:'number',text:`Saldo: ${currentBalance}`,showCancelButton:true,background:'#111',color:'#fff'}).then(r=>{
        if(r.value && r.value<=currentBalance){currentBalance-=r.value; addTransaction("WD Saldo",r.value,'out'); window.open(`https://wa.me/${CONFIG.adminWA}?text=*WD SALDO:* ${r.value}`,'_blank');}
    });
}
function addTransaction(d,a,t){transactionHistory.unshift({desc:d,amount:a,type:t,date:new Date().toLocaleDateString()});saveData();updateUI();}
function saveData(){localStorage.setItem("nexus_balance",currentBalance);localStorage.setItem("nexus_history",JSON.stringify(transactionHistory));}
function renderHistory(){const l=document.getElementById("history-list");if(l){l.innerHTML=transactionHistory.map(i=>`<li style="padding:10px;border-bottom:1px solid #222;display:flex;justify-content:space-between;color:#ccc"><span>${i.desc}<br><small>${i.date}</small></span><span style="color:${i.type=='in'?'#0f0':'#f00'}">${i.type=='in'?'+':'-'} ${i.amount}</span></li>`).join('');}}
function setupBannerAutoSlide(){const w=document.querySelector('.banner-wrapper');if(w) setInterval(()=>{w.scrollBy({left:w.offsetWidth,behavior:'smooth'}); if(w.scrollLeft+w.offsetWidth>=w.scrollWidth)w.scrollTo(0,0);},3000);}
function setSosmedMode(m){currentSosmedMode=m;document.getElementById('sm-fol').classList.remove('active');document.getElementById('sm-like').classList.remove('active');if(m=='followers')document.getElementById('sm-fol').classList.add('active');else document.getElementById('sm-like').classList.add('active');}
function buySosmed(p){Swal.fire({title:`${p} ${currentSosmedMode}`,input:'text',text:'Link:',showCancelButton:true,background:'#111',color:'#fff'}).then(r=>{if(r.value)createInvoice(`${p} ${currentSosmedMode}`,0,r.value)});}
/* --- [A] DATABASE SOSMED (MASUKKAN DI BAGIAN ATAS SCRIPT.JS) --- */

const sosmedDB = {
    'ig': [
        { name: "IG Followers Luar", price: 35, min: 100, logo: "assets/igfol.png" },
        { name: "IG Followers Indo 🇮🇩", price: 75, min: 100, logo: "assets/igfol.png" },
        { name: "IG Like Indo 🇮🇩", price: 80, min: 50, logo: "assets/igfol.png" },
        { name: "IG Like Bule", price: 2, min: 100, logo: "assets/igfol.png" }
    ],
    'tw': [
        { name: "Twitter Followers (Garansi)", price: 18, min: 50, logo: "assets/twitter.png" },
        { name: "Twitter Followers (Non Grnsi)", price: 6, min: 50, logo: "assets/twitter.png" },
        { name: "Twitter Likes (Garansi)", price: 25, min: 50, logo: "assets/twitter.png" },
        { name: "Twitter Likes (Non Grnsi)", price: 5, min: 50, logo: "assets/twitter.png" }
    ],
    'tt': [
        { name: "TikTok Follow Bule (Garansi)", price: 40, min: 50, logo: "assets/tikfol.png" },
        { name: "TikTok Follow Bule (Non Grnsi)", price: 6, min: 50, logo: "assets/tikfol.png" },
        { name: "TikTok Follow Indo 🇮🇩", price: 120, min: 50, logo: "assets/tikfol.png" },
        { name: "TikTok Like Indo 🇮🇩", price: 60, min: 50, logo: "assets/tikfol.png" },
        { name: "TikTok Save Indo 🇮🇩", price: 65, min: 50, logo: "assets/tikfol.png" },
        { name: "TikTok Views", price: 15, min: 500, logo: "assets/tikfol.png" } // Asumsi harga views biasanya per 1000, tapi disini saya ikut data kamu (15/pcs mahal, mungkin 15 rupiah per view?)
    ],
    'fb': [
        { name: "FB Profile Follow (Non Grnsi)", price: 13, min: 50, logo: "assets/facebook.png" },
        { name: "FB Profile Follow (Garansi)", price: 8, min: 50, logo: "assets/facebook.png" },
        { name: "FB Group Member", price: 10, min: 100, logo: "assets/facebook.png" },
        { name: "FB Post Likes", price: 18, min: 50, logo: "assets/facebook.png" },
        { name: "FB React Love ❤️", price: 28, min: 50, logo: "assets/facebook.png" }
    ]
};

// Variable Temp untuk Sosmed
let selectedSosmedService = null;


/* --- [B] LOGIKA RENDER & CALCULATOR SOSMED (MASUKKAN DI BAWAH) --- */

// 1. Buka List Layanan (IG/TT/dll)
function openSosmedServices(type) {
    document.getElementById('sosmed-platform-list').style.display = 'none';
    document.getElementById('sosmed-service-container').style.display = 'block';
    
    const container = document.getElementById('sosmed-grid');
    container.innerHTML = ""; // Bersihkan
    
    // Ambil Data
    const list = sosmedDB[type];
    
    // Render Card
    list.forEach(item => {
        const card = document.createElement("div");
        card.className = "prod-card-v2";
        // Simpan data item ke tombol biar bisa diambil pas klik
        card.onclick = () => openSosmedModal(item);
        
        card.innerHTML = `
            <img src="${item.logo}" onerror="this.src='https://via.placeholder.com/50'">
            <h4 style="font-size:0.8rem; height:40px; overflow:hidden;">${item.name}</h4>
            <p style="color:#888; font-size:0.7rem;">Min: ${item.min}</p>
            <button class="cek-harga-btn">Rp ${item.price} / pcs</button>
        `;
        container.appendChild(card);
    });
}

function backToSosmedMenu() {
    document.getElementById('sosmed-service-container').style.display = 'none';
    document.getElementById('sosmed-platform-list').style.display = 'block';
}

// 2. Buka Modal Calculator
function openSosmedModal(item) {
    selectedSosmedService = item;
    
    document.getElementById('sm-modal-title').innerText = item.name;
    document.getElementById('sm-min-label').innerText = item.min;
    document.getElementById('sm-unit-price').innerText = item.price;
    document.getElementById('sm-qty').value = "";
    document.getElementById('sm-target').value = "";
    document.getElementById('sm-total-display').innerText = "Rp 0";
    
    document.getElementById('sosmed-modal').style.display = 'flex';
}

function closeSosmedModal() {
    document.getElementById('sosmed-modal').style.display = 'none';
}

// 3. Hitung Otomatis (Realtime)
// 3. Hitung Otomatis & Validasi Visual (Realtime)
function calcSosmedTotal() {
    const qtyInput = document.getElementById('sm-qty');
    const warningText = document.getElementById('sm-qty-warning');
    const displayTotal = document.getElementById('sm-total-display');
    
    // Ambil nilai
    let qty = parseInt(qtyInput.value);
    
    // Cegah NaN (Not a Number)
    if (isNaN(qty)) qty = 0;

    const price = selectedSosmedService.price;
    const minOrder = selectedSosmedService.min;

    // --- LOGIKA VALIDASI CSS ---
    // Jika qty diisi TAPI kurang dari minimal, kasih warna merah
    if (qty > 0 && qty < minOrder) {
        qtyInput.classList.add('input-error'); // Tambah class merah
        warningText.style.display = 'block';   // Munculkan teks peringatan
        warningText.innerText = `⚠️ Minimal order untuk layanan ini: ${minOrder} pcs`;
    } else {
        qtyInput.classList.remove('input-error'); // Hapus merah
        warningText.style.display = 'none';       // Sembunyikan peringatan
    }

    // Hitung Total
    const total = qty * price;
    displayTotal.innerText = "Rp " + total.toLocaleString('id-ID');
}


// 4. Konfirmasi Order (Buat Invoice)
function confirmSosmedOrder() {
    const target = document.getElementById('sm-target').value;
    const qty = parseInt(document.getElementById('sm-qty').value) || 0;
    
    // Validasi
    if(!target) return Swal.fire('Error', 'Masukkan link target!', 'warning');
    if(qty < selectedSosmedService.min) return Swal.fire('Error', `Minimal order ${selectedSosmedService.min} pcs`, 'warning');
    
    const total = qty * selectedSosmedService.price;
    const itemName = selectedSosmedService.name;
    
    // Format Data untuk Invoice
    const details = `Target: ${target} | Jumlah: ${qty} Pcs`;
    
    closeSosmedModal();
    
    // Lempar ke sistem Invoice yg sudah ada
    createInvoice(itemName, total, details);
}
/* --- FUNGSI TENTANG NEXUS (UPDATE) --- */
function showInfo() {
    // 1. Tutup Sidebar Dulu
    toggleSidebar();

    // 2. Tampilkan Popup Keren
    Swal.fire({
        html: `
            <div class="about-wrapper">
                <div class="gang-img-box">
                    <img src="assets/gang.jpg" class="gang-img" onerror="this.src='https://via.placeholder.com/400x200?text=NEXUS+GANG'">
                    <div class="img-overlay"></div>
                </div>

                <h2 class="neon-title">BE PART OF THE <span class="red-neon">LEGEND</span></h2>
                
                <p class="about-text">
                    <b>NEXUS CORE</b> bukan sekadar platform topup. Kami adalah ekosistem digital elite yang dibangun untuk Gamers, Kreator, dan Pemburu Cuan. Kecepatan, Keamanan, dan Komunitas adalah darah kami.
                </p>

                <div class="visimisi-box">
                    <div class="vm-item">
                        <strong>🎯 VISI</strong>
                        <p>Menjadi pusat layanan digital #1 yang menguasai pasar underground & mainstream.</p>
                    </div>
                    <div class="vm-item">
                        <strong>🔥 MISI</strong>
                        <p>Menyediakan akses premium termurah dan membangun ekonomi digital yang solid bagi member.</p>
                    </div>
                </div>

                <div class="social-grid">
                    <button onclick="window.open('https://your-blog-link.com', '_blank')" class="soc-btn blog">
                        <i class="fas fa-blog"></i> BLOG
                    </button>
                    <button onclick="window.open('https://instagram.com/nexusboost', '_blank')" class="soc-btn ig">
                        <i class="fab fa-instagram"></i> INSTAGRAM
                    </button>
                    <button onclick="window.open('https://facebook.com/nexuscore', '_blank')" class="soc-btn fb">
                        <i class="fab fa-facebook"></i> FACEBOOK
                    </button>
                </div>
            </div>
        `,
        background: '#050505',
        showConfirmButton: false,
        showCloseButton: true,
        width: '500px',
        customClass: {
            popup: 'nexus-popup-border'
        }
    });
}
/* --- SISTEM FREELANCE & MISI (DATA BARU) --- */

const jobs = [
    { id: 1, title: "Follow Instagram Admin", reward: 500, type: "sosmed", img: "assets/igfol.png", desc: "Follow akun IG resmi Nexus." },
    { id: 2, title: "Share ke 3 Grup WA", reward: 1000, type: "sosmed", img: "assets/whatsapp.png", desc: "Share link web ini ke 3 grup WA aktif." },
    
    // --- MISI KYC SEABANK ---
    { 
        id: 4, 
        title: "Buka Rekening SeaBank", 
        reward: 25000, 
        type: "kyc", 
        tag: "HOT", 
        img: "assets/seabank.png", 
        desc: "Daftar SeaBank, masukkan kode referral & deposit 50k.", 
        link: "https://app.seabank.co.id/app/main?module=router&type=me&sub_type=referral&login=true&referralCode=52V2M2", 
        referral: "52V2M2",
        steps: [
            "Klik tombol <b>DOWNLOAD APP</b> di bawah.",
            "Daftar pakai No HP / Shopee.",
            "Masukkan Kode Referral: <b style='color:yellow; font-size:1.2em;'>52V2M2</b> (Wajib SS saat isi kode!).",
            "Verifikasi E-KTP & Wajah sampai disetujui.",
            "<b>Wajib Top Up minimal Rp 50.000</b> (Dari Bank Lain/E-Wallet).",
            "⚠️ Saldo Rp 50rb harus ditahan selama <b>3 HARI</b> (Jangan dipakai).",
            "Klaim bonus Rp 10rb dari aplikasi SeaBank setelah syarat terpenuhi."
        ],
        syarat: [
            "Khusus Pengguna Baru SeaBank.",
            "Wajib pakai kode referral 52V2M2.",
            "Saldo tidak boleh hasil transfer sesama SeaBank."
        ]
    },

    // --- SEWA AKUN ---
    { id: 5, title: "Sewa WhatsApp", reward: "Up to 100rb", type: "sewaakun", tag: "POPULER", img: "assets/whatsapp.png", pricelist: ["⚠️ <b>RULES:</b> Min Sewa 1 Bulan.", "🟢 <b>Per Chat:</b> Rp 400", "⏱ <b>12 Jam:</b> Rp 100.000"] },
    { id: 6, title: "Sewa Telegram", reward: "Up to 100rb", type: "sewaakun", tag: "NEW", img: "assets/telegram.png", pricelist: ["⚠️ <b>RULES:</b> No 2FA (Verif Aman).", "🟢 <b>Per Chat:</b> Rp 400", "⏱ <b>12 Jam:</b> Rp 100.000"] },
    { id: 7, title: "Sewa Akun Line", reward: "Up to 100rb", type: "sewaakun", img: "assets/line.png", pricelist: ["⚠️ <b>RULES:</b> Allow Login PC/iPad.", "🟢 <b>Per Chat:</b> Rp 400", "⏱ <b>12 Jam:</b> Rp 100.000"] }
];

// --- FUNGSI RENDER OTOMATIS SAAT WEB LOAD ---
// (Panggil fungsi ini di dalam document.addEventListener)
function renderMissions() {
    const container = document.getElementById('mission-grid');
    if(!container) return;
    container.innerHTML = "";

    jobs.forEach(job => {
        // Cek Tag (HOT/NEW)
        let tagHtml = job.tag ? `<span class="m-badge tag-${job.tag.toLowerCase()}">${job.tag}</span>` : '';
        
        // Format Reward
        let rewardText = typeof job.reward === 'number' ? "Rp " + job.reward.toLocaleString() : job.reward;

        const card = document.createElement('div');
        card.className = 'mission-card';
        card.onclick = () => openMissionDetail(job.id); // Klik card buka detail

        card.innerHTML = `
            <div class="m-header">
                <img src="${job.img}" class="m-img" onerror="this.src='https://via.placeholder.com/50'">
                <div class="m-info">
                    <h4>${job.title}</h4>
                    ${tagHtml}
                    <p style="font-size:0.75rem; color:#888; margin:2px 0;">${job.desc ? job.desc.substring(0, 40) + '...' : 'Klik untuk detail'}</p>
                </div>
                <div style="margin-left:auto; text-align:right;">
                    <span style="color:var(--red-core); font-weight:bold; font-size:0.9rem;">${rewardText}</span>
                </div>
            </div>
            <button class="cyber-btn-outline small full-width">LIHAT DETAIL</button>
        `;
        container.appendChild(card);
    });
}

// --- FUNGSI BUKA MODAL DETAIL ---
let selectedJob = null;

function openMissionDetail(id) {
    selectedJob = jobs.find(j => j.id === id);
    if(!selectedJob) return;

    const modal = document.getElementById('mission-modal');
    
    // Isi Data Header
    document.getElementById('m-modal-img').src = selectedJob.img;
    document.getElementById('m-modal-title').innerText = selectedJob.title;
    document.getElementById('m-modal-reward').innerText = typeof selectedJob.reward === 'number' ? "Rp " + selectedJob.reward.toLocaleString() : selectedJob.reward;

    // Isi Konten (Logika Render Konten Berdasarkan Tipe)
    const contentBox = document.getElementById('m-modal-content');
    let htmlContent = "";

    // A. JIKA TIPE KYC (SEABANK)
    if (selectedJob.type === 'kyc') {
        htmlContent += `<p><b>LANGKAH PENGERJAAN:</b></p><ul class="step-list">`;
        selectedJob.steps.forEach(step => htmlContent += `<li>${step}</li>`);
        htmlContent += `</ul>`;
        
        if(selectedJob.syarat) {
            htmlContent += `<p style="margin-top:15px;"><b>SYARAT & KETENTUAN:</b></p><ul class="rule-list">`;
            selectedJob.syarat.forEach(s => htmlContent += `<li style="color:#aaa;">${s}</li>`);
            htmlContent += `</ul>`;
        }

        // Tombol Download/Link
        if(selectedJob.link) {
            htmlContent += `<button onclick="window.open('${selectedJob.link}', '_blank')" class="cyber-btn-glitch full-width" style="margin-bottom:10px; background:#ff6600;">DOWNLOAD APP SEABANK</button>`;
        }
    } 
    // B. JIKA TIPE SEWA AKUN
    else if (selectedJob.type === 'sewaakun') {
        htmlContent += `<p><b>DAFTAR HARGA SEWA:</b></p><ul class="price-list">`;
        selectedJob.pricelist.forEach(p => htmlContent += `<li>${p}</li>`);
        htmlContent += `</ul><p style="font-size:0.8rem; color:#888; margin-top:10px;">*Klik Ambil Tugas untuk nego harga dengan Admin.</p>`;
    } 
    // C. MISI BIASA (SOSMED)
    else {
        htmlContent += `<p>${selectedJob.desc}</p><p style="margin-top:10px;">Kerjakan tugas ini dan kirim bukti screenshot ke WhatsApp Admin untuk mendapatkan token saldo.</p>`;
    }

    contentBox.innerHTML = htmlContent;

    // Set Aksi Tombol Utama
    const btn = document.getElementById('m-modal-btn');
    btn.onclick = () => processMissionAction(selectedJob);
    btn.innerText = selectedJob.type === 'sewaakun' ? "CHATT ADMIN (SEWA)" : "KIRIM BUKTI (WA)";

    modal.style.display = 'flex';
}

function closeMissionModal() {
    document.getElementById('mission-modal').style.display = 'none';
}

function processMissionAction(job) {
    let msg = "";
    const user = currentUser || "Guest";

    if (job.type === 'kyc') {
        msg = `*LAPORAN KYC NEXUS*%0AUser: ${user}%0AMisi: ${job.title}%0A%0A*Saya sudah daftar pakai Kode Referral ${job.referral}.*%0ABukti Screenshot terlampir 👇`;
    } else if (job.type === 'sewaakun') {
        msg = `*SEWA AKUN NEXUS*%0AUser: ${user}%0AItem: ${job.title}%0A%0AMau tanya slot/nego harga min?`;
    } else {
        msg = `*LAPORAN MISI*%0AUser: ${user}%0AMisi: ${job.title}%0A%0AIni bukti screenshot saya min 👇`;
    }

    window.open(`https://wa.me/${CONFIG.adminWA}?text=${msg}`, '_blank');
}

// JANGAN LUPA: Tambahkan renderMissions() ke dalam init
// document.addEventListener("DOMContentLoaded", () => {
//    ...
//    renderMissions(); // <--- TAMBAHKAN INI
// });
document.addEventListener("DOMContentLoaded", () => {
    checkSession();
    setupBannerAutoSlide();
    renderMissions(); // <--- WAJIB DITAMBAH BIAR MISINYA MUNCUL
});
