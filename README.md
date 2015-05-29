# Automated App Testing POC

Requirements
* ANDROID_HOME is pointing to your Android SDK
* Android 4.4 device plugged into your computer

## To run

1. Install dependencies:

* `cd sample-app/native-app`
* `npm install`

2. Start the server:

* `cd ../site`
* `npm install`
* `node index.js`

This will spin up a server at http://localhost:5000.
Note your local IP address - you will need it to link the sample site with the app. 

3. In your editor of choice, open `sample-app/native-app/app/app.js`. Change `BASE_URL` to your sample site:

`var BASE_URL = 'http://<Your IP Address>:5000/';`

4. In Android Studio, select the "Import Project" menu option. Select the `/native-app` folder. 

5. Go to "Run", "Run `scaffold`" and launch the emulator. 

This should generate .apk's in `/sample-app/native-app/scaffold/build/outputs/apk`. 

6. Copy the .apk to the `webview-sample/app` folder. Link it with Appium by editing `webview-sample/appium/tests/functional/helpers/apps.js`

7. If appium is [installed via npm](http://appium.io/):

* `cd appium`
* `./appium.sh`

or

* run Appium server `appium` or Launch the [desktop app](https://github.com/appium/appium-dot-app)
* `grunt test:android`


## Tests

The test cases are located in `appium/tests/functional/common/astro-tests.js` and are called in `../android/astro-specs.js`. **In `webViewTest`, the `.c-product-list` element can be found, but none of its descendants are accessible.**

Secondly, in `astro-specs.js`, if I run both tests one after the other, the second one will fail as it starts running before the app is fully launched. How do we correctly set up and tear down our test cases, or how can we block the tests from running until the app is completely launched?  