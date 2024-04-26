// Data produk 
let ITEMS = [
    {
        Id: 1,
        name: 'Iphone 14 Pro Max',
        hargaawal: '28.999.000',
        price: '26.499.000',
        harga: 26499000,
        image: 'img/type/14prmx.png',
        size: 512,
        qty: 1,
        datamodal: 'modal1'
    },
    {
        Id: 2,
        name: 'Iphone 13 Pro Max',
        hargaawal: '27.299.000',
        price: '25.499.000',
        harga: 25499000,
        image: 'img/type/13prmx.png',
        size: 512,
        qty: 1,
        datamodal: 'modal2'
    },
    {
        Id: 3,
        name: 'Iphone 12 Pro Max',
        hargaawal: '26.999.000',
        price: '19.999.000',
        harga: 19999000,
        image: 'img/type/12prmx.png',
        size: 512,
        qty: 1,
        datamodal: 'modal3'
    },
    {
        Id: 4,
        name: 'Iphone 11',
        hargaawal: '9.249.000',
        price: '8.999.000',
        harga: 8999000,
        image: 'img/type/11.png',
        size: 128,
        qty: 1,
        datamodal: 'modal4'
    },
]

// Data produk keranjang
let cartData = JSON.parse(localStorage.getItem("data")) || []

// On HTML
const openBtn = document.getElementById('shopping-cart-button');
const cartBox =document.getElementById('sidecart');
const closeBtn = document.getElementById('close-btn');
const backdrop = document.querySelector('.backdrop');
const itemsEl = document.querySelector('.items');
const cartItems = document.querySelector('.cart-items');
const itemsnum = document.getElementById('item-num');
const totalHarga = document.getElementById('subtotal-price');

// Sidecart
openBtn.addEventListener('click', openCart);
closeBtn.addEventListener('click', closeCart);
backdrop.addEventListener('click', closeCart);

// Buka keranjang  
function openCart(e) {
    cartBox.classList.add('open');
    backdrop.style.display = 'block';
    setTimeout(() => {
        backdrop.classList.add('show');
    }, 0)
    e.preventDefault();
}

// Tutup keranjang
function closeCart() {
    cartBox.classList.remove('open');
    backdrop.classList.remove('show');
    setTimeout(() => {
        backdrop.style.display = 'none';
    }, 500)
}

// Tambah barang ke keranjang
const addItem = (idx, itemId) => {
    // cari item duplikat
    const foundItem = cartData.find((item) => item.Id.toString() === itemId.toString());
    if(foundItem){
        tambahQty(itemId);
    }
    else{
        cartData.push(ITEMS[idx]);
        localStorage.setItem("data", JSON.stringify(cartData))
    }
    updateCart()
} 

// Menghitung jumlah item
const jmlItem = (itemId) => {
    let totalItem = 0
    cartData.forEach((item) => (totalItem += item.qty))
    let search = cartData.find((item) => item.Id === itemId) || [];
    itemsnum.innerText = totalItem
}
jmlItem();

// Menghitung jumlah harga barang
const jmlHarga = () => {
    let Harga = 0;
    cartData.forEach((item) => Harga += item.harga * item.qty);
    let rupiahFormat = Harga.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    totalHarga.innerText = rupiahFormat;
}
jmlHarga();

// Hapus barang di keranjang
const removeCartItem = (itemId) => {
    cartData = cartData.filter((item) => item.Id != itemId)
    localStorage.setItem("data", JSON.stringify(cartData))
    updateCart()
}

// Tambah jumlah barang
const tambahQty = (itemId) => {
    cartData = cartData.map((item) => item.Id.toString() === itemId.toString() ? {...item, qty: item.qty < 10 ? item.qty + 1 : item.qty} : item);
    localStorage.setItem("data", JSON.stringify(cartData))
    updateCart();
}

