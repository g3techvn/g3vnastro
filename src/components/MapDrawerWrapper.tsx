import React, { useState, useEffect } from 'react';
import { ConfigProvider } from 'antd';
import MapDrawerReact from './MapDrawerReact';

interface Location {
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface MapDrawerWrapperProps {
  location: Location;
}

const MapDrawerWrapper: React.FC<MapDrawerWrapperProps> = ({ location }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Location>(location);

  useEffect(() => {
    // Listen for custom events from Astro
    const handleOpenDrawer = (event: CustomEvent) => {
      setCurrentLocation(event.detail.location);
      setIsOpen(true);
    };

    const handleCloseDrawer = () => {
      setIsOpen(false);
    };

    window.addEventListener('openMapDrawer', handleOpenDrawer as EventListener);
    window.addEventListener('closeMapDrawer', handleCloseDrawer);

    return () => {
      window.removeEventListener('openMapDrawer', handleOpenDrawer as EventListener);
      window.removeEventListener('closeMapDrawer', handleCloseDrawer);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 8,
        },
      }}
    >
      <MapDrawerReact
        location={currentLocation}
        open={isOpen}
        onClose={handleClose}
      />
    </ConfigProvider>
  );
};

export default MapDrawerWrapper; 