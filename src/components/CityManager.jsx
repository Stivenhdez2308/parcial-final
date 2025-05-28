import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addCity, removeCity, connectCities, disconnectCities, setSelectedCity } from '../store/cityNetworkSlice';
import styles from './CityManager.module.css';

const CityManager = () => {
    const dispatch = useDispatch();
    const { network, selectedCity, error } = useSelector(state => state.cityNetwork);
    const [newCityName, setNewCityName] = useState('');
    const [city1, setCity1] = useState('');
    const [city2, setCity2] = useState('');

    const handleAddCity = (e) => {
        e.preventDefault();
        if (newCityName.trim()) {
            dispatch(addCity(newCityName.trim()));
            setNewCityName('');
        }
    };

    const handleConnectCities = (e) => {
        e.preventDefault();
        if (city1 && city2 && city1 !== city2) {
            dispatch(connectCities({ city1, city2 }));
            setCity1('');
            setCity2('');
        }
    };

    const handleDisconnectCities = (e) => {
        e.preventDefault();
        if (city1 && city2) {
            dispatch(disconnectCities({ city1, city2 }));
            setCity1('');
            setCity2('');
        }
    };

    return (
        <div className={styles.cityManager}>
            <h2>City Network Manager</h2>
            
            {error && <div className={styles.error}>{error}</div>}

            <form onSubmit={handleAddCity} className={styles.form}>
                <input
                    type="text"
                    value={newCityName}
                    onChange={(e) => setNewCityName(e.target.value)}
                    placeholder="New city name"
                    className={styles.input}
                />
                <button type="submit" className={styles.button}>Add City</button>
            </form>

            <form onSubmit={handleConnectCities} className={styles.form}>
                <select
                    value={city1}
                    onChange={(e) => setCity1(e.target.value)}
                    className={styles.select}
                >
                    <option value="">Select first city</option>
                    {Array.from(network.cities.keys()).map(city => (
                        <option key={city} value={city}>{city}</option>
                    ))}
                </select>
                <select
                    value={city2}
                    onChange={(e) => setCity2(e.target.value)}
                    className={styles.select}
                >
                    <option value="">Select second city</option>
                    {Array.from(network.cities.keys()).map(city => (
                        <option key={city} value={city}>{city}</option>
                    ))}
                </select>
                <button type="submit" className={styles.button}>Connect Cities</button>
                <button 
                    type="button" 
                    onClick={handleDisconnectCities}
                    className={`${styles.button} ${styles.buttonDanger}`}
                >
                    Disconnect Cities
                </button>
            </form>

            <div className={styles.cityList}>
                <h3>Cities</h3>
                {Array.from(network.cities.keys()).map(city => (
                    <div key={city} className={styles.cityItem}>
                        <span className={styles.cityName}>{city}</span>
                        <div className={styles.cityActions}>
                            <button
                                onClick={() => dispatch(setSelectedCity(city))}
                                className={`${styles.button} ${selectedCity === city ? styles.buttonActive : ''}`}
                            >
                                Select
                            </button>
                            <button
                                onClick={() => dispatch(removeCity(city))}
                                className={`${styles.button} ${styles.buttonDanger}`}
                            >
                                Remove
                            </button>
                        </div>
                        <div className={styles.connections}>
                            Connected to: {network.getConnectedCities(city).join(', ') || 'none'}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CityManager; 