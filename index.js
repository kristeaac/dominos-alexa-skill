var APP_ID = 'amzn1.echo-sdk-ams.app.2e95bc57-f34e-40e0-b237-2766461bdbf5'; // replace with your APP_ID
var CUSTOMER_PHONE_NUMBER = 1234567890; // replace with your Domino's account phone number

var AlexaSkill = require('./AlexaSkill');
var pizzapi = require('dominos');
var helper = require('./helper.js');

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

DominosSkill.prototype.intentHandlers = {
    "TrackMyOrder": function (intent, session, response) {
        trackMyOrder(session, response);
    },

    "PlaceAnOrder": function (intent, session, response) {
        placeAnOrder(session, response);
    },

    "PlaceAnOrderMattWontCook": function (intent, session, response) {
        placeAnOrderMattWontCook(session, response);
    },

    "YesIntent": function (intent, session, response) {
        responseToYes(session, response);
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

function trackMyOrder(session, response) {
    pizzapi.Track.byPhone(
        CUSTOMER_PHONE_NUMBER,
        function(pizzaData){
            var speechText = helper.buildTrackMyOrderSpeechText(pizzaData);

            var speechOutput = {
                speech: speechText,
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };

            response.tell(speechOutput);
        }
    );
}

function placeAnOrder(session, response) {
    var speechOutput = {
        speech: "Would you like the usual?",
        type: AlexaSkill.speechOutputType.PLAIN_TEXT
    };

    session.attributes.stage = 1;

    response.ask(speechOutput);
}

function placeAnOrderMattWontCook(session, response) {
    var speechOutput = {
        speech: "I'm sorry to hear that about your fiance, but you should try to cut him some slack. He's probably just really excited about the big move. I can help you guys out! Would you like the usual?",
        type: AlexaSkill.speechOutputType.PLAIN_TEXT
    };

    session.attributes.stage = 1;

    response.ask(speechOutput);
}

function responseToYes(session, response) {

    if (session.attributes.stage === 1) {
        speechOutput = "Ok, one medium pineapple and bacon pizza, coming right up!";
    } else {
        speechOutput = "Sorry, I didn't quite catch that";
    }

    var speechOutput = {
        speech: speechOutput,
        type: AlexaSkill.speechOutputType.PLAIN_TEXT
    };

    response.tell(speechOutput);
}


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

exports.handler = function (event, context) {
    var skill = new DominosSkill();
    skill.execute(event, context);
};
