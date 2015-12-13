var APP_ID = 'amzn1.echo-sdk-ams.app.2e95bc57-f34e-40e0-b237-2766461bdbf5'; // replace with our APP_ID
var CUSTOMER_PHONE_NUMBER = 1234567890; // replace with your Domino's account phone number

var AlexaSkill = require('./AlexaSkill');
var pizzapi = require('dominos');

var DominosSkill = function () {
    AlexaSkill.call(this, APP_ID);
};

DominosSkill.prototype = Object.create(AlexaSkill.prototype);
DominosSkill.prototype.constructor = DominosSkill;

DominosSkill.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);

    // Any session init logic would go here.
};

DominosSkill.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("DominosSkill onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);

    tellAvailableCommands(response);
};

DominosSkill.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);

    //Any session cleanup logic would go here.
};

function tellAvailableCommands(response) {
    var speechText = "You can say, where's my pizza, or, track my order.";

    var speechOutput = {
        speech: speechText,
        type: AlexaSkill.speechOutputType.PLAIN_TEXT
    };
    var repromptOutput = {
        speech: speechText,
        type: AlexaSkill.speechOutputType.PLAIN_TEXT
    };
    response.ask(speechOutput, repromptOutput);
}

DominosSkill.prototype.intentHandlers = {
    "TrackMyPizza": function (intent, session, response) {
        trackMyPizza(session, response);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        tellAvailableCommands(response);
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    }
};

function trackMyPizza(session, response) {
    pizzapi.Track.byPhone(
        CUSTOMER_PHONE_NUMBER,
        function(pizzaData){
            var speechOutput = buildTrackMyPizzaSpeechOutput(pizzaData);
            response.tell(speechOutput);
        }
    );
}

function buildTrackMyPizzaSpeechOutput(pizzaData) {
    var orderCount = getOrderCount(pizzaData);

    var speechText;
    if (orderCount === 0) {
        speechText = "I didn't find any active orders for you."
    } else if (orderCount === 1) {
        var order = pizzaData["orders"]["OrderStatus"];
        speechText = buildOrderSpeechText(order)
    } else {
        speechText = orderCount + " orders were found. ";
        var orders = pizzaData["orders"]["OrderStatus"];
        for (var i = 0; i < orders.length; i++) {
            var order = orders[i];
            speechText += buildOrderSpeechText(order, i);
        }
    }

    var speechOutput = {
        speech: speechText,
        type: AlexaSkill.speechOutputType.PLAIN_TEXT
    };

    return speechOutput;
}

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

function buildOrderSpeechText(order, orderIndex) {
    var speechText = "";
    if (orderIndex) {
        speechText += "Order " + (orderIndex + 1) + ", a " + order["ServiceMethod"] + " order ";
    } else {
        speechText += "An order ";
    }
    return speechText + "for " + order["OrderDescription"].replace("\n", "") + " placed by " + order["CsrName"] + " is " + order["OrderStatus"] + ". ";
}

exports.handler = function (event, context) {
    var skill = new DominosSkill();
    skill.execute(event, context);
};
