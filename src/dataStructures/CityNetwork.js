class CityNetwork {
    constructor() {
        this.cities = new Map();
        this.connections = new Map();
    }

    addCity(city) {
        this.cities.set(city.name, city);
        this.connections.set(city.name, new Set());
    }

    removeCity(cityName) {
        this.cities.delete(cityName);
        this.connections.delete(cityName);
        for (let connections of this.connections.values()) {
            connections.delete(cityName);
        }
    }

    connectCities(city1Name, city2Name) {
        if (!this.cities.has(city1Name) || !this.cities.has(city2Name)) {
            throw new Error('One or both cities do not exist');
        }
        this.connections.get(city1Name).add(city2Name);
        this.connections.get(city2Name).add(city1Name);
    }

    disconnectCities(city1Name, city2Name) {
        if (this.connections.has(city1Name)) {
            this.connections.get(city1Name).delete(city2Name);
        }
        if (this.connections.has(city2Name)) {
            this.connections.get(city2Name).delete(city1Name);
        }
    }

    getConnectedCities(cityName) {
        return Array.from(this.connections.get(cityName) || []);
    }

    toD3GraphFormat() {
        const nodes = Array.from(this.cities.keys()).map(name => ({
            id: name,
            label: name
        }));

        const links = [];
        for (let [city1, connections] of this.connections.entries()) {
            for (let city2 of connections) {
                if (city1 < city2) {
                    links.push({
                        source: city1,
                        target: city2
                    });
                }
            }
        }

        return { nodes, links };
    }
}

export default CityNetwork; 