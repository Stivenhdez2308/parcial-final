import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import CityManager from './components/CityManager';
import GreenZoneManager from './components/GreenZoneManager';
import NetworkVisualizer from './components/NetworkVisualizer';
import styles from './App.module.css';

function App() {
    return (
        <Provider store={store}>
            <div className={styles.app}>
                <header className={styles.header}>
                    <h1>City Network & Green Zones Manager</h1>
                </header>
                <main className={styles.main}>
                    <div className={styles.leftPanel}>
                        <CityManager />
                        <GreenZoneManager />
                    </div>
                    <div className={styles.rightPanel}>
                        <NetworkVisualizer />
                    </div>
                </main>
            </div>
        </Provider>
    );
}

export default App;
