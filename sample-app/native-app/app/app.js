require([
    'astro',
    'bluebird',
    'plugins/applicationPlugin',
    'plugins/webViewPlugin',
    'plugins/anchoredLayoutPlugin',
    'plugins/headerBarPlugin',
    'plugins/drawerPlugin'
],
function(
    Astro,
    Promise,
    ApplicationPlugin,
    WebViewPlugin,
    AnchoredLayoutPlugin,
    HeaderBarPlugin,
    DrawerPlugin
) {

    // Enter your site url here
    var BASE_URL = 'http://10.10.1.98:5000/';

    // Initialize plugins
    var applicationPromise = ApplicationPlugin.init();
    var mainWebViewPromise = WebViewPlugin.init();
    var layoutPromise = AnchoredLayoutPlugin.init();
    var headerPromise = HeaderBarPlugin.init();
    var drawerPromise = DrawerPlugin.init();

    // Initialize a web view for the cart
    var cartWebViewPromise = WebViewPlugin.init();

    // Start the app at the base url
    mainWebViewPromise.then(function(mainWebView) {
        mainWebView.navigate(BASE_URL);
    });

    // Use mainWebView as the main content view for our layout
    Promise.join(layoutPromise, mainWebViewPromise, function(layout, mainWebView) {
        layout.setContentView(mainWebView.address);
    });

    // Route all unhandled key presses to mainWebView
    Promise.join(applicationPromise, mainWebViewPromise, function(application, mainWebView){
        application.setMainInputPlugin(mainWebView.address);
    });

    // When the header bar is ready, load its icons.
    headerPromise.then(function(headerBar){
        headerBar.setLeftIcon(BASE_URL + '/images/account.png');
        headerBar.setRightIcon(BASE_URL + '/images/cart.png');
        headerBar.setCenterIcon(BASE_URL + '/images/velo.png');
        headerBar.setBackgroundColor('#FFFFFF');
    });

    // Add the header bar once `layoutPromise` and `headerPromise` are fulfilled.
    Promise.join(layoutPromise, headerPromise, function(layout, headerBar) {
        layout.addTopView(headerBar.address);
        headerBar.show();
    });

    // Set the drawer's content area once `drawerPromise` and `layoutPromise` are fulfilled.
    Promise.join(drawerPromise, layoutPromise, function(drawer, layout) {
        drawer.setContentView(layout.address);
    });

    // Set the `DrawerPlugin` instance as the main view of the application once the promises are fulfilled.
    Promise.join(drawerPromise, applicationPromise, function(drawer, application) {
        application.setMainViewPlugin(drawer.address);
    });

    // Navigate the web view to the cart
    cartWebViewPromise.then(function(webView) {
        webView.navigate(BASE_URL + "cart/");
    });

    // Set the right drawer view to the cart web view instance once the promises have been fulfilled.
    var rightDrawerPromise = Promise.join(cartWebViewPromise, drawerPromise, function(cartWebView, drawer) {
        var rightDrawer = drawer.initRightMenu(cartWebView.address);
        // We want the right drawer later, so we will return it
        return rightDrawer;
    });


    // Bind the `rightIconClick` event once the promises have been fulfilled.
    Promise.join(rightDrawerPromise, headerPromise, function(rightDrawer, header) {
        header.on('rightIconClick', function() {
            rightDrawer.toggle();
        });
    });

    // Add a handler on the main web view to open drawer when 'addToCartClicked' event happens.
    Promise.join(mainWebViewPromise, rightDrawerPromise, function(mainWebView, rightDrawer) {
        mainWebView.on('addToCartClicked', function() {
            rightDrawer.open();
        });
    });

}, undefined, true);
