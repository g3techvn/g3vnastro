import { useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/20/solid';

interface Product {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  image_url?: string;
  rating?: number;
  sold_count?: number;
  slug?: string;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

interface QuickViewModalProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
}

export default function QuickViewModal({ open, onClose, product }: QuickViewModalProps) {
  if (!product) return null;
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />
      <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
        <div className="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
          <span aria-hidden="true" className="hidden md:inline-block md:h-screen md:align-middle">&#8203;</span>
          <DialogPanel
            transition
            className="flex w-full transform text-left text-base transition data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in md:my-8 md:max-w-2xl md:px-4 data-closed:md:translate-y-0 data-closed:md:scale-95 lg:max-w-4xl"
          >
            <div className="relative flex w-full items-center overflow-hidden bg-white px-4 pt-14 pb-8 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8">
              <button
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 sm:top-8 sm:right-6 md:top-6 md:right-6 lg:top-8 lg:right-8"
              >
                <span className="sr-only">Đóng</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
              <div className="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 lg:items-center lg:gap-x-8">
                <img
                  alt={product.name}
                  src={product.image_url || '/images/placeholder-product.jpg'}
                  className="aspect-2/3 w-full rounded-lg bg-gray-100 object-cover sm:col-span-4 lg:col-span-5"
                />
                <div className="sm:col-span-8 lg:col-span-7">
                  <h2 className="text-xl font-medium text-gray-900 sm:pr-12">{product.name}</h2>
                  <section aria-labelledby="information-heading" className="mt-1">
                    <h3 id="information-heading" className="sr-only">Thông tin sản phẩm</h3>
                    <p className="font-medium text-gray-900">{product.price.toLocaleString('vi-VN')}₫</p>
                    {/* Reviews */}
                    <div className="mt-4">
                      <h4 className="sr-only">Đánh giá</h4>
                      <div className="flex items-center">
                        <p className="text-sm text-gray-700">
                          {product.rating || 4.9}
                          <span className="sr-only"> trên 5 sao</span>
                        </p>
                        <div className="ml-1 flex items-center">
                          {[0, 1, 2, 3, 4].map((rating) => (
                            <StarIcon
                              key={rating}
                              aria-hidden="true"
                              className={classNames(
                                (product.rating || 4.9) > rating ? 'text-yellow-400' : 'text-gray-200',
                                'size-5 shrink-0',
                              )}
                            />
                          ))}
                        </div>
                        <div className="ml-4 hidden lg:flex lg:items-center">
                          <span aria-hidden="true" className="text-gray-300">&middot;</span>
                          <a href={`/san-pham/${product.slug}`} className="ml-4 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                            Xem chi tiết
                          </a>
                        </div>
                      </div>
                    </div>
                  </section>
                  <section aria-labelledby="options-heading" className="mt-8">
                    <h3 id="options-heading" className="sr-only">Tùy chọn sản phẩm</h3>
                    <form>
                      <button
                        type="submit"
                        className="mt-8 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden"
                      >
                        Thêm vào giỏ hàng
                      </button>
                      <p className="absolute top-4 left-4 text-center sm:static sm:mt-8">
                        <a href={`/san-pham/${product.slug}`} className="font-medium text-indigo-600 hover:text-indigo-500">
                          Xem chi tiết
                        </a>
                      </p>
                    </form>
                  </section>
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
