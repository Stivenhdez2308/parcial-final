class City {
    constructor(name) {
        this.name = name;
        this.greenZones = [];
    }

    addGreenZone(greenZone) {
        this.greenZones.push(greenZone);
    }

    removeGreenZone(zoneName) {
        this.greenZones = this.greenZones.filter(zone => zone.name !== zoneName);
    }

    getMaxGreenZoneHeight() {
        if (this.greenZones.length === 0) return 0;
        return Math.max(...this.greenZones.map(zone => zone.getMaxHeight()));
    }

    getTotalGreenZones() {
        return this.greenZones.reduce((total, zone) => total + zone.getTotalZones(), 0);
    }

    toD3Format() {
        return {
            name: this.name,
            children: this.greenZones.map(zone => zone.toD3Format())
        };
    }
}

export default City; 