Listener.Views.UsersShow = Backbone.CompositeView.extend({

  initialize: function(options){
    Backbone.GeneralView.prototype.initialize.call(this);
    this.listenTo(this.model, "reloadUser", this.render);
    this.content = options.content;
  },

  template: JST['users/show'],

  events: {
    'click .user-follow': 'toggleFollow',
    'click .user-btn': 'changeContent',
    'click .favorite': 'maybeFetchUser',
    'click .blog-follow': 'maybeFetchUser',
    "click #add-song-link": "createSong",
    "click #add-blog-link": "createBlog",
  },

  render: function(){
    var html = this.template({
      user: this.model,
      followed: this.model.followed()
      });
    this.$el.html(html);
    if (this.content == 'created_blogs') {
      this.renderCreatedBlogs();
    } else if (this.content == 'feed') {
      this.renderFeed();
    } else if (this.content == 'added-songs') {
      this.renderFeed();
    } else if (this.content == 'followed_blogs') {
      this.renderFollowedBlogs();
    } else {
      this.renderFavorites();
    }
    return this;
  },

  changeContent: function (event) {
    var targ = $(event.currentTarget);
    var id = targ.attr('id');
    if (id == 'btn-created-blogs') {
      this.renderCreatedBlogs();
    } else if (id == 'btn-favorites') {
      this.renderFavorites();
    } else if (id == 'btn-added-songs') {
      this.renderAddedSongs();
    } else if (id == 'btn-feed') {
      this.renderFeed();
    } else {
      this.renderFollowedBlogs();
    }
  },

  renderAddedSongs: function () {
    this.content = 'added-songs';
    var view = new Listener.Views.AddedSongs({model: this.model});
    this._swapView(view);
  },

  renderCreatedBlogs: function () {
    this.content = 'created_blogs';
    var view = new Listener.Views.CreatedBlogs({model: this.model});
    this._swapView(view);
  },

  renderFavorites: function () {
    this.content = 'favorites';
    var view = new Listener.Views.UserFavorites({model: this.model});
    this._swapView(view);
  },

  renderFeed: function () {
    this.content = 'feed';
    var view = new Listener.Views.UserFeed({model: this.model});
    this._swapView(view);
  },

  renderFollowedBlogs: function () {
    this.content = 'followed_blogs';
    var view = new Listener.Views.FollowedBlogs({model: this.model});
    this._swapView(view);
  },

  _swapView: function (view) {
    this._currentView && this._currentView.remove();
    this._currentView = view;
    $('.main').html(view.render().$el);
  },

  toggleFollow: function (event) {
    if (event) { event.preventDefault(); }
    var callback = this.toggleFollow.bind(this);
    if (!this._requireSignedIn(callback)) { return; }
    Listener.currentUser.toggleUserFollow(this.model.id);
    this.$('.user-follow').toggleClass("user-unfollow");
  },

  createSong: function (event) {
    event.preventDefault();
    var song = new Listener.Models.Song();
    var view = new Listener.Views.SongForm({
      model: song,
      collection: Listener.currentUser.addedSongs(),
    })
    Listener.modalRouter.trigger('swapModal', view)
  },

  createBlog: function (event) {
    event.preventDefault();
    var blog = new Listener.Models.Blog();
    var view = new Listener.Views.BlogForm({
      model: blog,
      collection: Listener.currentUser.createdBlogs(),
    })
    Listener.modalRouter.trigger('swapModal', view)
  },

  maybeFetchUser: function () {
    if (this.model.id == Listener.currentUser.id) {
      this.model.fetch();
    }
  },
});
