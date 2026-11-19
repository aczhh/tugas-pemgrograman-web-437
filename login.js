// =====================================================
// login.js  ->  dipakai oleh index.html (halaman login)
// Tugasnya: kirim username & password ke API, lalu
// kalau berhasil, simpan data login dan pindah ke dashboard.
// =====================================================


// ===== 1. Alamat API (ini "tujuan" yang disambungkan) =====
const URL_LOGIN = "https://dummyjson.com/auth/login";


// ===== 2. Ambil elemen dari HTML =====
const formLogin  = document.getElementById("form-login");
const pesan      = document.getElementById("pesan");
const tombolMasuk = document.getElementById("tombol-masuk");


// ===== 3. Kalau sudah login sebelumnya, langsung ke dashboard =====
if (localStorage.getItem("token")) {
    window.location.href = "dashboard.html";
}


// ===== 4. Fungsi kecil untuk menampilkan pesan =====
// sukses = true -> hijau, sukses = false -> merah
function tampilkanPesan(teks, sukses) {
    pesan.textContent = teks;
    pesan.className = "pesan " + (sukses ? "sukses" : "error");
}


// ===== 5. Fungsi yang berbicara dengan API =====
// "async/await" artinya: tunggu dulu sampai server membalas.
async function kirimLogin(username, password) {

    // fetch = "kirim surat" ke alamat API
    const response = await fetch(URL_LOGIN, {
        method: "POST",                                    // POST = kirim data
        headers: { "Content-Type": "application/json" },   // data kita berbentuk JSON
        body: JSON.stringify({                             // isi suratnya
            username: username,
            password: password
        })
    });

    // Kalau server bilang gagal (misalnya password salah)
    if (!response.ok) {
        throw new Error("Username atau kata sandi salah.");
    }

    // Balasan server berbentuk JSON, kita ubah jadi objek JavaScript
    const data = await response.json();
    return data;
}


// ===== 6. Saat tombol "Masuk" ditekan =====
formLogin.addEventListener("submit", async function (event) {
    event.preventDefault();   // cegah halaman reload

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    tombolMasuk.disabled = true;
    tombolMasuk.textContent = "Memproses...";
    pesan.textContent = "";

    try {
        const data = await kirimLogin(username, password);

        // Simpan token & data user di browser (localStorage)
        localStorage.setItem("token", data.accessToken);
        localStorage.setItem("user", JSON.stringify({
            nama: data.firstName + " " + data.lastName,
            foto: data.image
        }));

        // Pindah ke dashboard
        window.location.href = "dashboard.html";

    } catch (error) {
        // TypeError terjadi kalau tidak ada internet / server tidak bisa dijangkau
        if (error instanceof TypeError) {
            tampilkanPesan("Tidak bisa terhubung ke server. Cek internet kamu.", false);
        } else {
            tampilkanPesan(error.message, false);
        }
        tombolMasuk.disabled = false;
        tombolMasuk.textContent = "Masuk";
    }
});
