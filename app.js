document.addEventListener("alpine:init", () => {
  Alpine.data("products", () => ({
    // Tambahkan menu di bawah
    items: [
      { id: 1, name: "Caramel Latte", img: "1.jpeg", price: 16000 },
      { id: 2, name: "Kopi Susu Aren", img: "2.jpeg", price: 15000},
      { id: 3, name: "Espreso", img: "3.jpeg", price: 10000},
      { id: 4, name: "Es Teh Lemon", img: "4.jpeg", price: 12000},
      { id: 5, name: "Mie Jebew", img: "5.jpeg", price: 12000},
      { id: 6, name: "Chiken Katsu + Nasi", img: "6.jpeg", price: 17000},
      { id: 7, name: "Dimsum", img: "7.jpeg", price: 15000},
      { id: 8, name: "Spaghetti Bolonese", img: "8.jpeg", price: 15000},
    ],
  }));

  Alpine.store("cart", {
    items: [],
    total: 0,
    quantity: 0,
    add(newItem) {

      // jika belum ada / cart masih kosong
      const cartItem = this.items.find((item) => item.id === newItem.id);

      if (!cartItem) {
        this.items.push({ ...newItem, quantity: 1, total: newItem.price });
        this.quantity++;
        this.total += newItem.price;
      } else {
        // jika barang sudah ada,cek apakah barang beda atau sama yang ada di cart
        this.items = this.items.map((item) => {
          // jika barang berbeda
          if (item.id !== newItem.id) {
            return item;
          } else {
            // jika barang sudah ada, tambah quntity dan total nya
            item.quantity++;
            item.total = item.price * item.quantity;
            this.quantity++;
            this.total += item.price;
            return item;
          }
        });
      }
    },
    remove(id) {
      // ambil item yang mau di remove berdasarkan id nya
      const cartItem = this.items.find((item) => item.id === id);

      //  jika item lebih dari 1
      if(cartItem.quantity > 1) {
        // telusuri 1 1
        this.items = this.items.map((item) => {
          // jika bukan barang yang di klik
          if(item.id !== id) {
            return item;
          } else {
            item.quantity--;
            item.total = item.price * item.quantity;
            this.quantity--;
            this.total -= item.price;
            return item;
          }
        });
      } else if (cartItem.quantity === 1) {
        // jika barang nya sisa 1
        this.items = this.items.filter((item) => item.id !== id);
        this.quantity--;
        this.total -= cartItem.price;
      }
    }
  });
});


// form validasi
const checkoutButton = document.querySelector('.checkout-button');
checkoutButton.disabled = true;

const form = document.querySelector('#checkoutForm');

form.addEventListener('keyup' , async function(){
  for(let i = 0; i < form.elements.length; i++) {
    if(form.elements[i].value.length !== 0) {
      checkoutButton.classList.remove('disabled');
      checkoutButton.classList.add('disabled');
    } else {
      return false;
    }
  }
  checkoutButton.disabled = false;
  checkoutButton.classList.remove('disabled');
});

// Checkout button click
checkoutButton.addEventListener("click", async function (e) {
  e.preventDefault();
  const formData = new FormData(form);
  const data = new URLSearchParams(formData);
  const objData = Object.fromEntries(data);

  try {
    const response = await fetch("php/placeOrder.php", {
      method: "POST",
      body: data,
    });

    const token = await response.text();
    window.snap.pay(token, {
      onSuccess: function (result) {
        // Jika pembayaran sukses, arahkan ke WhatsApp
        const message = formatMessage(objData);
        const whatsappNumber = "081574794973";
        const encodedMessage = encodeURIComponent(message);
        const waLink = `https://wa.me/${+6281574794973}?text=${encodedMessage}`;
        window.location.href = waLink;
      },
      onPending: function (result) {
        alert("Pembayaran belum selesai. Silakan selesaikan pembayaran.");
      },
      onError: function (result) {
        alert("Pembayaran gagal. Silakan coba lagi.");
      },
      onClose: function () {
        alert("Anda menutup halaman pembayaran sebelum selesai.");
      },
    });
  } catch (err) {
    console.error(err.message);
  }
});

// Format pesan WhatsApp
const formatMessage = (obj) => {
  return `*Data Customer*\n
Nama: ${obj.name}
Email: ${obj.email}
No HP: ${obj.phone}

*Data Pesanan*\n
${JSON.parse(obj.items).map((item) => `${item.name} (${item.quantity} x ${rupiah(item.total)})`).join("\n")}
\n*TOTAL*: ${rupiah(obj.total)}
`;
};

// Konversi ke Rupiah
const rupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};
