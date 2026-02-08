document.addEventListener('DOMContentLoaded', () => {
    // === 1. КОРЗИНА (ОСНОВНОЕ) ===
    const cartWidget = document.getElementById('cart-widget');
    const modal = document.getElementById('cart-modal');
    const stage1 = document.getElementById('cart-stage-1');
    const stage2 = document.getElementById('cart-stage-2');
    const itemsList = document.getElementById('cart-items-list');
    const totalPriceElement = document.getElementById('total-price');
    const cartCountElement = document.getElementById('cart-count');
    
    let cart = [];
    const myPhoneNumber = "77775644567";

    window.updateCart = function() {
        if (!itemsList) return;
        itemsList.innerHTML = '';
        let total = 0;
        let count = 0;

        cart.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = "cart-item-row"; 
            itemDiv.style = "display:flex; align-items:center; justify-content:space-between; margin-bottom:15px; border-bottom:1px solid #eee; padding-bottom:10px;";
            itemDiv.innerHTML = `
                <div style="display:flex; align-items:center; gap:10px; flex:1;">
                    <img src="${item.img}" style="width:45px; height:45px; border-radius:5px; object-fit:cover;">
                    <div style="font-size:14px;">
                        <div style="font-weight:bold;">${item.name}</div>
                        <div style="color:#FF4500;">${item.price} тг</div>
                    </div>
                </div>
                <div style="display:flex; align-items:center; gap:8px;">
                    <button class="qty-btn" onclick="changeQuantity(${index}, -1)">-</button>
                    <span style="font-weight:bold; min-width:20px; text-align:center;">${item.count}</span>
                    <button class="qty-btn" onclick="changeQuantity(${index}, 1)">+</button>
                </div>`;
            itemsList.appendChild(itemDiv);
            total += item.price * item.count;
            count += item.count;
        });

        if (totalPriceElement) totalPriceElement.innerText = total.toLocaleString();
        if (cartCountElement) cartCountElement.innerText = count;
        if (cartWidget) cartWidget.style.display = count > 0 ? 'block' : 'none';
    };

    window.changeQuantity = (index, delta) => {
        cart[index].count += delta;
        if (cart[index].count <= 0) cart.splice(index, 1);
        updateCart();
    };

    // Добавление в корзину
    document.querySelectorAll('.order-button').forEach(button => {
        button.onclick = function(e) {
            e.stopPropagation();
            const card = this.closest('.menu-item, .kombo-item, .sakysku-item, .napitki-item');
            if (!card) return;

            const img = card.querySelector('img');
            const name = card.querySelector('h1').innerText;
            const price = parseInt(card.querySelector('.price').innerText.replace(/\D/g, ''));

            const existingItem = cart.find(item => item.name === name);
            if (existingItem) { existingItem.count++; } 
            else { cart.push({ name, price, img: img ? img.src : '', count: 1 }); }
            updateCart();
        };
    });

    // Клик по корзине и переходы
    document.addEventListener('click', (e) => {
        if (e.target.closest('#cart-widget')) {
            modal.style.display = 'block';
            stage1.style.display = 'block';
            stage2.style.display = 'none';
        }
        if (e.target.id === 'close-modal' || e.target === modal) modal.style.display = 'none';
        if (e.target.id === 'go-to-checkout') { stage1.style.display = 'none'; stage2.style.display = 'block'; }
        if (e.target.id === 'back-to-cart') { stage1.style.display = 'block'; stage2.style.display = 'none'; }
    });

    // === ЛОГИКА КНОПКИ "ГОТОВО" В КОНСТРУКТОРЕ ===
const addCustomBtn = document.getElementById('add-custom-pizza');

