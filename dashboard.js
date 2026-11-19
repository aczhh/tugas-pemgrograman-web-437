// =====================================================
// dashboard.js  ->  dipakai oleh dashboard.html
// Tugasnya:
//   1. Pastikan user sudah login (kalau belum, kembalikan ke login)
//   2. Ambil daftar produk dari API
//   3. Tampilkan produknya di halaman
// =====================================================


// ===== 1. Alamat API (limit=8 artinya minta 8 produk saja) =====
const URL_PRODUK = "https://dummyjson.com/products?limit=8";


// ===== 2. Ambil elemen dari HTML =====
const sapaan       = document.getElementById("sapaan");
const namaUser     = document.getElementById("nama-user");
const fotoUser     = document.getElementById("foto-user");
const tombolKeluar = document.getElementById("tombol-keluar");
const teksStatus   = document.getElementById("status");
const daftarProduk = document.getElementById("daftar-produk");


// ===== 3. Cek login =====
// Data ini disimpan oleh login.js saat login berhasil.
const token = localStorage.getItem("token");
const user  = JSON.parse(localStorage.getItem("user"));

if (!token || !user) {
    // Belum login -> tendang kembali ke halaman login
    window.location.href = "index.html";
} else {
    tampilkanUser();
    ambilProduk();
}


// ===== 4. Tampilkan nama & foto user di atas =====
function tampilkanUser() {
    sapaan.textContent = "Halo, " + user.nama + "!";
    namaUser.textContent = user.nama;
    fotoUser.src = user.foto;
}


// ===== 5. Ambil data produk dari API =====
async function ambilProduk() {
    try {
        // GET = minta data (tidak perlu mengirim isi apa-apa)
        const response = await fetch(URL_PRODUK);

        if (!response.ok) {
            throw new Error("Gagal mengambil data.");
        }

        const data = await response.json();
        // data kira-kira berbentuk: { products: [...], total: 194, ... }

        teksStatus.textContent = "Menampilkan " + data.products.length +
                             " dari " + data.total + " produk.";
        tampilkanProduk(data.products);

    } catch (error) {
        teksStatus.textContent = "Data tidak bisa dimuat. Cek internet kamu lalu muat ulang halaman.";
    }
}


// ===== 6. Ubah data produk menjadi kartu di halaman =====
function tampilkanProduk(daftar) {
    // Untuk setiap produk, buat satu kotak HTML.
    // .map() = ubah tiap item jadi teks HTML, .join("") = gabungkan semuanya
    daftarProduk.innerHTML = daftar.map(function (produk) {
        return `
            <article class="produk">
                <img src="${produk.thumbnail}" alt="${produk.title}">
                <h3>${produk.title}</h3>
                <p class="kategori">${produk.category}</p>
                <p class="harga">$${produk.price}</p>
            </article>
        `;
    }).join("");
}


// ===== 7. Tombol Keluar =====
tombolKeluar.addEventListener("click", function () {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "index.html";
});
