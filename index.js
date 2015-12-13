var APP_ID = 'amzn1.echo-sdk-ams.app.2e95bc57-f34e-40e0-b237-2766461bdbf5';
var CUSTOMER_PHONE_NUMBER = 1234567890;

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
    var speechText;
    if (hasActiveOrder(pizzaData)) {
        speechText = 'Your order is ' + pizzaData["orders"]["OrderStatus"]["OrderStatus"];
    } else {
        speechText = 'No active orders were found for your account.';
    }

    var speechOutput = {
        speech: speechText,
        type: AlexaSkill.speechOutputType.PLAIN_TEXT
    };

    return speechOutput;
}

function hasActiveOrder(pizzaData) {
    return pizzaData && pizzaData["orders"] && pizzaData["orders"]["OrderStatus"] && pizzaData["orders"]["OrderStatus"]["OrderStatus"];
}

exports.handler = function (event, context) {
    var skill = new DominosSkill();
    skill.execute(event, context);
};