if (addCustomBtn) {
    addCustomBtn.addEventListener('click', () => {
        // Создаем объект кастомной пиццы
        const customPizza = {
            name: "Кастомная пицца",
            price: 4500, // Установи цену, какая тебе нравится
            img: "./img/пицца_конструктор.png", // Та самая картинка
            count: 1
        };

        // Проверяем, есть ли уже кастомная пицца в корзине
        const existingCustom = cart.find(item => item.name === customPizza.name);
        
        if (existingCustom) {
            existingCustom.count++;
        } else {
            cart.push(customPizza);
        }

        // Обновляем корзину
        updateCart();

        // Закрываем модалку
        constructorModal.style.display = 'none';
        
        // Маленький эффект: скроллим к виджету корзины, чтобы пользователь увидел результат
        cartWidget.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
}

    // === ЛОГИКА ДЛЯ АКЦИЙ (СПЕЦПРЕДЛОЖЕНИЯ) ===
document.querySelectorAll('.add-button').forEach(button => {
    button.addEventListener('click', function() {
        const offerCard = this.closest('.small-offer');
        if (!offerCard) return;

        const title = offerCard.querySelector('h4').innerText;
        const img = offerCard.querySelector('img').src;
        
        let price = 0;
        let itemName = title;

        // Задаем логику цены в зависимости от названия акции
        if (title.includes("Третья не лишняя")) {
            price = 7900; // Например, цена за 2 пиццы, а 3-я в уме
            itemName = "Акция: 2+1 Пиццы";
        } else if (title.includes("Первый заказ")) {
            price = 0;
            itemName = "Купон: Скидка 25%";
        }

        // Добавляем в массив корзины
        const existingOffer = cart.find(item => item.name === itemName);
        if (existingOffer) {
            existingOffer.count++;
        } else {
            cart.push({
                name: itemName,
                price: price,
                img: img,
                count: 1
            });
        }

        // Обновляем визуальную корзину
        updateCart();

        // Анимация кнопки для фидбека
        this.innerText = "Добавлено!";
        this.style.backgroundColor = "#28a745";
        setTimeout(() => {
            this.innerText = "Добавить";
            this.style.backgroundColor = ""; 
        }, 1500);
    });
});


    // Логика открытия мобильного меню
const mobileHeader = document.querySelector('header');

if (mobileHeader) {
    mobileHeader.addEventListener('click', function() {
        // Переключаем класс (открыто/закрыто)
        this.classList.toggle('header-active');
        
        // Запрещаем скролл страницы, когда меню открыто
        if (this.classList.contains('header-active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    });
}

// Закрытие меню при клике на любую ссылку внутри
document.querySelectorAll('nav ul li a').forEach(link => {
    link.addEventListener('click', () => {
        mobileHeader.classList.remove('header-active');
        document.body.style.overflow = 'auto';
    });
});
    // === 2. КОНСТРУКТОР ПИЦЦЫ (ИСПРАВЛЕНО) ===
    const pizzaHalves = [
        { half1: './img/пицца 1 лево.png', half2: './img/пицца 1 право.png' },
        { half1: './img/пицца 2 лево.png', half2: './img/пицца 2 право.png' },
        { half1: './img/пицца 3 лево.png', half2: './img/пицца 3 право.png' },
        { half1: './img/пицца 4 лево.png', half2: './img/пицца 4 право.png' },
        { half1: './img/пицца 5 лево.png', half2: './img/пицца 5 право.png' },
        { half1: './img/пицца 6 лево.png', half2: './img/пицца 6 право.png' },



    ];

    let currentHalf1 = 0;
    let currentHalf2 = 0;

    const pizzaHalfImg1 = document.getElementById('pizza-half-1');
    const pizzaHalfImg2 = document.getElementById('pizza-half-2');
    const constructorModal = document.getElementById('pizza-constructor-modal');
    const openConstructorBtn = document.querySelector('.go-button');

    function updatePizzaImages() {
        if (pizzaHalfImg1 && pizzaHalfImg2) {
            pizzaHalfImg1.src = pizzaHalves[currentHalf1].half1;
            pizzaHalfImg2.src = pizzaHalves[currentHalf2].half2;
        }
    }

    if (openConstructorBtn) {
        openConstructorBtn.addEventListener('click', () => {
            constructorModal.style.display = 'flex';
            updatePizzaImages();
        });
    }

    // Слушатели для стрелок (с проверкой на существование)
    const addArrowListener = (id, action) => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('click', action);
    };

    addArrowListener('top-arrow-1', () => { currentHalf1 = (currentHalf1 - 1 + pizzaHalves.length) % pizzaHalves.length; updatePizzaImages(); });
    addArrowListener('bottom-arrow-1', () => { currentHalf1 = (currentHalf1 + 1) % pizzaHalves.length; updatePizzaImages(); });
    addArrowListener('top-arrow-2', () => { currentHalf2 = (currentHalf2 - 1 + pizzaHalves.length) % pizzaHalves.length; updatePizzaImages(); });
    addArrowListener('bottom-arrow-2', () => { currentHalf2 = (currentHalf2 + 1) % pizzaHalves.length; updatePizzaImages(); });

    const closeConstructor = document.getElementById('close-constructor-modal');
    if (closeConstructor) {
        closeConstructor.onclick = () => constructorModal.style.display = 'none';
    }
});