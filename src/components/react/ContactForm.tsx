import React, { useState } from 'react';
import { 
  PhoneIcon, 
  EnvelopeIcon, 
  UserIcon, 
  ChatBubbleLeftRightIcon, 
  PaperAirplaneIcon, 
  CheckCircleIcon 
} from '@heroicons/react/24/outline';

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Vui lòng nhập họ tên';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Vui lòng nhập nội dung';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSubmitted(true);
      // Reset form after success
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: '', email: '', phone: '', message: '' });
      }, 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (isSubmitted) {
    return (
      <div className="rounded-2xl bg-white p-8 shadow-xl border border-gray-200 text-center">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircleIcon className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Gửi thành công!</h3>
        <p className="text-gray-600">
          Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi trong vòng 2 giờ.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-8 shadow-xl border border-gray-200">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Gửi yêu cầu tư vấn</h2>
        <p className="text-gray-600">
          Điền thông tin bên dưới và chúng tôi sẽ liên hệ với bạn sớm nhất có thể.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Họ và tên *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <UserIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`block w-full pl-10 pr-3 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Nhập họ và tên của bạn"
            />
          </div>
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <EnvelopeIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`block w-full pl-10 pr-3 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                errors.email ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="email@example.com"
            />
          </div>
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Số điện thoại *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <PhoneIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`block w-full pl-10 pr-3 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                errors.phone ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="0xxx xxx xxx"
            />
          </div>
          {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Nội dung liên hệ *
          </label>
          <div className="relative">
            <div className="absolute top-3 left-3 pointer-events-none">
              <ChatBubbleLeftRightIcon className="h-5 w-5 text-gray-400" />
            </div>
            <textarea
              id="message"
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              className={`block w-full pl-10 pr-3 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none ${
                errors.message ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Mô tả chi tiết yêu cầu của bạn..."
            />
          </div>
          {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-105 focus:ring-4 focus:ring-blue-500/25 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              Đang gửi...
            </>
          ) : (
            <>
              <PaperAirplaneIcon className="h-5 w-5" />
              Gửi yêu cầu
            </>
          )}
        </button>
      </form>
    </div>
  );
} 