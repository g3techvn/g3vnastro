import React, { useState, useEffect } from 'react';
import { CheckIcon, ShoppingCartIcon, PhoneIcon, UserIcon, TruckIcon } from '@heroicons/react/24/outline';

interface Step {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const steps: Step[] = [
  {
    id: 1,
    title: "Chọn sản phẩm",
    description: "Duyệt danh mục và chọn sản phẩm yêu thích",
    icon: <ShoppingCartIcon className="w-6 h-6" />
  },
  {
    id: 2,
    title: "Chọn kênh mua hàng",
    description: "Hotline, Zalo, Facebook hoặc Website",
    icon: <PhoneIcon className="w-6 h-6" />
  },
  {
    id: 3,
    title: "Xác nhận thông tin",
    description: "Cung cấp thông tin giao hàng và thanh toán",
    icon: <UserIcon className="w-6 h-6" />
  },
  {
    id: 4,
    title: "Giao hàng & lắp đặt",
    description: "Nhận hàng và miễn phí lắp đặt",
    icon: <TruckIcon className="w-6 h-6" />
  }
];

export default function InteractiveStepper() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('stepper-container');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setCurrentStep(prev => (prev >= steps.length ? 1 : prev + 1));
    }, 3000);

    return () => clearInterval(interval);
  }, [isVisible]);

  return (
    <div id="stepper-container" className="max-w-4xl mx-auto">
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-8 left-8 right-8 h-1 bg-gray-200 rounded-full">
          <div 
            className="h-full bg-gradient-to-r from-red-500 to-pink-500 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`relative flex flex-col items-center transition-all duration-500 transform ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              {/* Step Circle */}
              <div
                className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ${
                  currentStep >= step.id
                    ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white scale-110'
                    : 'bg-white border-4 border-gray-300 text-gray-400'
                }`}
              >
                {currentStep > step.id ? (
                  <CheckIcon className="w-8 h-8" />
                ) : (
                  step.icon
                )}
              </div>

              {/* Step Content */}
              <div className="mt-6 text-center">
                <h3 className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
                  currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {step.title}
                </h3>
                <p className={`text-sm transition-colors duration-300 ${
                  currentStep >= step.id ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  {step.description}
                </p>
              </div>

              {/* Pulse Animation for Current Step */}
              {currentStep === step.id && (
                <div className="absolute inset-0 w-16 h-16 rounded-full bg-red-500 opacity-20 animate-ping" />
              )}
            </div>
          ))}
        </div>

        {/* Step Dots Navigation */}
        <div className="flex justify-center mt-12 space-x-2">
          {steps.map((step) => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(step.id)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentStep === step.id
                  ? 'bg-red-500 scale-125'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 