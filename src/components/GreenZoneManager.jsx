import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addGreenZone, editGreenZoneName } from '../store/cityNetworkSlice';
import Tree from 'react-d3-tree';
import styles from './GreenZoneManager.module.css';

const GreenZoneManager = () => {
    const dispatch = useDispatch();
    const { network, selectedCity, error } = useSelector(state => state.cityNetwork);
    const [newZoneName, setNewZoneName] = useState('');
    const [parentZoneName, setParentZoneName] = useState('');
    const [editingZone, setEditingZone] = useState(null);
    const [editZoneValue, setEditZoneValue] = useState('');

    const treeContainerRef = useRef(null);
    const [treeDimensions, setTreeDimensions] = useState({ width: 600, height: 400 });

    useEffect(() => {
        function updateTreeDimensions() {
            if (treeContainerRef.current) {
                const { width, height } = treeContainerRef.current.getBoundingClientRect();
                setTreeDimensions({
                    width: Math.max(width, 300),
                    height: Math.max(height, 300)
                });
            }
        }
        updateTreeDimensions();
        window.addEventListener('resize', updateTreeDimensions);
        return () => window.removeEventListener('resize', updateTreeDimensions);
    }, []);

    const selectedCityData = selectedCity ? network.cities.get(selectedCity) : null;

    const handleAddZone = (e) => {
        e.preventDefault();
        if (newZoneName.trim() && selectedCity) {
            dispatch(addGreenZone({
                cityName: selectedCity,
                zoneName: newZoneName.trim(),
                parentZoneName: parentZoneName || null
            }));
            setNewZoneName('');
            setParentZoneName('');
        }
    };

    const getAllZoneNames = (zones, names = []) => {
        zones.forEach(zone => {
            names.push(zone.name);
            if (zone.subzones.length > 0) {
                getAllZoneNames(zone.subzones, names);
            }
        });
        return names;
    };

    const getZoneOptions = () => {
        if (!selectedCityData) return [];
        return getAllZoneNames(selectedCityData.greenZones);
    };

    function getMaxBreadth(treeData) {
        if (!treeData) return 1;
        let max = 1;
        function traverse(node, level, levels) {
            if (!levels[level]) levels[level] = 0;
            levels[level]++;
            if (node.children) {
                node.children.forEach(child => traverse(child, level + 1, levels));
            }
        }
        const levels = [];
        if (Array.isArray(treeData)) {
            treeData.forEach(root => traverse(root, 0, levels));
        } else {
            traverse(treeData, 0, levels);
        }
        return Math.max(...levels);
    }

    function getMaxDepth(treeData) {
        if (!treeData) return 1;
        function traverse(node) {
            if (!node.children || node.children.length === 0) return 1;
            return 1 + Math.max(...node.children.map(traverse));
        }
        if (Array.isArray(treeData)) {
            return Math.max(...treeData.map(traverse));
        } else {
            return traverse(treeData);
        }
    }

    function renderZones(zones) {
        return (
            <ul style={{ listStyle: 'none', paddingLeft: 20 }}>
                {zones.map(zone => (
                    <li key={zone.name} style={{ marginBottom: 8 }}>
                        {editingZone === zone.name ? (
                            <>
                                <input
                                    type="text"
                                    value={editZoneValue}
                                    onChange={e => setEditZoneValue(e.target.value)}
                                    style={{ marginRight: 8 }}
                                />
                                <button
                                    onClick={() => {
                                        if (editZoneValue.trim() && selectedCity) {
                                            dispatch(editGreenZoneName({
                                                cityName: selectedCity,
                                                oldName: zone.name,
                                                newName: editZoneValue.trim()
                                            }));
                                            setEditingZone(null);
                                        }
                                    }}
                                    className={styles.button}
                                    style={{ marginRight: 4 }}
                                >Guardar</button>
                                <button
                                    onClick={() => setEditingZone(null)}
                                    className={styles.button}
                                    style={{ background: '#aaa' }}
                                >Cancelar</button>
                            </>
                        ) : (
                            <>
                                <span>{zone.name}</span>
                                <button
                                    onClick={() => {
                                        setEditingZone(zone.name);
                                        setEditZoneValue(zone.name);
                                    }}
                                    className={styles.button}
                                    style={{ marginLeft: 8 }}
                                >Editar</button>
                            </>
                        )}
                        {zone.subzones && zone.subzones.length > 0 && renderZones(zone.subzones)}
                    </li>
                ))}
            </ul>
        );
    }

    return (
        <div className={styles.greenZoneManager}>
            <h2>Green Zone Manager</h2>
            
            {error && <div className={styles.error}>{error}</div>}

            {selectedCity ? (
                <>
                    <div className={styles.stats}>
                        <h3>City: {selectedCity}</h3>
                        <p>Maximum Green Zone Height: {selectedCityData.getMaxGreenZoneHeight()}</p>
                        <p>Total Green Zones: {selectedCityData.getTotalGreenZones()}</p>
                    </div>

                    <form onSubmit={handleAddZone} className={styles.form}>
                        <input
                            type="text"
                            value={newZoneName}
                            onChange={(e) => setNewZoneName(e.target.value)}
                            placeholder="New zone name"
                            className={styles.input}
                        />
                        <select
                            value={parentZoneName}
                            onChange={(e) => setParentZoneName(e.target.value)}
                            className={styles.select}
                        >
                            <option value="">No parent (top-level zone)</option>
                            {getZoneOptions().map(zone => (
                                <option key={zone} value={zone}>{zone}</option>
                            ))}
                        </select>
                        <button type="submit" className={styles.button}>Add Green Zone</button>
                    </form>

                    <div className={styles.treeContainer} ref={treeContainerRef}>
                        {selectedCityData.greenZones.length > 0 ? (
                            <>
                                <div style={{ marginBottom: 16 }}>
                                    {renderZones(selectedCityData.greenZones)}
                                </div>
                                {(() => {
                                    const d3Data = selectedCityData.toD3Format();
                                    const breadth = getMaxBreadth(d3Data);
                                    const depth = getMaxDepth(d3Data);
                                    const siblingSep = Math.max(treeDimensions.width / (breadth + 1) / 30, 1.5);
                                    const svgHeight = Math.max(treeDimensions.height, 120 * depth);
                                    return (
                                        <Tree
                                            data={d3Data}
                                            orientation="vertical"
                                            pathFunc="step"
                                            separation={{ siblings: siblingSep, nonSiblings: siblingSep + 0.5 }}
                                            dimensions={{ width: treeDimensions.width, height: svgHeight }}
                                            translate={{
                                                x: treeDimensions.width / 2,
                                                y: 60
                                            }}
                                            zoomable={true}
                                        />
                                    );
                                })()}
                            </>
                        ) : (
                            <p>No green zones added yet</p>
                        )}
                    </div>
                </>
            ) : (
                <p>Select a city to manage its green zones</p>
            )}
        </div>
    );
};

export default GreenZoneManager; 