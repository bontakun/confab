confab.models = {};

confab.models.Message = Backbone.Model.extend({
  EMPTY: "empty message...",

  initialize: function() {
    if (!this.get("text")) {
      this.set({"text": this.EMPTY});
    }
  },

  sync: function() {
    // Noop
  }
});
