/*
ROSE is a browser extension researchers can use to capture in situ
data on how users actually use the online social network Facebook.
Copyright (C) 2015

    Fraunhofer Institute for Secure Information Technology
    Andreas Poller <andreas.poller@sit.fraunhofer.de>

Authors

    Oliver Hoffmann <oliverh855@gmail.com>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

let type = 'window';
let open = false;
let active = false;

let store = function() {
  return new Promise((resolve) => {
    kango.invokeAsyncCallback('localforage.getItem', type + '-activity-records', (records) => {
      records = records || [];
      records.push({
        type: type,
        date: Date.now(),
        value: {
          open,
          active
        }
      });

      kango.invokeAsyncCallback('localforage.setItem', type + '-activity-records', records, () => {
        resolve();
      });
    });
  });
};

let getAllWindows = function() {
  return new Promise((resolve) => {
    kango.browser.windows.getAll((windows => {
      resolve(windows);
    }));
  });
};

let getTabs = function(window) {
  return new Promise((resolve) => {
    window.getTabs((tabs) => {
      resolve(tabs);
    });
  });
};

let checkStatus = async function() {
  let openTmp = false;
  let activeTmp = false;

  let windows = await getAllWindows();

  for (let window of windows) {
    let tabs = await getTabs(window);

    for (let tab of tabs) {
      let url = tab.getUrl();

      if (url.indexOf('://www.facebook.com') >= 0) {
        openTmp = true;

        if (window.isActive() && tab.isActive()) {
          activeTmp = true;
        }
      }
    }
  }

  if (!((openTmp === open) && (activeTmp === active))) {
    open = openTmp;
    active = activeTmp;
    await store();
  }

  setTimeout(checkStatus, 1000);
}

let start = function() {
  kango.browser.addEventListener(kango.browser.event.TAB_REMOVED, function(event) {
    checkStatus();
  });

  checkStatus();
};

export default {
  start
};