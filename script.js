// Initialize an empty object for product data
let productData = {
let productData = {
  "22400393650": {
    title: "dầu gội tresemme mỹ 828ml",
    price: "125000 VND",
    image: "path_to_image_of_22400393650.jpg"
  },
  "22400393667": {
    title: "dầu gội tresemme mỹ 828ml",
    price: "125000 VND",
    image: "path_to_image_of_22400393667.jpg"
  },
  // Add the rest of the products in a similar fashion
  // Note: You should add the actual image paths and additional product details if available
};

async function scanBarcode() {
  Quagga.init({
    inputStream: {
      name: "Live",
      type: "LiveStream",
      target: document.querySelector('#scanner-container')
    },
    decoder: {
      readers: ["ean_reader"]
    }
  }, function (err) {
    if (err) {
      console.error('Failed to initialize Quagga:', err);
      return;
    }
    Quagga.start();
  });

  Quagga.onDetected(function (data) {
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
  // Retrieve product information by barcode
  return productData[barcode];
}

function showPopup(productInfo) {
  const popup = document.getElementById('product-info');
  const titleElement = document.getElementById('product-title');
  const imageElement = document.getElementById('product-image');
  const descriptionElement = document.getElementById('product-description');
  const priceElement = document.getElementById('product-price');

  titleElement.textContent = productInfo.title;
  imageElement.src = productInfo.image;
  descriptionElement.textContent = productInfo.description || 'No description available.';
  priceElement.textContent = `Price: ${productInfo.price}`;

  popup.style.display = 'block';
}

function closePopup() {
  const popup = document.getElementById('product-info');
  popup.style.display = 'none';
}

// Adjust scanner container height for smaller screens
window.addEventListener('resize', function() {
  const scannerContainer = document.getElementById('scanner-container');
  const windowHeight = window.innerHeight;
  scannerContainer.style.height = `${windowHeight * 0.5}px`; // Adjust as needed
});

// Scan barcode on button click
const scanBtn = document.getElementById('scanBtn');
scanBtn.addEventListener('click', function() {
  scanBarcode();
});
