import { useEffect, useRef } from 'react';
import { Driver, Config as DriverConfig, driver } from 'driver.js';

export default function useDriver(config: DriverConfig) {
    const driverObj = useRef<Driver>();

    useEffect(() => {
        driverObj.current = driver(config);
        return () => {
            driverObj.current?.destroy();
        };
    }, []);

    useEffect(() => {
        driverObj.current?.setConfig(config);
    }, [config]);

    return driverObj;
}
