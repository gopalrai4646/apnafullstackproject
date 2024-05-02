
let maptoken=mapToken;
console.log(maptoken);
 mapboxgl.accessToken=maptoken
const map=new mapboxgl.Map({
container:"map",
style:"mapbox://styles/mapbox/streets-v12",
center:listing.geometry.coordinates,
zoom:11,})
// console.log(listing.geometry.coordinates);
const marker=new mapboxgl.Marker({color:"red"})
.setLngLat(listing.geometry.coordinates)
.setPopup(new mapboxgl.Popup({offset:25})
.setHTML(`<h4>${listing.location}</h4><p>Exact location will be shown after booking</p>`))
.addTo(map);