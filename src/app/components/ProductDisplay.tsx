'use client';

import { Product } from '../data/products';

interface ProductDisplayProps {
  product: Product | null;
  barcode?: string;
}

export default function ProductDisplay({ product, barcode }: ProductDisplayProps) {
  if (!product && !barcode) {
    return (
      <div className="bg-gray-100 p-6 rounded-lg text-center">
        <p className="text-gray-500">商品をスキャンしてください</p>
      </div>
    );
  }

  if (!product && barcode) {
    return (
      <div className="bg-red-100 p-6 rounded-lg text-center border-2 border-red-300">
        <h3 className="text-lg font-semibold text-red-800 mb-2">商品が見つかりません</h3>
        <p className="text-red-600">バーコード: {barcode}</p>
        <p className="text-sm text-red-500 mt-2">
          このバーコードの商品は登録されていません
        </p>
      </div>
    );
  }

  const getStockStatus = (stock: number, category: string) => {
    // ウイスキーなど高価商品は在庫基準を調整
    const isHighValueItem = category === 'ウイスキー';
    const lowThreshold = isHighValueItem ? 3 : 10;
    const mediumThreshold = isHighValueItem ? 10 : 30;
    
    if (stock === 0) return { status: '在庫切れ', color: 'text-red-600 bg-red-100' };
    if (stock < lowThreshold) return { status: isHighValueItem ? '希少在庫' : '在庫少', color: 'text-orange-600 bg-orange-100' };
    if (stock < mediumThreshold) return { status: '在庫あり', color: 'text-yellow-600 bg-yellow-100' };
    return { status: '在庫十分', color: 'text-green-600 bg-green-100' };
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ウイスキー': return '🥃';
      case '飲料': return '🥤';
      case '食品': return '🍱';
      case 'スナック': return '🍿';
      case 'お菓子': return '🍫';
      case '冷凍食品': return '🧊';
      case 'パン': return '🍞';
      default: return '📦';
    }
  };

  if (product) {
    const stockInfo = getStockStatus(product.stock, product.category);
    const categoryIcon = getCategoryIcon(product.category);
    const isHighValue = product.category === 'ウイスキー';

    return (
      <div className={`bg-white p-6 rounded-lg shadow-md border-2 ${isHighValue ? 'border-amber-400 bg-gradient-to-br from-white to-amber-50' : 'border-blue-300'}`}>
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span>{categoryIcon}</span>
            {product.name}
          </h2>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${stockInfo.color}`}>
            {stockInfo.status}
          </span>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">バーコード:</span>
            <span className="font-mono text-sm">{product.barcode}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">カテゴリ:</span>
            <span className="flex items-center gap-1">
              {categoryIcon} {product.category}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">価格:</span>
            <span className={`text-lg font-semibold ${isHighValue ? 'text-amber-700' : ''}`}>
              ¥{product.price.toLocaleString()}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600">在庫数:</span>
            <span className={`text-2xl font-bold ${
              product.stock === 0 ? 'text-red-600' : 
              product.stock < (isHighValue ? 3 : 10) ? 'text-orange-600' : 
              'text-green-600'
            }`}>
              {product.stock}{isHighValue ? '本' : '個'}
            </span>
          </div>

          {isHighValue && (
            <div className="bg-amber-100 border border-amber-300 rounded-lg p-3 mt-4">
              <div className="flex items-center gap-2 text-amber-800">
                <span>🏆</span>
                <span className="font-semibold text-sm">プレミアム商品</span>
              </div>
            </div>
          )}
        </div>

        {product.description && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-gray-600 text-sm">{product.description}</p>
          </div>
        )}
      </div>
    );
  }

  return null;
}