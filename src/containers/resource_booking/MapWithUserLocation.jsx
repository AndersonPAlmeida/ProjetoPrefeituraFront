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
