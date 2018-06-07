let instance = null;
let location = { currentLatitude: -8.063139, currentLongitude: -34.871137 };

export default class Location {

    constructor() {
        if (!instance) {
            instance = this;
        }

        this.watchId = navigator.geolocation.watchPosition(
            position => {
                console.log('location: ' + position.coords.latitude + ', ' + position.coords.longitude);

                location = { latitude: position.coords.latitude, longitude: position.coords.longitude };
            },
            error => {
                console.log('erro: ' + error);
            },
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 0, distanceFilter: 10 }
        );
    }

    get location() {
        return location;
    }
}