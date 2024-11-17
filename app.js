document.addEventListener("alpine:init", () => {
    Alpine.data("products", () => ({
      items: [
        { id: 1, name: "Pupuk Organik", img: "pupuk.png", price: 35000 },
        {
          id: 2,
          name: "Kopi Berastagi",
          img: "arabica-berastagi.jpg",
          price: 55000,
        },
        { id: 3, name: "Wortel Berastagi", img: "wortel.jpg", price: 15000 },
      ],
    }));
  
    Alpine.store("cart", {
      items: [],
      total: 0,
      quantity: 0,
      add(newItem) {
        const cart_Item = this.items.find((item) => item.id === newItem.id);
  
        if (!cart_Item) {
          this.items.push({ ...newItem, quantity: 1, total: newItem.price });
          this.quantity++;
          this.total += newItem.price;
        } else {
          this.items = this.items.map((item) => {
            if (item.id !== newItem.id) {
              return item;
            } else {
              item.quantity++;
              item.total = item.price * item.quantity;
              this.quantity++;
              this.total += item.price;
              return item;
            }
          });
        }
      },
    });
  });
  
  const rupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };
  