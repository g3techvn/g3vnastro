import React, { useState, useEffect } from 'react';
import { ChevronDownIcon, ShieldCheckIcon, ArrowPathIcon, TruckIcon, CreditCardIcon, ClipboardDocumentCheckIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { COMPANY_INFO, BANK_INFO } from '../../constants';

interface PolicySection {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  content: React.ReactElement;
}

const PolicyAccordion: React.FC = () => {
  const [openSections, setOpenSections] = useState<string[]>(['warranty']);

  const toggleSection = (id: string) => {
    setOpenSections(prev => 
      prev.includes(id) 
        ? prev.filter(sectionId => sectionId !== id)
        : [...prev, id]
    );
  };

  // Handle URL hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash && !openSections.includes(hash)) {
        setOpenSections(prev => [...prev, hash]);
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 300); // Wait for accordion to open
      }
    };

    // Check initial hash
    handleHashChange();
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [openSections]);

  const policies: PolicySection[] = [
    {
      id: 'warranty',
      title: 'Chính sách bảo hành',
      icon: ShieldCheckIcon,
      content: (
        <div className="space-y-4 text-gray-600">
          <p className="text-sm text-orange-600 font-medium">
            *Chỉ áp dụng cho sản phẩm chính, KHÔNG ÁP DỤNG cho phụ kiện đi kèm
          </p>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <strong className="text-gray-900">Đổi mới trong 15 ngày đầu</strong> nếu có lỗi từ nhà sản xuất
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                Bảo hành trong vòng <strong className="text-gray-900">15 ngày</strong> (từ ngày G3 TECH nhận sản phẩm ở trạng thái lỗi)
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                                 Nếu vi phạm cam kết (&gt;15 ngày hoặc bảo hành lại trong 30 ngày): <strong className="text-gray-900">Đổi mới tức thì hoặc hoàn tiền 50%</strong>
              </div>
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-800">
              <strong>Lưu ý:</strong> Từ tháng thứ 13 trở đi chỉ áp dụng bảo hành của hãng (nếu có)
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'return',
      title: 'Chính sách đổi trả',
      icon: ArrowPathIcon,
      content: (
        <div className="space-y-4 text-gray-600">
          <p>G3 Tech cam kết đảm bảo quyền lợi của khách hàng với chính sách đổi trả linh hoạt và minh bạch.</p>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Điều kiện đổi trả</h4>
              <ul className="space-y-1 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  Sản phẩm còn nguyên vẹn, không bị trầy xước
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  Còn đầy đủ phụ kiện và bao bì
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  Trong thời gian bảo hành
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Thời gian & quy trình</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm font-medium text-green-800">Đổi trả trong vòng 7 ngày</p>
                  <p className="text-xs text-green-600">Kể từ ngày nhận hàng</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm font-medium text-blue-800">Miễn phí với lỗi NSX</p>
                  <p className="text-xs text-blue-600">Khách hàng chịu phí nếu đổi do sở thích</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'shipping',
      title: 'Chính sách vận chuyển',
      icon: TruckIcon,
      content: (
        <div className="space-y-4 text-gray-600">
          <p>G3 Tech cam kết giao hàng nhanh chóng và an toàn đến tay khách hàng.</p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <h4 className="font-semibold text-emerald-900 mb-2">Miễn phí vận chuyển</h4>
              <p className="text-sm text-emerald-700">Đơn hàng từ 2 triệu đồng</p>
              <p className="text-xs text-emerald-600 mt-1">Áp dụng toàn quốc</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Phí vận chuyển</h4>
              <p className="text-sm text-blue-700">30.000đ - 50.000đ</p>
              <p className="text-xs text-blue-600 mt-1">Tùy theo khu vực</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Thời gian giao hàng</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="text-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
                <p className="font-medium text-purple-900">Hà Nội & TP.HCM</p>
                <p className="text-2xl font-bold text-purple-600">1-2</p>
                <p className="text-xs text-purple-500">ngày làm việc</p>
              </div>
              <div className="text-center p-3 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg">
                <p className="font-medium text-blue-900">Các tỉnh thành khác</p>
                <p className="text-2xl font-bold text-blue-600">2-4</p>
                <p className="text-xs text-blue-500">ngày làm việc</p>
              </div>
              <div className="text-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                <p className="font-medium text-green-900">Hỗ trợ lắp đặt</p>
                <p className="text-2xl font-bold text-green-600">✓</p>
                <p className="text-xs text-green-500">tại nhà (HCM/HN)</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'payment',
      title: 'Chính sách thanh toán',
      icon: CreditCardIcon,
      content: (
        <div className="space-y-4 text-gray-600">
          <p>G3 Tech cung cấp nhiều phương thức thanh toán an toàn và tiện lợi.</p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                <TruckIcon className="w-5 h-5" />
                Thanh toán khi nhận hàng (COD)
              </h4>
              <p className="text-sm text-green-700">Kiểm tra hàng trước khi thanh toán</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <CreditCardIcon className="w-5 h-5" />
                Chuyển khoản ngân hàng
              </h4>
              <p className="text-sm text-blue-700">An toàn, nhanh chóng</p>
            </div>
          </div>

                     <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
             <h4 className="font-semibold text-gray-900 mb-3">Thông tin chuyển khoản</h4>
             <div className="grid grid-cols-2 gap-2 text-sm">
               <div><strong>Ngân hàng:</strong> {BANK_INFO.bankName}</div>
               <div><strong>STK:</strong> {BANK_INFO.accountNumber}</div>
               <div><strong>Chủ TK:</strong> {BANK_INFO.accountName}</div>
               <div><strong>Chi nhánh:</strong> Việt Nam</div>
             </div>
             <p className="text-xs text-amber-600 mt-2">💡 Ghi rõ mã đơn hàng khi chuyển khoản</p>
           </div>
        </div>
      )
    },
    {
      id: 'inspection',
      title: 'Chính sách kiểm hàng',
      icon: ClipboardDocumentCheckIcon,
      content: (
        <div className="space-y-4 text-gray-600">
          <p>G3 Tech cam kết đảm bảo chất lượng sản phẩm với quy trình kiểm hàng nghiêm ngặt.</p>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Quy trình kiểm hàng 4 bước</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { step: 1, title: 'Kiểm tra bao bì', desc: 'Tem niêm phong nguyên vẹn' },
                { step: 2, title: 'Kiểm tra phụ kiện', desc: 'Đầy đủ theo tiêu chuẩn' },
                { step: 3, title: 'Kiểm tra hoạt động', desc: 'Test chức năng cơ bản' },
                { step: 4, title: 'Kiểm tra hình thức', desc: 'Không trầy xước, lỗi' }
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <h5 className="font-medium text-blue-900">{item.title}</h5>
                    <p className="text-xs text-blue-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-2">Quyền lợi khách hàng</h4>
            <ul className="space-y-1 text-sm text-green-700">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                Được kiểm tra sản phẩm trước khi nhận
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                Được từ chối nếu không đạt yêu cầu
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                Được đổi trả nếu phát hiện lỗi sau
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'privacy',
      title: 'Chính sách bảo mật',
      icon: LockClosedIcon,
      content: (
        <div className="space-y-4 text-gray-600">
          <p>G3 Tech cam kết bảo vệ thông tin cá nhân của khách hàng theo tiêu chuẩn bảo mật cao nhất.</p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Thông tin thu thập</h4>
              <ul className="space-y-1 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                  Họ tên & số điện thoại
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                  Email & địa chỉ giao hàng
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Mục đích sử dụng</h4>
              <ul className="space-y-1 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  Xử lý & giao đơn hàng
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  Thông tin khuyến mãi (nếu đồng ý)
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="font-semibold text-amber-900 mb-2">Cam kết bảo mật</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-amber-700">
              <div className="flex items-center gap-2">
                <LockClosedIcon className="w-4 h-4 text-amber-600" />
                Không chia sẻ bên thứ 3
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheckIcon className="w-4 h-4 text-amber-600" />
                Bảo mật tiên tiến
              </div>
              <div className="flex items-center gap-2">
                <ClipboardDocumentCheckIcon className="w-4 h-4 text-amber-600" />
                Tuân thủ luật VN
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-2">Quyền của khách hàng</h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-green-700">
              <div>✓ Xem thông tin cá nhân</div>
              <div>✓ Sửa đổi thông tin</div>
              <div>✓ Yêu cầu xóa thông tin</div>
              <div>✓ Từ chối thông tin khuyến mãi</div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="space-y-4">
        {policies.map((policy) => {
          const Icon = policy.icon;
          const isOpen = openSections.includes(policy.id);
          
          return (
                         <div key={policy.id} id={policy.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300">
               <button
                 onClick={() => toggleSection(policy.id)}
                 className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
               >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{policy.title}</h3>
                </div>
                <ChevronDownIcon 
                  className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
                />
              </button>
              
              <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                <div className="px-6 pb-6">
                  <div className="border-t border-gray-100 pt-4">
                    {policy.content}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PolicyAccordion; 