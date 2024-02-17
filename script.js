async function scanBarcode() {
  Quagga.init({
    inputStream : {
      name : "Live",
      type : "LiveStream",
      target: document.querySelector('#scanner-container')
    },
    decoder : {
      readers : ["ean_reader"]
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

    const description = getProductDescription(barcode);
    const price = getProductPrice(barcode);

    showProductInfo(description, price);
  });
}

function getProductDescription(barcode) {
  if (barcode === "8710428998392") {
    return "Milk for slim";
  } else {
    return "Unknown product";
  }
}

function getProductPrice(barcode) {
  if (barcode === "8710428998392") {
    return "$100";
  } else {
    return "N/A";
  }
}

function showProductInfo(description, price) {
  const productInfoDiv = document.getElementById('product-info');
  productInfoDiv.style.display = 'block';
  document.getElementById('description').textContent = `Description: ${description}`;
  document.getElementById('price').textContent = `Price: ${price}`;
}
