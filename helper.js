var Helper = function () {};

Helper.prototype.buildTrackMyOrderSpeechText = function(pizzaData) {
    var orderCount = getOrderCount(pizzaData);

    var speechText;
    if (orderCount === 0) {
        speechText = "I didn't find any active orders for you."
    } else if (orderCount === 1) {
        var order = pizzaData["orders"]["OrderStatus"];
        speechText = buildOrderSentences(order)[0];
    } else {
        var sentences = [];
        sentences.push(orderCount + ' orders were found.');
        var orders = pizzaData["orders"]["OrderStatus"];
        if (allSameStatus(orders)) {
            sentences.push('All orders are ' + getOrderStatus(orders[0]) + '.');
        } else {
            for (var i = 0; i < orders.length; i++) {
                var order = orders[i];
                sentences.push('Order ' + (i + 1) + ' is ' + getOrderStatus(order) + '.');
            }
        }
        speechText = sentences.join(' ');
    }

    return speechText;
};

function getOrderCount(pizzaData) {
    if (!pizzaData || !pizzaData["orders"] || !pizzaData["orders"]["OrderStatus"]) {
        return 0;
    }

    var orderStatus = pizzaData["orders"]["OrderStatus"];

    if (orderStatus instanceof Array) {
        return orderStatus.length;
    } else {
        return 1;
    }
}

function getOrderStatus(order) {
    return order["OrderStatus"].toLowerCase();
}

function buildOrderSentences(order) {
    var sentences = [];
    sentences.push('Your order is ' + getOrderStatus(order));
    return sentences;
}

function allSameStatus(orders) {
    var status = getOrderStatus(orders[0]);
    for (var i = 0; i < orders.length; i++) {
        if (status !== getOrderStatus(orders[i])) {
            return false;
        }
    }
    return true;
}

module.exports = new Helper();