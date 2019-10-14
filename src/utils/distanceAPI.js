const KEY = 'AIzaSyAfJXD-_rBUHX5L8W1BwJSNqMXKhZgGVj4';
const API = 'https://maps.googleapis.com/maps/api/distancematrix/';
const OUPUTFORMAT = 'json';
const fetch = require("node-fetch");

export async function callAPI(address1, address2) {
    let url = API;
    let startPoint = 'origins=' + address1;
    let endPoint = 'destinations=' + address2;
    
    url = url + OUPUTFORMAT + '?'
    + startPoint + '&'
    + endPoint 
    + '&key=' + KEY;
    
    const result = await fetch(url);
    return await result.json();
}