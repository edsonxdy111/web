

// 登入
const users = [
    { username: 'test', password: '1234' }, // 模擬用戶數據
];

let isLoggedIn = false; // 初始為未登入

document.getElementById('loginForm').addEventListener('submit', event => {
    event.preventDefault(); // 防止表單提交刷新頁面
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        alert('登入成功！');
        isLoggedIn = true; // 設置為已登入
        localStorage.setItem('isLoggedIn', true); // 儲存登入狀態
        localStorage.setItem('username', username); // 儲存使用者名稱
        updateUIForLoggedInUser(username); // 更新 UI
        const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
        modal.hide(); // 隱藏模態框
    } else {
        alert('帳號或密碼錯誤！');
    }
});

// 更新登入後的 UI
function updateUIForLoggedInUser(username) {
    const loginNavLink = document.querySelector('.nav-item .nav-link[data-bs-target="#loginModal"]');
    loginNavLink.innerHTML = `<i class="bi bi-person-circle"></i> ${username}`;
    loginNavLink.removeAttribute('data-bs-target'); // 禁用再次打開登入框
    loginNavLink.setAttribute('href', '#'); // 防止點擊跳轉

    // 如果登出按鈕已存在，不需要再新增
    if (!document.getElementById('logoutButton')) {
        // 添加登出按鈕
        const logoutButton = document.createElement('a');
        logoutButton.id = 'logoutButton';
        logoutButton.className = 'nav-link text-danger';
        logoutButton.href = '#';
        logoutButton.innerHTML = `<i class="bi bi-box-arrow-right"></i> 登出`;
        logoutButton.addEventListener('click', handleLogout);

        // 插入登出按鈕到導覽列
        const navList = loginNavLink.parentElement.parentElement; // 找到 <ul> 父容器
        const newNavItem = document.createElement('li');
        newNavItem.className = 'nav-item';
        newNavItem.appendChild(logoutButton);
        navList.appendChild(newNavItem); // 插入登出按鈕
    }
}

function handleLogout() {
    localStorage.removeItem('isLoggedIn'); // 移除登入狀態
    localStorage.removeItem('username'); // 移除使用者名稱
    localStorage.removeItem('orderItems'); // 清空訂單資料
    alert('您已成功登出');
    location.reload(); // 重新載入頁面
}

// 初始化登入檢查
document.addEventListener('DOMContentLoaded', () => {
    const savedLoginStatus = localStorage.getItem('isLoggedIn');
    const savedUsername = localStorage.getItem('username');
    if (savedLoginStatus === 'true' && savedUsername) {
        isLoggedIn = true;
        updateUIForLoggedInUser(savedUsername);
    }
});

// 購物車資料
const cart = [];
// 商品資料
const products = [
    {
        name: "韓國 馬海毛 字母 針織 毛衣",
        price: 1180,
        image: "image/上衣1.png",
        description: "這款馬海毛針織毛衣，擁有舒適的質感和時尚的字母設計，讓你穿上不僅保暖，還能展現個性。",
        colors: ["紅色", "藍色", "綠色"],
        sizes: ["S", "M", "L"]
    },
    {
        name: "吊染 漸層 洞洞 毛衣",
        price: 1180,
        image: "image/上衣10.png",
        description: "這款吊染漸層毛衣，獨特的洞洞設計帶來透氣感，搭配漸層色調展現個性。",
        colors: ["灰色", "白色", "黑色"],
        sizes: ["S", "M", "L"]
    }, {
        name: "韓國 側拼接 抽繩 氣球 牛仔褲",
        price: 880,
        image: "image/下身2.png",
        description: "",
        colors: ["灰色", "黑色", "藍色"],
        sizes: ["S", "M", "L"]
    }, {
        name: "側口袋 迷彩 七分 工作褲",
        price: 800,
        image: "image/下身12.png",
        description: "",
        colors: ["軍綠色"],
        sizes: ["S", "M", "L"]
    }, {
        name: "流蘇 綴飾 實心 蛋型 純鋼 褲鏈",
        price: 1380,
        image: "image/配件2.png",
        description: "",
        colors: ["圖片色"],
        sizes: ["55cm"]
    }, {
        name: "火山石 圓珠 拼接 純鋼 項鍊",
        price: 1280,
        image: "image/配件3.png",
        description: "",
        colors: ["圖片色"],
        sizes: ["55cm"]
    },
];

