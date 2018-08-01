/*
 * This file is part of Agendador.
 *
 * Agendador is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Agendador is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Agendador.  If not, see <https://www.gnu.org/licenses/>.
 */

/* istanbul ignore next */
var settings = "scrollbars=no,toolbar=no,location=no,titlebar=no,directories=no,status=no,menubar=no";

/* istanbul ignore next */
function getPopupOffset({width, height}) {
  var wLeft = window.screenLeft ? window.screenLeft : window.screenX;
  var wTop = window.screenTop ? window.screenTop : window.screenY;

  var left = wLeft + (window.innerWidth / 2) - (width / 2);
  var top = wTop + (window.innerHeight / 2) - (height / 2);

  return {top, left};
}

/* istanbul ignore next */
function getPopupSize(provider) {
  switch (provider) {
    case "facebook":
      return {width: 580, height: 400};

    case "google":
      return {width: 452, height: 633};

    case "github":
      return {width: 1020, height: 618};

    case "linkedin":
      return {width: 527, height: 582};

    case "twitter":
      return {width: 495, height: 645};

    case "live":
      return {width: 500, height: 560};

    case "yahoo":
      return {width: 559, height: 519};

    default:
      return {width: 1020, height: 618};
  }
}

/* istanbul ignore next */
function getPopupDimensions(provider) {
  let {width, height} = getPopupSize(provider);
  let {top, left} = getPopupOffset({width, height});

  return `width=${width},height=${height},top=${top},left=${left}`;
}

/* istanbul ignore next */
export default function openPopup(provider, url, name) {
  return window.open(url, name, `${settings},${getPopupDimensions(provider)}`)
}
