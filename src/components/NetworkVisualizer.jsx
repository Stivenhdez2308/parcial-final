import React from 'react';
import { useSelector } from 'react-redux';
import { Graph } from 'react-d3-graph';
import styles from './NetworkVisualizer.module.css';

const NetworkVisualizer = () => {
    const { network } = useSelector(state => state.cityNetwork);

    const graphData = network.toD3GraphFormat();

    const containerRef = React.useRef(null);
    const [dimensions, setDimensions] = React.useState({ width: 900, height: 600 });

    React.useEffect(() => {
        function updateDimensions() {
            if (containerRef.current) {
                const { width, height } = containerRef.current.getBoundingClientRect();
                setDimensions({
                    width: Math.max(width, 400),
                    height: Math.max(height, 400)
                });
            }
        }
        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    const config = {
        nodeHighlightBehavior: true,
        node: {
            color: 'lightgreen',
            size: 400,
            highlightStrokeColor: 'blue',
            fontSize: 16,
            labelProperty: 'label',
        },
        link: {
            highlightColor: 'lightblue',
            strokeWidth: 2,
        },
        width: dimensions.width - 40,
        height: dimensions.height - 40,
        directed: false,
        panAndZoom: true,
        automaticRearrangeAfterDropNode: true,
        d3: {
            gravity: -200,
            linkLength: 250,
        },
    };

    return (
        <div className={styles.networkVisualizer}>
            <h2>City Network Visualization</h2>
            <div className={styles.graphContainer} ref={containerRef}>
                {graphData.nodes.length > 0 ? (
                    <Graph
                        id="city-network-graph"
                        data={graphData}
                        config={config}
                    />
                ) : (
                    <p>No cities in the network yet</p>
                )}
            </div>
        </div>
    );
};

export default NetworkVisualizer; 