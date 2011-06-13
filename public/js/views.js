confab.views = {};

confab.views.MessageView = Backbone.View.extend({
  render: function() {
    // TODO: Add mustache to the client side
    var div = document.createElement("div");
    div.innerHTML = "<p>" + this.model.get('text') + "</p>";
    this.el = div;
    return this;
  }
});

