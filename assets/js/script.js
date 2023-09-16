class Pendaftar {
    constructor(nama, umur, uang) {
        this.nama = nama;
        this.umur = umur;
        this.uang = uang;
    }
}

class DataPendaftar {
    constructor() {
        this.data = JSON.parse(localStorage.getItem('wadah')) || [];
    }

    async tambahPendaftar(pendaftar) {
        this.data.push(pendaftar);
        await this.simpanData();
    }

    async hapusPendaftar(index) {
        this.data.splice(index, 1);
        await this.simpanData();
    }

    async simpanData() {
        localStorage.setItem('wadah', JSON.stringify(this.data));
    }

    async hitungRataRata() {
        let totalUmur = 0;
        let totalUang = 0;

        this.data.forEach((pendaftar) => {
            totalUmur += pendaftar.umur;
            totalUang += pendaftar.uang;
        });

        const rataRataUmur = totalUmur / this.data.length;
        const rataRataUang = totalUang / this.data.length;

        return { rataRataUmur, rataRataUang };
    }

    ambilData() {
        return this.data;
    }
}

const dataPendaftar = new DataPendaftar();

function kirim() {
    const nameInput = document.getElementById("name");
    const umurInput = document.getElementById("umur");
    const uangInput = document.getElementById("uang");

    const name = nameInput.value;
    const umur = parseInt(umurInput.value);
    const uang = parseInt(uangInput.value);

    // Validasi input
    let isValid = true;

    if (name.length < 10) {
        document.getElementById("errorName").textContent = "Nama minimal 10 karakter.";
        isValid = false;
    } else {
        document.getElementById("errorName").textContent = "";
    }

    if (isNaN(umur) || umur < 25) {
        document.getElementById("errorUmur").textContent = "Umur minimal 25 tahun.";
        isValid = false;
    } else {
        document.getElementById("errorUmur").textContent = "";
    }

    if (isNaN(uang) || uang < 100000 || uang > 1000000) {
        document.getElementById("errorUang").textContent = "Uang Sangu minimal 100 ribu dan maksimal 1 juta.";
        isValid = false;
    } else {
        document.getElementById("errorUang").textContent = "";
    }

    if (!isValid) {
        return;
    }

    const pendaftar = new Pendaftar(name, umur, uang);

    // Tambahkan pendaftar ke DataPendaftar dan simpan data
    dataPendaftar.tambahPendaftar(pendaftar)
        .then(() => {
            // Mengosongkan input fields setelah data dimasukkan
            nameInput.value = "";
            umurInput.value = "";
            uangInput.value = "";

            // Refresh data di halaman List Pendaftar
            tampilkanData();
        });
}

async function tampilkanData() {
    const tableBody = document.getElementById("dataContainer");
    tableBody.innerHTML = "";

    const storedData = dataPendaftar.ambilData();

    if (storedData) {
        const { rataRataUmur, rataRataUang } = await dataPendaftar.hitungRataRata();

        storedData.forEach((pendaftar, index) => {
            const newRow = document.createElement("tr");

            const cellNama = document.createElement("td");
            cellNama.textContent = pendaftar.nama;
            newRow.appendChild(cellNama);

            const cellUmur = document.createElement("td");
            cellUmur.textContent = pendaftar.umur;
            newRow.appendChild(cellUmur);

            const cellUang = document.createElement("td");
            cellUang.textContent = pendaftar.uang;
            newRow.appendChild(cellUang);

            const cellDelete = document.createElement("td");
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.onclick = () => {
                dataPendaftar.hapusPendaftar(index)
                    .then(() => {
                        tampilkanData();
                    });
            };
            cellDelete.appendChild(deleteButton);
            newRow.appendChild(cellDelete);

            tableBody.appendChild(newRow);
        });

        const rataRataRow = document.createElement("tr");
        const rataRataCell = document.createElement("td");
        rataRataCell.setAttribute("colspan", "4");
        rataRataCell.textContent = `Rata-rata Pendaftar memiliki uang saku sebesar Rp.${rataRataUang} dengan rata-rata umur ${rataRataUmur} Tahun`;
        rataRataRow.appendChild(rataRataCell);
        tableBody.appendChild(rataRataRow);
    }
}

// Panggil tampilkanData saat halaman dimuat
window.onload = tampilkanData;