// Kurangi jumlah barang
const kurangiQty = (itemId) => {
    cartData = cartData.map((item) => item.Id.toString() === itemId.toString() ? {...item, qty: item.qty > 1 ? item.qty - 1 : item.qty} : item);
    localStorage.setItem("data", JSON.stringify(cartData))
    updateCart();
}

// Render item
const generateShop = () => {
    ITEMS.forEach((item, idx) => {
        const items = document.createElement('div')
        items.classList.add('type-card');
        var {Id, name, price, image , size, datamodal, hargaawal} = item;
        items.innerHTML = `
            <div class="type-icon">
                <a class="add-cart" onclick = "addItem(${idx}, ${Id})"><i class="bi bi-cart2"></i></a>
                <a class="modal-open" data-modal="${datamodal}"><i class="bi bi-eye"></i></a>
            </div>
            <div class="type-image">
                <img src="${image}" alt="Type 1">
            </div>
            <div class="type-content">
                <h3>${name}</h3>
                <p>${size} GB</p>
                <div class="type-price">IDR ${price} <span>IDR ${hargaawal}</span></div>
            </div>
        `
        itemsEl.appendChild(items);
    }) 
}



// Render keranjang
const renderCartItems = () => {
    cartItems.innerHTML = ''
    cartData.forEach((item) => {
        const cartItem = document.createElement('div')
        cartItem.classList.add('cart-item');
        var {Id, name, price, image ,qty} = item;
        cartItem.innerHTML = `
        <div class="remove-item" onclick = "removeCartItem(${Id})">
            <span>&times;</span>
        </div>
        <div class="item-img">  
            <img src="${image}" alt="">
        </div>
        <div class="item-details">
            <p>${name}</p>
            <strong>IDR ${price}</strong>
            <div class="qty">
                <span onclick="kurangiQty(${Id})">-</span>
                <strong>${qty}</strong>
                <span onclick="tambahQty(${Id})">+</span>
            </div>
        </div>
        `
        cartItems.appendChild(cartItem);
    })
}
renderCartItems();

const updateCart = () => {
    // Update keranjang sesuai update data
    renderCartItems();
    // Update jumlah item di keranjang
    jmlItem();
    // Update harga item di keranjang
    jmlHarga();
}
generateShop();

// Toggle class active untuk menu
const navbarNav = document.querySelector('.navbar-nav');

// Ketika garis tiga di klik
document.querySelector('#icon-menu').onclick = (e) => {
    navbarNav.classList.toggle('active');
    navbarNav.focus();
    e.preventDefault();
}

// Toggle class active untuk search form
const searchForm = document.querySelector('.search-form');
const searchBox = document.querySelector('#search-box');

// Ketika tombol search di klik
document.querySelector('#search-button').onclick = (e) => {
    searchForm.classList.toggle('active');
    searchBox.focus();
    e.preventDefault();
}

// Klik di luar elemen
const menu = document.querySelector('#icon-menu');
const sb = document.querySelector('#search-button');

document.addEventListener('click', function(e) {
    if (!menu.contains(e.target) && !navbarNav.contains(e.target)) {
        navbarNav.classList.remove('active');
    }
    if (!sb.contains(e.target) && !searchForm.contains(e.target)) {
        searchForm.classList.remove('active');
    }
});

// Button untuk membuka modal box
const modalBtns = document.querySelectorAll('.modal-open');

// Ketika klik logo mata
modalBtns.forEach(function(btn) {
    btn.onclick = function(e){
        var modal = btn.getAttribute('data-modal');
        e.preventDefault();
        document.getElementById(modal).style.display = 'flex';
    };
});

// Button untuk menutup modal box
const closeBtns = document.querySelectorAll('.close-icon');

// Ketika klik tombol close
closeBtns.forEach(function(btn) {
    btn.onclick = function(e){
        const modal = btn.closest('.modal').style.display = 'none';
        e.preventDefault();
    }
});

// Ketika klik di luar elemen modal box
window.onclick = (e) => {
    if(e.target.className === 'modal') {
        e.target.style.display = 'none'
    }
}