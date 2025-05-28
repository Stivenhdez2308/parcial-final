class GreenZone {
    constructor(name) {
        this.name = name;
        this.subzones = [];
    }

    addSubzone(subzone) {
        this.subzones.push(subzone);
    }

    removeSubzone(subzoneName) {
        this.subzones = this.subzones.filter(zone => zone.name !== subzoneName);
    }

    getMaxHeight() {
        if (this.subzones.length === 0) return 1;
        return 1 + Math.max(...this.subzones.map(subzone => subzone.getMaxHeight()));
    }

    getTotalZones() {
        return 1 + this.subzones.reduce((total, subzone) => total + subzone.getTotalZones(), 0);
    }

    toD3Format() {
        return {
            name: this.name,
            children: this.subzones.map(subzone => subzone.toD3Format())
        };
    }
}

export default GreenZone; 