// 顯示商品詳細介面
function showProductDetails(product) {
    const modalBody = document.querySelector('#productDetailModal .modal-body');
    modalBody.innerHTML = `
        <div class="product-details">
            <img src="${product.image}" class="img-fluid product-image" alt="${product.name}">
            <h5 class="product-name">${product.name}</h5>
            <p class="product-description">${product.description}</p>
            <p class="product-price">價格: <span id="productPrice">$${product.price}</span></p>

            <div class="mb-3">
                <label for="productColor" class="form-label">選擇顏色</label>
                <select id="productColor" class="form-select">
                    ${product.colors.map(color => `<option value="${color}">${color}</option>`).join('')}
                </select>
            </div>

            <div class="mb-3">
                <label for="productSize" class="form-label">選擇尺寸</label>
                <select id="productSize" class="form-select">
                    ${product.sizes.map(size => `<option value="${size}">${size}</option>`).join('')}
                </select>
            </div>

            <div class="mb-3">
                <label for="productQuantity" class="form-label">數量</label>
                <input type="number" id="productQuantity" class="form-control" value="1" min="1">
            </div>
            
            <button class="btn btn-buy" id="addToCartBtn">加入購物車</button>
        </div>
    `;

    document.getElementById('addToCartBtn').addEventListener('click', () => {
        if (!isLoggedIn) {
            alert('請先登入後才能將商品加入購物車！');
            return;
        }

        const color = document.getElementById('productColor').value;
        const size = document.getElementById('productSize').value;
        const quantity = parseInt(document.getElementById('productQuantity').value);

        addToCart(product.name, product.price, color, size, quantity);
    });
}

// 顯示商品詳細頁面
function openProductDetailModal(productIndex) {
    const product = products[productIndex];
    showProductDetails(product);
    const productDetailModal = new bootstrap.Modal(document.getElementById('productDetailModal'));
    productDetailModal.show();
}

// 為商品按鈕添加事件
document.querySelectorAll('.btn-buy').forEach((button, index) => {
    button.addEventListener('click', () => {
        openProductDetailModal(index);
    });
});

// 更新購物車視圖
function updateCartView() {
    const cartItems = document.getElementById('cartItems');
    const totalPrice = document.getElementById('totalPrice');
    cartItems.innerHTML = ''; // 清空列表
    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `
            ${item.name} (${item.color}, ${item.size}, x${item.quantity})
            <span>$${item.price * item.quantity}</span>
        `;
        cartItems.appendChild(li);
    });

    totalPrice.textContent = `$${total}`;
}

// 添加商品到購物車
function addToCart(productName, price, color, size, quantity) {
    const existingItem = cart.find(item => item.name === productName && item.color === color && item.size === size);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ name: productName, price: price, color: color, size: size, quantity: quantity });
    }
    updateCartView();
    alert(`${productName} (${color}, ${size}) 已加入購物車`);
}

// 購物車按鈕
document.getElementById('cartButton').addEventListener('click', () => {
    if (!isLoggedIn) {
        alert('請先登入以查看購物車！');
        return;
    }
    const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
    cartModal.show();
});

// 結帳按鈕
document.getElementById('checkoutButton').addEventListener('click', () => {
    if (!isLoggedIn) {
        alert('請先登入以進行結帳！');
        return;
    }

    if (cart.length === 0) {
        alert('購物車為空，無法結帳');
    } else {
        alert('結帳成功！感謝您的購買');
        localStorage.setItem('orderItems', JSON.stringify(cart)); // 將購物車內容存儲到 localStorage
        cart.length = 0; // 清空購物車
        updateCartView();
        window.location.href = 'order.html'; // 跳轉到訂單頁面
    }
});

// 問答AI部分
const aiInput = document.getElementById('aiInput');
const aiResponse = document.getElementById('aiResponse');

const questions = [
    { question: "運費是多少?", answer: "運費依照地區不同，詳情請參見運費政策。" },
    { question: "這款衣服有多少種顏色?", answer: "這款衣服有紅色、藍色、綠色等顏色。" },
    { question: "是否提供退貨服務?", answer: "是的，我們提供七天內退貨服務。" },
];

aiInput.addEventListener("input", function () {
    const query = aiInput.value.trim().toLowerCase();
    if (query) {
        const matched = questions.find(q => query.includes(q.question.toLowerCase()));
        aiResponse.textContent = matched ? matched.answer : "很抱歉，無法回答您的問題。";
    }
});
