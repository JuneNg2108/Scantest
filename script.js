let productData = [];
let customerType = '';

document.addEventListener('DOMContentLoaded', () => {
    showCustomerTypeModal();
    setupSearch(); // Setup search functionality
});

function showCustomerTypeModal() {
    // Create and show the modal for customer type selection
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
        loadProductData('BanLe.json');
        modal.style.display = "none";
    });

    document.getElementById('wholesaleCustomerBtn').addEventListener('click', function() {
        loadProductData('BanBuon.json');
        modal.style.display = "none";
    });
}

async function loadProductData(jsonFile) {
    try {
        const response = await fetch(jsonFile);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        productData = await response.json();
        console.log("Product data loaded successfully");
        // Initialize the scanner or other components that depend on product data here
    } catch (error) {
        console.error(`Failed to load product data from ${jsonFile}:`, error);
    }
}



// Refactor the Quagga.init logic into a reusable function for starting the scanner
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
        const productInfo = getProductInfo(barcode);
        if (productInfo) {
            showPopup(productInfo);
        } else {
            alert("No product found!");
        }
    });
}

function getProductInfo(barcode) {
    const product = productData.find(product => product.Code === barcode);
    if (product) {
        return {
            title: product.Name,
            description: 'Available', // Since Description is not provided
            price: `${product.Gia} VND`, // Use Gia for price
            image: 'path/to/default_product_image.jpg' // Placeholder image path
        };
    }
    return null;
}

function showPopup(productInfo) {
    // Modify to display just title, description, and Price based on customer type
    const popup = document.getElementById('product-info');
    const titleElement = document.getElementById('product-title');
    const imageElement = document.getElementById('product-image');
    const descriptionElement = document.getElementById('product-description');
    const priceElement = document.getElementById('product-price');

    titleElement.textContent = productInfo.title;
    imageElement.src = productInfo.image;
    descriptionElement.textContent = productInfo.description;
    priceElement.textContent = `Price: ${productInfo.price}`;

    popup.style.display = 'block';
}

function closePopup() {
    // Close the popup and optionally restart the scanner
    const popup = document.getElementById('product-info');
    popup.style.display = 'none';
    startScanner();
}

// Setup the search functionality
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');

    searchInput.addEventListener('input', function() {
        const value = searchInput.value.toLowerCase();
        const filteredProducts = productData.filter(product =>
            product.Name.toLowerCase().includes(value) || product.Code.includes(value)
        );

        searchResults.innerHTML = ''; // Clear previous results
        filteredProducts.forEach(product => {
            const div = document.createElement('div');
            div.textContent = `${product.Name} (${product.Code})`;
            div.addEventListener('click', () => {
                searchInput.value = ''; // Optionally clear search input
                searchResults.style.display = 'none'; // Hide results
                showPopup(getProductInfo(product.Code)); // Show popup for clicked product
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
    scannerContainer.style.height = `${windowHeight * 0.5}px`; // Adjust as needed
});

// Execute loadProductData on page load, start the scanner and setup search functionality
document.addEventListener('DOMContentLoaded', async () => {
    await loadProductData();
    setupSearch(); // Setup search functionality after loading product data
});

// Adjust or remove the button's event listener based on your design decision
const scanBtn = document.getElementById('scanBtn');
scanBtn.addEventListener('click', function() {
    startScanner(); // Optionally restart the scanner manually
});
