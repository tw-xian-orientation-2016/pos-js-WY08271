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

function getReceiptItems(cartItems) {
  var receiptItems = [];

  cartItems.forEach(function (cartItem) {
    var saveSubTotal = getSaveSubTotal(cartItem);
    receiptItems.push({
      cartItem: cartItem,
      saveSubTotal: getSaveSubTotal(cartItem),
      subTotal: getSubTotal(cartItem, saveSubTotal)
    });
  });

  return receiptItems;
}

function getSubTotal(cartItem, saveSubTotal) {
  return cartItem.item.price * cartItem.count - saveSubTotal;
}

function getSaveSubTotal(cartItem) {
  var saveCount = isDiscount(cartItem) ? Math.floor(cartItem.count / 3) : 0;

  return cartItem.item.price * saveCount;
}

function isDiscount(cartItem) {
  var discountBarcodes = getBuyTwoGetOnePromotions();
  var isExist = false;

  discountBarcodes.forEach(function (discountBarcode) {
    if (discountBarcode === cartItem.item.barcode) {
      isExist = true;
    }
  });

  return isExist;
}

function getBuyTwoGetOnePromotions() {
  var promotions = loadPromotions();
  var discountBarcodes;

  promotions.forEach(function (promotion) {
    if (promotion.type === 'BUY_TWO_GET_ONE_FREE') {
      discountBarcodes = promotion.barcodes;
    }
  });

  return discountBarcodes;
}

function formatPrice(price) {
  return price.toFixed(2);
}

function receipt(receiptItems) {
  var result = '***<没钱赚商店>收据***\n';
  var amount = 0;
  var saveAmount = 0;

  receiptItems.forEach(function (receiptItem) {
    var item = receiptItem.cartItem.item;
    result += '名称：' + item.name + '，数量：' + receiptItem.cartItem.count + item.unit + '，单价：' + formatPrice(item.price) + '(元)，小计：' + formatPrice(receiptItem.subTotal) + '(元)\n';
    amount += receiptItem.subTotal;
    saveAmount += receiptItem.saveSubTotal;
  });

  result += '----------------------\n' + '总计：' + formatPrice(amount) + '(元)\n' +
    '节省：' + formatPrice(saveAmount) + '(元)\n' +
    '**********************';

  return result;
}

function printReceipt(tags) {
  var cartItems = getCartItems(tags);
  var receiptItems = getReceiptItems(cartItems);
  var result = receipt(receiptItems);

  console.log(result);
}
