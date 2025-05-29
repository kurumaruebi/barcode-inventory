'use client';

import { useState } from 'react';
import BarcodeScanner from './components/BarcodeScanner';
import ProductDisplay from './components/ProductDisplay';
import { findProductByBarcode, Product, dummyProducts } from './data/products';

export default function Home() {
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);
  const [scannedBarcode, setScannedBarcode] = useState<string>('');
  const [isScannerActive, setIsScannerActive] = useState(false);
  const [showProductList, setShowProductList] = useState(false);

  const handleScan = (barcode: string) => {
    console.log('Scanned barcode:', barcode);
    setScannedBarcode(barcode);
    const product = findProductByBarcode(barcode);
    setScannedProduct(product);
    setIsScannerActive(false);
  };

  const startScanning = () => {
    setIsScannerActive(true);
    setScannedProduct(null);
    setScannedBarcode('');
  };

  const stopScanning = () => {
    setIsScannerActive(false);
  };

  const testScan = (barcode: string) => {
    handleScan(barcode);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            📦 在庫管理システム
          </h1>
          <p className="text-gray-600">
            バーコードをスキャンして在庫を確認
          </p>
        </div>

        <div className="space-y-4">
          {!isScannerActive && (
            <div className="space-y-3">
              <button
                onClick={startScanning}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                📷 バーコードスキャン開始
              </button>
              
              <button
                onClick={() => setShowProductList(!showProductList)}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                📋 商品一覧を{showProductList ? '非表示' : '表示'}
              </button>
            </div>
          )}

          {isScannerActive && (
            <div className="space-y-4">
              <BarcodeScanner onScan={handleScan} isActive={isScannerActive} />
              <button
                onClick={stopScanning}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                ⏹️ スキャン停止
              </button>
            </div>
          )}

          {showProductList && !isScannerActive && (
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-3">📋 テスト用商品一覧</h3>
              <div className="space-y-2">
                {dummyProducts.map((product) => (
                  <button
                    key={product.barcode}
                    onClick={() => testScan(product.barcode)}
                    className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border transition-colors"
                  >
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-gray-600">
                      {product.barcode} | 在庫: {product.stock}個
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {(scannedProduct || scannedBarcode) && !isScannerActive && (
            <ProductDisplay product={scannedProduct} barcode={scannedBarcode} />
          )}

          {!scannedProduct && !scannedBarcode && !isScannerActive && !showProductList && (
            <div className="bg-gray-100 p-6 rounded-lg text-center">
              <p className="text-gray-500">
                バーコードをスキャンして商品情報を確認してください
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">💡 使い方</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• 「バーコードスキャン開始」でカメラを起動</li>
            <li>• カメラ許可を「許可」してください</li>
            <li>• バーコードを赤い枠内に合わせると自動で読み取り</li>
            <li>• カメラが使えない場合は「手動入力」ボタンで直接入力</li>
            <li>• 「商品一覧を表示」でテスト用商品を確認可能</li>
          </ul>
        </div>

        {/* カメラ許可のガイド */}
        <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <h4 className="font-semibold text-orange-800 mb-2 text-sm">📹 カメラ許可について</h4>
          <div className="text-xs text-orange-700 space-y-1">
            <div>• ブラウザがカメラ許可を求めた際は「許可」を選択</div>
            <div>• 「ブロック」を選択した場合は、ブラウザ設定からカメラを許可し直してください</div>
            <div>• Safari: アドレスバー左の「AA」→「Webサイトの設定」→「カメラ」→「許可」</div>
          </div>
        </div>

        {/* 対応バーコード形式 */}
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-2 text-sm">📊 対応バーコード形式</h4>
          <div className="text-xs text-green-700 space-y-1">
            <div>• QRコード（完全対応）</div>
            <div>• JAN/EAN-13（13桁バーコード）</div>
            <div>• JAN/EAN-8（8桁バーコード）</div>
            <div>• CODE-128、CODE-39</div>
            <div>• UPC-A、UPC-E</div>
            <div>• 実際の商品バーコードも読み取り可能</div>
          </div>
        </div>

        {/* テスト用バーコード番号表示 */}
        <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
          <h4 className="font-semibold text-yellow-800 mb-2 text-sm">📝 テスト用バーコード</h4>
          <div className="text-xs text-yellow-700 space-y-1">
            <div>• 4901085123456 (コカ・コーラ)</div>
            <div>• 4512345678901 (おにぎり鮭)</div>
            <div>• 4987654321098 (ポテトチップス)</div>
          </div>
        </div>

        {/* ウイスキー用テストバーコード */}
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <h4 className="font-semibold text-amber-800 mb-2 text-sm flex items-center gap-1">
            🥃 ウイスキー・テスト用バーコード
          </h4>
          <div className="text-xs text-amber-700 space-y-1">
            <div className="font-bold text-amber-800">• 4580617290019 (イチローズモルト)</div>
            <div>• 4550182010466 (イチローズモルト ダブルディスティラリーズ)</div>
            <div>• 4904230123789 (山崎 12年 - 在庫切れ)</div>
            <div>• 4562225451689 (ニッカ 余市 NV)</div>
            <div className="mt-2 font-semibold text-amber-900">🎯 実際のイチローズモルトのバーコード対応済み！</div>
          </div>
        </div>
      </div>
    </div>
  );
}
