import React from 'react';
import { Drawer, Button, Space, Typography, Divider } from 'antd';
import { 
  EnvironmentOutlined, 
  PhoneOutlined, 
  MailOutlined, 
  ClockCircleOutlined,
  CloseOutlined,
  CarOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

interface Location {
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface MapDrawerProps {
  location: Location;
  open: boolean;
  onClose: () => void;
}

const COMPANY_INFO = {
  name: 'Công Ty Cổ phần Công nghệ G3 Việt Nam',
  hotline: '0947776662',
  email: 'info@g-3.vn',
  address: 'Tầng 7, Tòa nhà Charmvit, số 117 Trần Duy Hưng, Q. Cầu Giấy, TP. Hà Nội.',
  website: 'https://g-3.vn',
  workingHours: '8:00 - 17:30 (Thứ 2 - Thứ 6)',
  zalo: 'https://zalo.me/0947776662',
};

const MapDrawerReact: React.FC<MapDrawerProps> = ({ location, open, onClose }) => {
  const handleDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${location.coordinates.lat},${location.coordinates.lng}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCall = () => {
    window.location.href = `tel:${COMPANY_INFO.hotline}`;
  };

  return (
    <Drawer
      title={
        <div className="flex items-center">
          <EnvironmentOutlined className="mr-2 text-blue-600" />
          <span>{location.name}</span>
        </div>
      }
      placement="right"
      width={400}
      onClose={onClose}
      open={open}
      closeIcon={<CloseOutlined />}
      className="map-drawer"
    >
      <div className="space-y-6">
        {/* Location Address */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-start">
            <EnvironmentOutlined className="text-gray-500 mt-1 mr-3" />
            <div>
              <Text strong className="block mb-1">Địa chỉ</Text>
              <Paragraph className="text-gray-600 mb-0 leading-relaxed">
                {location.address}
              </Paragraph>
            </div>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="w-full h-64 rounded-lg overflow-hidden relative bg-gray-50 border border-gray-200">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-6">
              <div className="text-gray-400 mb-3">
                <EnvironmentOutlined className="text-4xl mb-3" />
              </div>
              <Title level={4} className="mb-2">{location.name}</Title>
              <Text type="secondary" className="text-sm leading-relaxed">
                {location.address}
              </Text>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <Space direction="vertical" className="w-full">
          <Button 
            type="primary" 
            size="large" 
            icon={<CarOutlined />}
            onClick={handleDirections}
            className="w-full"
          >
            Chỉ đường trên Google Maps
          </Button>
          
          <Button 
            type="primary" 
            size="large" 
            icon={<PhoneOutlined />}
            onClick={handleCall}
            className="w-full"
            style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
          >
            Gọi điện: {COMPANY_INFO.hotline}
          </Button>
        </Space>

        <Divider />

        {/* Company Information */}
        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <ClockCircleOutlined className="text-gray-500 mr-3" />
            <Text type="secondary">Giờ mở cửa: {COMPANY_INFO.workingHours}</Text>
          </div>
          
          <div className="flex items-center text-sm">
            <MailOutlined className="text-gray-500 mr-3" />
            <Text type="secondary">{COMPANY_INFO.email}</Text>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <Text strong className="block mb-2">Thông tin công ty</Text>
          <Text type="secondary" className="text-sm">
            {COMPANY_INFO.name}
          </Text>
        </div>
      </div>
    </Drawer>
  );
};

export default MapDrawerReact; 