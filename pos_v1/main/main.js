function getCartItems(tags) {
  var cartItems = [];
  for (var i = 0; i < tags.length; i++) {
    var barcode = tags[i].split('-')[0];
    var count = parseFloat(tags[i].split('-')[1] || 1);
    var existBarcode = findBarcode(barcode, cartItems);

    if (existBarcode) {
      existBarcode.count += count;
    } else {
      cartItems.push({
        item: findItem(barcode),
        count: count
      });
    }
  }

  return cartItems;
}

function findItem(barcode) {
  var allItems = loadAllItems();
  var item;

  for (var i = 0; i < allItems.length; i++) {
    if (allItems[i].barcode === barcode) {
      item = allItems[i];
    }
  }
  return item;
}

function findBarcode(barcode, cartItems) {
  for (var i = 0; i < cartItems.length; i++) {
    if (cartItems[i].item.barcode === barcode) {
      return cartItems[i];
    }
  }
}
