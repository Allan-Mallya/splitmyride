/* global google */
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { SearchBox as HomeSearchBox } from "react-google-maps/lib/components/places/SearchBox";
import { SearchBox as WorkSearchBox } from "react-google-maps/lib/components/places/SearchBox";
const _ = require("lodash");
const { compose, withProps, lifecycle } = require("recompose");
const { withScriptjs,withGoogleMap,GoogleMap,Marker,DirectionsRenderer } = require("react-google-maps");



const LocationForm = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyBf498mQ5nYvqt-fFOZOsUv6wmWcnx9d0A&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  lifecycle({
    componentWillMount() {
      const maprefs = {}
      const homerefs = {}
      const workrefs = {}
      const {
      onSubmit,
      history
      } = this.props;

      this.setState({
        homecoords: 'whatever',
        bounds: null,
        center: {
          lat: 41.9, lng: -87.624
        },
        markers: [],
        onMapMounted: mapref => {
          maprefs.map = mapref;
        },
        onBoundsChanged: () => {
          this.setState({
            bounds: maprefs.map.getBounds(),
            center: maprefs.map.getCenter(),
          })
        },
        onHomeSearchBoxMounted: homeref => {
          homerefs.searchBox = homeref;
        },
        onWorkSearchBoxMounted: workref => {
          workrefs.searchBox = workref;
        },
        onPlacesChanged: () => {

          const homelocation = homerefs.searchBox.getPlaces() || [];
          const worklocation = workrefs.searchBox.getPlaces() || [];
          const bounds = new google.maps.LatLngBounds();
         

          if (homelocation.length > 0 && worklocation.length > 0)
          {

             
            var homecoords = homelocation.map(({ place_id, formatted_address, geometry: { location } }) => {
              console.log(place_id);
              console.log(formatted_address);
              console.log(location);

              return (location.lat()+","+location.lng())
            })
              
            var workcoords = worklocation.map(({ place_id, formatted_address, geometry: { location } }) => {
              console.log(place_id);
              console.log(formatted_address);
              console.log(location)
              return (location.lat() +","+ location.lng())
            });

            homecoords = String(homecoords).split(",");
            workcoords = String(workcoords).split(",");


            const DirectionsService = new google.maps.DirectionsService();
            DirectionsService.route({
            origin: new google.maps.LatLng(homecoords[0], homecoords[1]),
            destination: new google.maps.LatLng(workcoords[0], workcoords[1]),
            travelMode: google.maps.TravelMode.DRIVING,
            }, (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) 
            {
              //console.log(currentUser);
              this.setState({
                  directions: result,
                  homelocation : 
                  {
                    'lat': homecoords[0],
                    'lng': homecoords[1]
                  },
                  worklocation : 
                  {
                  'lat' : workcoords[0],
                  'lng' : workcoords[1]
                  },
              });
             console.log('directions should show');
              
            } 
            else 
            {
            console.error(`error fetching directions ${result}`);
            }
            });
          }

          if (homelocation.length === 0 || worklocation.length === 0)
          {
            console.log("One location is missing");
          }

          const places = homelocation || worklocation;

          places.forEach(place => {
            if (place.geometry.viewport) {
              bounds.union(place.geometry.viewport)
            } else {
              bounds.extend(place.geometry.location)
            }
          });
          const nextMarkers = places.map(place => ({
            position: place.geometry.location,
          }));

          const nextCenter = _.get(nextMarkers, '0.position', this.state.center);

          this.setState({
            center: nextCenter,
            markers: nextMarkers,
          });
          // refs.map.fitBounds(bounds);
        },
        onLocationSubmit: ()=>{
          //////just move to next state

        },
      })
    },
  }),
  withScriptjs,
  withGoogleMap
)(props =>
  <GoogleMap
    ref={props.onMapMounted}
    defaultZoom={15}
    center={props.center}
    onBoundsChanged={props.onBoundsChanged}
    
  >
    <HomeSearchBox
      ref={props.onHomeSearchBoxMounted}
      bounds={props.bounds}
      controlPosition={ google.maps.ControlPosition.TOP_LEFT}
      onPlacesChanged={ props.onPlacesChanged }
    >
      <input
        type="text"
        placeholder="Where do you live?"
        style={{
          boxSizing: `border-box`,
          border: `1px solid transparent`,
          width: `240px`,
          height: `32px`,
          marginTop: `27px`,
          padding: `0 12px`,
          borderRadius: `3px`,
          boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
          fontSize: `14px`,
          outline: `none`,
          textOverflow: `ellipses`,
        }}
      />
    </HomeSearchBox>
    
    <WorkSearchBox
      ref={props.onWorkSearchBoxMounted}
      bounds={props.bounds}
      controlPosition={ google.maps.ControlPosition.LEFT_TOP}
      onPlacesChanged={props.onPlacesChanged}
    >
      <input
        type="text"
        placeholder="Where do you work?"
        style={{
          boxSizing: `border-box`,
          border: `1px solid transparent`,
          width: `240px`,
          height: `32px`,
          marginTop: `27px`,
          padding: `0 12px`,
          borderRadius: `3px`,
          boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
          fontSize: `14px`,
          outline: `none`,
          textOverflow: `ellipses`,
        }}
      />
    </WorkSearchBox>



    { props.markers.map((marker, index) =>
      <Marker key={index} position={marker.position} />
    )}

    { props.directions && <DirectionsRenderer directions={props.directions} /> }

    <div>
        <button type="button"
            onClick = { ()=>{ props.onSubmit(props.homelocation,props.worklocation); 
                              props.history.push('/app/signupschedule/dates')} }> Continue </button> 
    </div>


  </GoogleMap>
);

const LocationFormWithRouter = withRouter(LocationForm);

export default LocationFormWithRouter;