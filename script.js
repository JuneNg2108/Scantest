let productData = [];
let customerType = ''; // 'retail' for BanLe.json, 'wholesale' for BanBuon.json

document.addEventListener('DOMContentLoaded', () => {
    showCustomerTypeModal();
});

function showCustomerTypeModal() {
    let modalHTML = `
        <div id="customerTypeModal" class="modal">
            <div class="modal-content">
                <h2>Bạn là khách hàng nào?</h2>
                <button id="retailCustomerBtn">Khách Lẻ</button>
                <button id="wholesaleCustomerBtn">Khách Buôn</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = document.getElementById('customerTypeModal');
    modal.style.display = "block";

    document.getElementById('retailCustomerBtn').addEventListener('click', function() {
        customerType = 'retail';
        loadProductData('BanLe.json');
        modal.style.display = "none";
    });

    document.getElementById('wholesaleCustomerBtn').addEventListener('click', function() {
        customerType = 'wholesale';
        loadProductData('BanBuon.json');
        modal.style.display = "none";
    });
}

async function loadProductData(jsonFile) {
    try {
        const response = await fetch(jsonFile);
        productData = await response.json();
        // No need to call startScanner here if you want the user to initiate scanning manually
    } catch (error) {
        console.error(`Failed to load product data from ${jsonFile}:`, error);
    }
    // Call setupSearch after the product data is loaded to ensure it works with the loaded data
    setupSearch();
}

function startScanner() {
    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.querySelector('#scanner-container')
        },
        decoder: {
            readers: ["ean_reader"]
        }
    }, function(err) {
        if (err) {
            console.error('Failed to initialize Quagga:', err);
            return;
        }
        Quagga.start();
    });

    Quagga.onDetected(function(data) {
        Quagga.stop();
        const barcode = data.codeResult.code;
        showPopup(getProductInfo(barcode));
    });
}

function getProductInfo(barcode) {
    const product = productData.find(product => product.Code === barcode);
    if (product) {
        return {
            title: product.Name,
            price: `${product.Price} VND`, // Directly using 'Price' from the loaded data
            image: 'path/to/default_product_image.jpg' // Placeholder image path
        };
    }
    return null;
}

function showPopup(productInfo) {
    if (!productInfo) {
        alert("No product found!");
        return;
    }
    const popup = document.getElementById('product-info');
    const titleElement = document.getElementById('product-title');
    const imageElement = document.getElementById('product-image');
    const priceElement = document.getElementById('product-price');

    titleElement.textContent = productInfo.title;
    imageElement.src = productInfo.image;
    priceElement.textContent = `Price: ${productInfo.price}`;

    popup.style.display = 'block';
}

function closePopup() {
    const popup = document.getElementById('product-info');
    popup.style.display = 'none';
}

function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');

    searchInput.addEventListener('input', function() {
        const value = searchInput.value.toLowerCase();
        searchResults.innerHTML = '';
        const filteredProducts = productData.filter(product => product.Name.toLowerCase().includes(value) || product.Code.includes(value));
        filteredProducts.forEach(product => {
            const div = document.createElement('div');
            div.textContent = `${product.Name} (${product.Code})`;
            div.addEventListener('click', () => {
                searchInput.value = '';
                searchResults.style.display = 'none';
                showPopup(product);
            });
            searchResults.appendChild(div);
        });
        searchResults.style.display = filteredProducts.length > 0 ? 'block' : 'none';
    });
}

// Adjust scanner container height for smaller screens
window.addEventListener('resize', function() {
    const scannerContainer = document.getElementById('scanner-container');
    const windowHeight = window.innerHeight;
    scannerContainer.style.height = `${windowHeight * 0.5}px`;
});

const scanBtn = document.getElementById('scanBtn');
scanBtn.addEventListener('click', function() {
    startScanner();
});





