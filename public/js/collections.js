confab.collections = {};

confab.collections.MessageCollection = Backbone.Collection.extend({
  model: confab.models.Message,

  comparator: function(message) {
    return message.get('timestamp');
  }
});