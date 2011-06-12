confab.controllers = {};

confab.controllers.Main = Backbone.Controller.extend({
  routes: {
    "*actions": "defaultRoute" // matches http://example.com/#anything-here
  },
  defaultRoute: function(actions) {
    alert(actions);
  }
});

// Start the app
confab.app = new confab.controllers.Main;
Backbone.history.start();