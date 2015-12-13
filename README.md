Domino's Alexa Skill
====
This is an unpublished Skill for Alexa that uses [AWS Lambda](https://aws.amazon.com/lambda/) and the [Domino's PizzaAPI](https://github.com/RIAEvangelist/node-dominos-pizza-api) to enable you to __track your Domino's order entirely hands-free__ through an Amazon Echo device.

The Domino's PizzaAPI is a node.js wrapper for Domino's API which is not officially released and supported for third-party integrations like this. As such, you'll need to hardcode some of your Domino's account details to make this Skill work. More on that in the installation guide below.

Installation
====
### Add a New Alexa Skill and Lambda function
* Follow [this guide](https://developer.amazon.com/appsandservices/solutions/alexa/alexa-skills-kit/docs/developing-an-alexa-skill-as-a-lambda-function) for setting up a new Alexa Skill and Lambda function. If you're new to these platforms, I recommend running through this guide with its examples before attempting to add this new Skill. 
* In your new Alexa Skill's interaction model, replace the intent schema with the contents of [intent-schema.json](intent-schema.json) and the sample utterances with the contents of [sample-utterances.txt](sample-utterances.txt)
* Take note of your new Skill's app ID. You'll use this value in the source code below.

### Prepare and build the Lambda function for upload
* Checkout this repository and replace the values of the `APP_ID` and `CUSTOMER_PHONE_NUMBER` constants defined in [index.js](index.js)
    * You can find your app ID under the Skill Information section of your new Skill
    * The phone number should be the phone number registered in your Domino's account
* Package the function by running the `build.sh` script. This will create a .ZIP file of code in this repository's root for you to upload to use as your Lambda function
* Upload the new .ZIP file, then save and test it

Example Voice Commands
====
### To track your order
```
Alexa, tell Domino's to check on my order.
```

```
Alexa, ask Domino's where's my pizza?
```

### To get help
```
Alexa, ask Domino's how do I track my order?
```






