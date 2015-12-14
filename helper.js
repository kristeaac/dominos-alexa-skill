var Helper = function () {};

Helper.prototype.log = function () {
    console.log('buz!');
};

Helper.prototype.getOrderCount = function(pizzaData) {
    if (!pizzaData || !pizzaData["orders"] || !pizzaData["orders"]["OrderStatus"]) {
        return 0;
    }

    var orderStatus = pizzaData["orders"]["OrderStatus"];

    if (orderStatus instanceof Array) {
        return orderStatus.length;
    } else {
        return 1;
    }
};

Helper.prototype.buildOrderSpeechText = function(order, orderIndex) {
    var speechText = "";
    if (orderIndex) {
        speechText += "Order " + (orderIndex + 1) + ", a " + order["ServiceMethod"] + " order ";
    } else {
        speechText += "An order ";
    }
    return speechText + "for " + order["OrderDescription"].replace("\n", "") + " placed by " + order["CsrName"] + " is " + order["OrderStatus"] + ". ";
};

Helper.prototype.buildTrackMyOrderSpeechText = function(pizzaData) {
    var orderCount = this.getOrderCount(pizzaData);

    var speechText;
    if (orderCount === 0) {
        speechText = "I didn't find any active orders for you."
    } else if (orderCount === 1) {
        var order = pizzaData["orders"]["OrderStatus"];
        speechText = this.buildOrderSpeechText(order)
    } else {
        speechText = orderCount + " orders were found. ";
        var orders = pizzaData["orders"]["OrderStatus"];
        for (var i = 0; i < orders.length; i++) {
            var order = orders[i];
            speechText += this.buildOrderSpeechText(order, i);
        }
    }

    return speechText;
};

module.exports = new Helper();