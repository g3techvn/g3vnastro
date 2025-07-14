interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  original_price?: number;
  image_url?: string;
  video_url?: string;
  rating?: number;
  brand?: string;
  brand_id?: string;
  gallery_url?: string;
  thong_so_ky_thuat?: any;
}

interface VideoInfoProps {
  product: Product;
  brandName: string;
  onOpenDrawer: () => void;
}

export function VideoInfo({ product, brandName, onOpenDrawer }: VideoInfoProps) {
  return (
    <div className="absolute bottom-24 left-3 z-20 w-3/4">
      <div className="flex items-center mb-2">
        <span
          className="flex items-center text-white font-bold bg-black/50 px-0 py-1 text-xs mr-2 cursor-pointer"
          onClick={onOpenDrawer}
        >
          <span className="bg-red-600 rounded-md p-1 mr-2 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </span>
          {product.name}
        </span>
      </div>
      {brandName && (
        <div className="text-white font-semibold text-xs mb-1">Thương hiệu {brandName}</div>
      )}
      {product.description && (
        <div className="text-white text-sm mb-1 line-clamp-2">{product.description}</div>
      )}
      <div className="text-white font-bold text-sm">
        {product.price.toLocaleString()}đ
        {product.original_price && product.original_price > product.price && (
          <span className="text-gray-300 line-through text-xs ml-2">
            {product.original_price.toLocaleString()}đ
          </span>
        )}
      </div>
    </div>
  );
} 