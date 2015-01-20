Listener.Views.UserHeader = Backbone.View.extend({

  initialize: function(options){
    this.listenTo(Listener.currentUser, "signIn signOut", this.render);
    this.render();
  },

  events: {
    "click #sign-out-link": "signOut",
    "click #sign-in-link": "signIn"
  },

  template: JST['shared/user_header'],

  render: function(){
    var html = this.template({ currentUser: Listener.currentUser });
    this.$el.html(html);
    return this;
  },

  signOut: function(event){
    event.preventDefault();
    Listener.currentUser.signOut();
  },

  signIn: function (event) {
    event.preventDefault();
    var signInView = new Listener.Views.SignIn();
    Listener.modalRouter.trigger('swapModal', signInView)
  },

});
