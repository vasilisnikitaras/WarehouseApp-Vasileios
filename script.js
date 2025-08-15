// Έλεγχος σύνδεσης
if (!localStorage.getItem("loggedInUser")) {
  window.location.href = "login.html";
}

// DOM Elements
const itemNameInput = document.getElementById("itemName");
const itemQtyInput = document.getElementById("itemQty");
const categorySelect = document.getElementById("category");
const itemsList = document.getElementById("itemsList");
const addBtn = document.getElementById("addBtn");
const clearBtn = document.getElementById("clearBtn");
const exportBtn = document.getElementById("exportBtn");
const themeBtn = document.getElementById("themeBtn");
const logoutBtn = document.getElementById("logoutBtn");
const languageSelect = document.getElementById("language");
const searchBar = document.getElementById("searchBar");
const scanBtn = document.getElementById("scanBtn");
const barcodeInput = document.getElementById("barcodeInput");
const barcodeType = document.getElementById("barcodeType");
const barcodeImage = document.getElementById("barcodeImage");

let items = [];

// Προσθήκη αντικειμένου
addBtn.addEventListener("click", () => {
  const name = itemNameInput.value.trim();
  const qty = itemQtyInput.value.trim();
  const category = categorySelect.value;

  if (!name || !qty) {
    alert("Please enter item name and quantity.");
    return;
  }

  items.push({ name, qty, category });
  renderItems();
  itemNameInput.value = "";
  itemQtyInput.value = "";
});

// Εμφάνιση αντικειμένων
function renderItems(filter = "") {
  itemsList.innerHTML = "";
  items
    .filter(item => item.name.toLowerCase().includes(filter))
    .forEach(item => {
      const div = document.createElement("div");
      div.className = "item";
      div.innerHTML = `
        <span class="name">${item.name}</span>
        <span class="qty">${item.qty}</span>
        <span class="cat">${item.category}</span>
      `;
      itemsList.appendChild(div);
    });
}

// Αναζήτηση
searchBar.addEventListener("input", () => {
  renderItems(searchBar.value.toLowerCase());
});

// Καθαρισμός λίστας
clearBtn.addEventListener("click", () => {
  items = [];
  renderItems();
});

// Εξαγωγή CSV
exportBtn.addEventListener("click", () => {
  if (items.length === 0) {
    alert("No items to export.");
    return;
  }

  let csv = "Item Name,Quantity,Category\n";
  items.forEach(item => {
    csv += `${item.name},${item.qty},${item.category}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "inventory.csv";
  link.click();
});

// Dark Mode
themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// Logout
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("loggedInUser");
  alert("Disconnected.");
  window.location.href = "login.html";
});

// Barcode Scanner
scanBtn.addEventListener("click", () => {
  Quagga.init({
    inputStream: {
      name: "Live",
      type: "LiveStream",
      target: document.querySelector("#scanner")
    },
    decoder: {
      readers: ["code_128_reader", "ean_reader", "ean_8_reader"]
    }
  }, function(err) {
    if (err) {
      console.error(err);
      return;
    }
    Quagga.start();
  });

  Quagga.onDetected(data => {
    const code = data.codeResult.code;
    itemNameInput.value = code;
    Quagga.stop();
    document.getElementById("scanner").innerHTML = "";
  });
});

// Barcode Generator
function generateBarcode() {
  const code = barcodeInput.value.trim();
  const type = barcodeType.value;

  if (!code) {
    alert("Please enter a barcode value.");
    return;
  }

  const url = `https://barcode.tec-it.com/barcode.ashx?data=${encodeURIComponent(code)}&code=${type}&dpi=96`;
  barcodeImage.src = url;
}

// Γλωσσική αλλαγή
const translations = {
  en: {
    itemName: "Item name",
    quantity: "Quantity",
    category: "Category",
    add: "Add",
    search: "Search...",
    scan: "Scan Barcode",
    darkMode: "Dark Mode",
    clear: "Clear",
    export: "📤 Export CSV",
    disconnect: "Disconnect"
  },
  el: {
    itemName: "Όνομα είδους",
    quantity: "Ποσότητα",
    category: "Κατηγορία",
    add: "Προσθήκη",
    search: "Αναζήτηση...",
    scan: "Σάρωση Barcode",
    darkMode: "Σκοτεινή λειτουργία",
    clear: "Καθαρισμός",
    export: "📤 Εξαγωγή CSV",
    disconnect: "Αποσύνδεση"
  },
  fr: {
    itemName: "Nom de l'article",
    quantity: "Quantité",
    category: "Catégorie",
    add: "Ajouter",
    search: "Recherche...",
    scan: "Scanner le code-barres",
    darkMode: "Mode sombre",
    clear: "Effacer",
    export: "📤 Exporter CSV",
    disconnect: "Déconnexion"
  }
};

languageSelect.addEventListener("change", () => {
  const lang = languageSelect.value;
  const t = translations[lang];
  itemNameInput.placeholder = t.itemName;
  itemQtyInput.placeholder = t.quantity;
  addBtn.textContent = t.add;
  searchBar.placeholder = t.search;
  scanBtn.textContent = t.scan;
  themeBtn.textContent = t.darkMode;
  clearBtn.textContent = t.clear;
  exportBtn.textContent = t.export;
  logoutBtn.textContent = t.disconnect;
});
