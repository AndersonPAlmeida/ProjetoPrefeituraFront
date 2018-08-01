{/*
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
  */}

import React, { Component } from 'react';
import {Button} from 'react-materialize';
import {Map, TileLayer, Popup, Marker} from 'react-leaflet-universal';
import {fetch} from '../../redux-auth';

import './styles/MapComponent.css';



class MapComponent extends Component {
  constructor() {
    super();
    this.state = {
      markers: [],
      hasLocation:false,
      placeLocation: {lat:-25,lng:-49},
      text:'Local aproximado do recurso'
    };
  }

  render() {
    var position = this.props.nominatimData ? [this.props.nominatimData[0].lat, this.props.nominatimData[0].lon] : [0, 0];
    return (
      <div>
        <Map 
          center={position} 
          zoom={15} 
          length={4}
        >
          <TileLayer
            attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker  
            position={position} 
          >
            <Popup>
              <span>{this.state.text}</span>
            </Popup>
          </Marker>
        </Map>
      </div>
    );
  }
}
export default MapComponent;
