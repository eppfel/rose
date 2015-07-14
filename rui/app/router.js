import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

export default Router.map(function() {
  this.route('about');
  this.route('help');
  this.route('diary');
  this.route('backup');
  this.route('settings');
  this.route('comments', { path: '/:network_name/comments'});
  this.route('interactions', { path: '/:network_name/interactions'});
  this.route('privacysettings', { path: '/:network_name/privacysettings'});
  this.route('study-creator');
});