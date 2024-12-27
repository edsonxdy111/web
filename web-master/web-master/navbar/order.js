document.addEventListener('DOMContentLoaded', () => {
    const orderItems = JSON.parse(localStorage.getItem('orderItems')) || [];
    const orderDetails = document.getElementById('orderDetails');

    if (orderItems.length === 0) {
        orderDetails.innerHTML = '<p class="text-center">目前沒有訂單商品。</p>';
    } else {
        let total = 0;
        const itemList = orderItems.map(item => {
            total += item.price * item.quantity;
            return `
                <div class="card mb-3">
                    <div class="row g-0">
                        <div class="col-md-4">
                            <img src="${item.image}" class="img-fluid rounded-start" alt="${item.name}">
                        </div>
                        <div class="col-md-8">
                            <div class="card-body">
                                <h5 class="card-title">${item.name}</h5>
                                <p class="card-text">顏色: ${item.color}</p>
                                <p class="card-text">尺寸: ${item.size}</p>
                                <p class="card-text">數量: ${item.quantity}</p>
                                <p class="card-text text-end">小計: $${item.price * item.quantity}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        orderDetails.innerHTML = `
            ${itemList}
            <div class="text-end">
                <h4>總金額: $${total}</h4>
            </div>
        `;
    }
});
