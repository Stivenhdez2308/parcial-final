import { createSlice } from '@reduxjs/toolkit';
import CityNetwork from '../dataStructures/CityNetwork';
import City from '../dataStructures/City';
import GreenZone from '../dataStructures/GreenZone';

const initialState = {
    network: new CityNetwork(),
    selectedCity: null,
    error: null
};

const cityNetworkSlice = createSlice({
    name: 'cityNetwork',
    initialState,
    reducers: {
        addCity: (state, action) => {
            try {
                const city = new City(action.payload);
                state.network.addCity(city);
                state.error = null;
            } catch (error) {
                state.error = error.message;
            }
        },
        removeCity: (state, action) => {
            try {
                state.network.removeCity(action.payload);
                if (state.selectedCity === action.payload) {
                    state.selectedCity = null;
                }
                state.error = null;
            } catch (error) {
                state.error = error.message;
            }
        },
        connectCities: (state, action) => {
            try {
                const { city1, city2 } = action.payload;
                state.network.connectCities(city1, city2);
                state.error = null;
            } catch (error) {
                state.error = error.message;
            }
        },
        disconnectCities: (state, action) => {
            try {
                const { city1, city2 } = action.payload;
                state.network.disconnectCities(city1, city2);
                state.error = null;
            } catch (error) {
                state.error = error.message;
            }
        },
        addGreenZone: (state, action) => {
            try {
                const { cityName, zoneName, parentZoneName } = action.payload;
                const city = state.network.cities.get(cityName);
                if (!city) throw new Error('City not found');

                const newZone = new GreenZone(zoneName);
                
                if (parentZoneName) {
                    // Find parent zone and add as subzone
                    const addToParent = (zones) => {
                        for (let zone of zones) {
                            if (zone.name === parentZoneName) {
                                zone.addSubzone(newZone);
                                return true;
                            }
                            if (zone.subzones.length > 0 && addToParent(zone.subzones)) {
                                return true;
                            }
                        }
                        return false;
                    };
                    
                    if (!addToParent(city.greenZones)) {
                        throw new Error('Parent zone not found');
                    }
                } else {
                    // Add as top-level zone
                    city.addGreenZone(newZone);
                }
                
                state.error = null;
            } catch (error) {
                state.error = error.message;
            }
        },
        setSelectedCity: (state, action) => {
            state.selectedCity = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
        editGreenZoneName: (state, action) => {
            try {
                const { cityName, oldName, newName } = action.payload;
                const city = state.network.cities.get(cityName);
                if (!city) throw new Error('City not found');
                // Busca recursivamente la zona y cambia el nombre
                function editName(zones) {
                    for (let zone of zones) {
                        if (zone.name === oldName) {
                            zone.name = newName;
                            return true;
                        }
                        if (zone.subzones.length > 0 && editName(zone.subzones)) {
                            return true;
                        }
                    }
                    return false;
                }
                if (!editName(city.greenZones)) {
                    throw new Error('Zone not found');
                }
                state.error = null;
            } catch (error) {
                state.error = error.message;
            }
        }
    }
});

export const {
    addCity,
    removeCity,
    connectCities,
    disconnectCities,
    addGreenZone,
    setSelectedCity,
    clearError,
    editGreenZoneName
} = cityNetworkSlice.actions;

export default cityNetworkSlice.reducer; 