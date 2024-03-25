let iconcart = document.querySelector('.icon-cart'); 
let closecart = document.querySelector('.close');
let body = document.querySelector('body');

let listproductHTML = document.querySelector('.listproduct');
let listcartHTML = document.querySelector('.listcart')
let iconcartSpan = document.querySelector('.icon-cart span')

let listproduct = [];
let carts = [];

// opening and closing of shopping cart on clicking of carticon or close button
iconcart.addEventListener('click', ()=>{
    //if showcart class hai toh remove krega click krnepe or nhi hoga toh add kr dega mtln dikhega
    body.classList.toggle('showcart'); 
});

closecart.addEventListener('click',()=>{
    body.classList.toggle('showcart');
})


//products ko product list mai add kr diya
const addDataToHTML = ()=>{
    listproductHTML.innerHTML = '';
    if(listproduct.length > 0){
        listproduct.forEach(product =>{
            let newProduct = document.createElement('div');
            newProduct.classList.add('item');
            newProduct.dataset.id = product.id;
            newProduct.innerHTML = `
                <img src="${product.image}" alt="">
                <h2>${product.name}</h2>
                <div class="price">$${product.price}</div>
                <button class="addcart">
                    ADD TO CART
                </button>
                `;
            listproductHTML.appendChild(newProduct);
        })
    }
};

//we have capture the event of user clicking on add to cart button
listproductHTML.addEventListener('click', (event) =>{
    let positionClick = event.target;
    if(positionClick.classList.contains('addcart')){
        //get the product id
        let product_id = positionClick.parentElement.dataset.id;
        addToCart(product_id);
    }
})

//add to cart 
const addToCart = (product_id) => {

    let positionThisProdcutInCart = carts.findIndex((value)=> value.product_id==product_id);
    if(carts.length <= 0){
        carts = [{
            product_id: product_id,
            quantity: 1
        }]
    }
    else if(positionThisProdcutInCart<0){
        carts.push({
            product_id: product_id,
            quantity: 1,
        })
    }else{
        carts[positionThisProdcutInCart].quantity = carts[positionThisProdcutInCart].quantity + 1;
    }

    // console.log(carts);
    addCartToHTML();
    addCartToMemory();
}

const addCartToMemory = () => {
    localStorage.setItem('cart',JSON.stringify(carts));
}


const addCartToHTML = () =>{
    listcartHTML.innerHTML = '';
    let totalQuantity = 0;
    if(carts.length > 0){
        carts.forEach( cart=> {
            totalQuantity = totalQuantity+cart.quantity;
            let newcart = document.createElement('div');
            newcart.dataset.id = cart.product_id;
            let positionProduct = listproduct.findIndex((value)=> value.id == cart.product_id );
            newcart.classList.add('item');
            let info = listproduct[positionProduct];
            newcart.innerHTML = `
                <div class="image">
                        <img src="${info.image}" alt="">
                </div>
                <div class="name">
                        ${info.name}
                </div>
                <div class="totalprice">
                    $${info.price*cart.quantity}
                </div>
                <div class="quantity">
                    <span class="minus"><</span>
                    <span>${cart.quantity}</span>
                    <span class="plus">></span>
                </div>
            
            `;
            listcartHTML.appendChild(newcart);
        })
    }
    iconcartSpan.innerText = totalQuantity;
}

listcartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if(positionClick.classList.contains('minus') || positionClick.classList.contains('plus')){
        let product_id = positionClick.parentElement.parentElement.dataset.id;
        // console.log(product_id);
        let type = 'minus';
        if(positionClick.classList.contains('plus')){
            type = 'plus';
        }
        changeQuantity(product_id, type);
    }
});

const changeQuantity = (product_id, type) => {
    let positionItemCart = carts.findIndex((value) => value.product_id ==  product_id);
    if(positionItemCart >= 0){
        switch (type) {
            case 'plus':
                carts[positionItemCart].quantity = carts[positionItemCart].quantity + 1;
                break;
        
            default:
                let valueChange = carts[positionItemCart].quantity-1;
                if(valueChange>0){
                    carts[positionItemCart].quantity = valueChange;
                }else{
                    carts.splice(positionItemCart, 1);
                }
                break;
        }
    }
    addCartToMemory();
    addCartToHTML();
}

const initApp = () =>{
    //get data from  json
    fetch('products.json')
    .then(Response => Response.json())
    .then(data => {
        listproduct = data;
        // console.log(listproduct);
        addDataToHTML();

        //everytime user visits the website check the cart in memory if it exists
        if(localStorage.getItem('cart')){
            carts= JSON.parse(localStorage.getItem('cart'));
            addCartToHTML();  
        }

    })
};
initApp();



