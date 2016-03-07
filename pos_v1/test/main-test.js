describe('pos', function () {
  var allItems;
  var inputs;

  beforeEach(function () {
    allItems = loadAllItems();
    inputs = [
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000003-2',
      'ITEM000005',
      'ITEM000005',
      'ITEM000005'
    ];
  });

  it('should print correct text', function () {

    spyOn(console, 'log');

    printReceipt(inputs);

    var expectText =
      '***<没钱赚商店>收据***\n' +
      '名称：雪碧，数量：5瓶，单价：3.00(元)，小计：12.00(元)\n' +
      '名称：荔枝，数量：2斤，单价：15.00(元)，小计：30.00(元)\n' +
      '名称：方便面，数量：3袋，单价：4.50(元)，小计：9.00(元)\n' +
      '----------------------\n' +
      '总计：51.00(元)\n' +
      '节省：7.50(元)\n' +
      '**********************';

    expect(console.log).toHaveBeenCalledWith(expectText);
  });
});

describe('getCartItems()', function () {
  var tags;
  var cartItems;
  var allItems;

  beforeEach(function () {
    allItems = loadAllItems();
    tags = [
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000003-2',
      'ITEM000005',
      'ITEM000005',
      'ITEM000005'
    ];
    cartItems = getCartItems(tags);
  });

  it("can split barcode and count", function () {
    var count;
    for (v of cartItems) {
      if (v.item.barcode === 'ITEM000003') {
        count = v.count;
      }
    }

    expect(count).toBe(2);
  });

  it("can merge same barcodes", function () {
    for (v of cartItems) {
      if (v.item.barcode === 'ITEM000005') {
        var count = v.count;
      }
    }
    expect(count).toBe(3);
  });

  it('can accord barcode find item', function () {
    var expectResult = [{
      item: {
        barcode: 'ITEM000001',
        name: '雪碧',
        unit: '瓶',
        price: 3.00
      },
      count: 5
    }, {
      item: {
        barcode: 'ITEM000003',
        name: '荔枝',
        unit: '斤',
        price: 15.00
      },
      count: 2
    }, {
      item: {
        barcode: 'ITEM000005',
        name: '方便面',
        unit: '袋',
        price: 4.50
      },
      count: 3
    }];

    expect(cartItems).toEqual(expectResult);
  });
});

describe('getReceiptItems()', function () {
  var cartItems;
  var promotions;

  beforeEach(function () {
    promotions = loadPromotions();
    cartItems = [{
      item: {
        barcode: 'ITEM000001',
        name: '雪碧',
        unit: '瓶',
        price: 3.00
      },
      count: 5
    }, {
      item: {
        barcode: 'ITEM000003',
        name: '荔枝',
        unit: '斤',
        price: 15.00
      },
      count: 2
    }, {
      item: {
        barcode: 'ITEM000005',
        name: '方便面',
        unit: '袋',
        price: 4.50
      },
      count: 3
    }];
  });

  it('can calculate every item subTotal and saveSubTotal', function () {
    var results = getReceiptItems(cartItems);
    var expectResult = [{
      cartItem: {
        item: {
          barcode: 'ITEM000001',
          name: '雪碧',
          unit: '瓶',
          price: 3.00
        },
        count: 5
      },
      subTotal: 12,
      saveSubTotal: 3
    }, {
      cartItem: {
        item: {
          barcode: 'ITEM000003',
          name: '荔枝',
          unit: '斤',
          price: 15.00
        },
        count: 2
      },
      subTotal: 30,
      saveSubTotal: 0
    }, {
      cartItem: {
        item: {
          barcode: 'ITEM000005',
          name: '方便面',
          unit: '袋',
          price: 4.50
        },
        count: 3
      },
      subTotal: 9,
      saveSubTotal: 4.5
    }];

    expect(results).toEqual(expectResult);
  });
});

describe('receipt()', function () {
  var receiptItems;

  beforeEach(function () {
    receiptItems = [{
      cartItem: {
        item: {
          barcode: 'ITEM000001',
          name: '雪碧',
          unit: '瓶',
          price: 3.00
        },
        count: 5
      },
      subTotal: 12,
      saveSubTotal: 3
    }, {
      cartItem: {
        item: {
          barcode: 'ITEM000003',
          name: '荔枝',
          unit: '斤',
          price: 15.00
        },
        count: 2
      },
      subTotal: 30,
      saveSubTotal: 0
    }, {
      cartItem: {
        item: {
          barcode: 'ITEM000005',
          name: '方便面',
          unit: '袋',
          price: 4.50
        },
        count: 3
      },
      subTotal: 9,
      saveSubTotal: 4.5
    }];
  });

  it('can receipt correct result', function () {
    var result = receipt(receiptItems);
    var expectResult =
      '***<没钱赚商店>收据***\n' +
      '名称：雪碧，数量：5瓶，单价：3.00(元)，小计：12.00(元)\n' +
      '名称：荔枝，数量：2斤，单价：15.00(元)，小计：30.00(元)\n' +
      '名称：方便面，数量：3袋，单价：4.50(元)，小计：9.00(元)\n' +
      '----------------------\n' +
      '总计：51.00(元)\n' +
      '节省：7.50(元)\n' +
      '**********************';

    expect(result).toEqual(expectResult);
  });
});
