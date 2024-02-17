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
      alert("Product not found!");
    }
  });
}

function getProductInfo(barcode) {
  // Simulated product data
  const products = {
    "8710428998392": {
      title: "Milk for Slim",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed fermentum sit amet justo a dictum. Donec eget risus sapien. Vestibulum aliquet feugiat erat, ut tincidunt neque. Ut fringilla tellus vitae justo fringilla, ac suscipit neque cursus.",
      price: "$100",
      image: "milk.jpg"
    },
    "8850952925102": {
      title: "Candy Cup",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed fermentum sit amet justo a dictum. Donec eget risus sapien. Vestibulum aliquet feugiat erat, ut tincidunt neque. Ut fringilla tellus vitae justo fringilla, ac suscipit neque cursus.",
      price: "$50",
      image: "candy_cup.jpg"
    }
    // Add more product data as needed
  };

  return products[barcode];
}

function showPopup(productInfo) {
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
  const popup = document.getElementById('product-info');
  popup.style.display = 'none';
}
