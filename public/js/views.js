confab.views = {};

confab.views.MessageView = Backbone.View.extend({
  render: function() {
    $(this.el).html("<p>" + this.model.get('text') + "</p>");
    return this;
  }
});

confab.views.MessageListView = Backbone.View.extend({

});

confab.views.ApplicationView = Backbone.View.extend({
  initialize: function() {
    var messages = new confab.collections.MessageCollection();
    messages.create({ text: "Make me a sandwich." });
    messages.create({ text: "What? Make it yourself." });
    messages.create({ text: "sudo Make me a sandwich." });
    messages.create({ text: "Okay." });
  }
});

var app = new confab.views.ApplicationView;