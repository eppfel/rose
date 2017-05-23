/*
Copyright (C) 2015-2016
    Oliver Hoffmann <oliverh855@gmail.com>
    Felix Epp <work@felixepp.de>

This file is part of ROSE.

ROSE is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

ROSE is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with ROSE.  If not, see <http://www.gnu.org/licenses/>.
*/
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
  this.route('extracts', { path: '/:network_name/extracts'});
  this.route('study-creator');
  this.route('debug-log', {});
  this.route('observers');
  this.route('observer', { path: '/observer/:observer_id' });
  this.route('data-converter');
});
