document.addEventListener("alpine:init", () => {
    Alpine.data("products", () => ({
      items: [
        { id: 1, name: "Caramel Latte", img: "1.jpg", price: 16000 },
        { id: 2, name: "Kopi Susu Aren", img: "2.jpg", price: 17000},
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
        // ambil item yang mau di remove verdasarkan id nya
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

  form.addEventListener('keyup' , function(){
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

  // kirim data ketika tombol checkout di klik
  checkoutButton.addEventListener('click', 
    function(e) {
    e.preventDefault();
    const formData = new FormData(form);
    const data = new URLSearchParams(formData);
    const objData = Object.fromEntries(data).items;
    console.log(objData);
  });
  

  // konversi ke rupiah
  const rupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };
  