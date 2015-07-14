/*
Copyright (C) 2015
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
let model = Backbone.Model.extend({
  sync: Backbone.kangoforage.sync('systemConfig'),
  id: '0',
  defaults: {
    autoUpdateIsEnabled: false,
    fileName: 'rose-study-configuration.txt',
    roseCommentsIsEnabled: true,
    roseCommentsRatingIsEnabled: true,
    salt: 'ROSE',
    hashLength: 8,
    repositoryURL: 'https://secure-software-engineering.github.io/rose/test/base.json',
    fingerprint: '25E7 69C6 97EC 2C20 DA3B DDE9 F188 CF17 0FA2 34E8'
  }
});

export default model;