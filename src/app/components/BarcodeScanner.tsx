'use client';

import { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';
import { BrowserMultiFormatReader } from '@zxing/browser';

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  isActive: boolean;
}

export default function BarcodeScanner({ onScan, isActive }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string>('');
  const [manualInput, setManualInput] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [cameraStatus, setCameraStatus] = useState<'初期化中' | 'アクセス中' | '起動中' | '動作中' | 'エラー'>('初期化中');

  useEffect(() => {
    if (isActive && !isScanning) {
      startCamera();
    } else if (!isActive && isScanning) {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isActive]);

  const startCamera = async () => {
    try {
      setError('');
      setIsScanning(true);
      setCameraStatus('アクセス中');

      // iOSサポートのためのconstraints
      const constraints = {
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 640, max: 1280 },
          height: { ideal: 480, max: 720 }
        },
        audio: false
      };

      console.log('Requesting camera access...');
      setCameraStatus('アクセス中');
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true'); // iOS必須
        videoRef.current.muted = true;
        
        setCameraStatus('起動中');
        
        await new Promise<void>((resolve, reject) => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = () => {
              console.log('Video metadata loaded');
              resolve();
            };
            videoRef.current.onerror = (e) => {
              console.error('Video error:', e);
              reject(new Error('Video load failed'));
            };
            
            videoRef.current.play().catch(reject);
          }
        });

        setCameraStatus('動作中');
        startScanning();
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setCameraStatus('エラー');
      
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          setError('カメラのアクセス許可が必要です。ブラウザの設定でカメラを許可してください。');
        } else if (err.name === 'NotFoundError') {
          setError('カメラが見つかりません。');
        } else if (err.name === 'NotSupportedError') {
          setError('このブラウザではカメラがサポートされていません。');
        } else {
          setError(`カメラエラー: ${err.message}`);
        }
      } else {
        setError('カメラの起動に失敗しました。手動入力をお試しください。');
      }
      
      setIsScanning(false);
    }
  };

  const startScanning = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      scanFrame();
    }, 250); // 250msごとにスキャン（高頻度）
  };

  const scanFrame = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context || video.readyState !== video.HAVE_ENOUGH_DATA) return;

    // キャンバスサイズをビデオに合わせる
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // ビデオフレームをキャンバスに描画
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // 画像データを取得
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    
    // 方法1: jsQRでQRコードスキャン（設定を最適化）
    const qrCode = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'attemptBoth', // 反転も試行
    });

    if (qrCode && qrCode.data) {
      console.log('QR Scanned:', qrCode.data);
      onScan(qrCode.data);
      stopCamera();
      return;
    }

    // 方法2: ZXingで各種バーコードスキャン
    try {
      const reader = new BrowserMultiFormatReader();
      
      // キャンバスからBlob URLを作成
      canvas.toBlob(async (blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          try {
            const result = await reader.decodeFromImageUrl(url);
            if (result && result.getText()) {
              console.log('Barcode Scanned:', result.getText());
              onScan(result.getText());
              stopCamera();
            }
          } catch {
            // バーコードが見つからない場合は無視
          } finally {
            URL.revokeObjectURL(url);
          }
        }
      }, 'image/png');
    } catch {
      // バーコードが見つからない場合は無視
    }
  };

  const stopCamera = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsScanning(false);
    setCameraStatus('初期化中');
  };

  const handleManualSubmit = () => {
    if (manualInput.trim()) {
      onScan(manualInput.trim());
      setManualInput('');
      setShowManualInput(false);
    }
  };

  const requestCameraPermission = async () => {
    try {
      setError('');
      setCameraStatus('アクセス中');
      await navigator.mediaDevices.getUserMedia({ video: true });
      startCamera();
    } catch (err) {
      console.error('Permission error:', err);
      setError('カメラのアクセス許可が拒否されました。ブラウザの設定を確認してください。');
      setCameraStatus('エラー');
    }
  };

  if (!isActive) {
    return null;
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-gray-200 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 text-center">バーコードをスキャン</h3>
        
        <div className="mb-2 text-center">
          <span className={`text-sm px-2 py-1 rounded ${
            cameraStatus === '動作中' ? 'bg-green-100 text-green-700' :
            cameraStatus === 'エラー' ? 'bg-red-100 text-red-700' :
            'bg-yellow-100 text-yellow-700'
          }`}>
            状態: {cameraStatus}
          </span>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {error}
            {error.includes('アクセス許可') && (
              <div className="mt-2">
                <button
                  onClick={requestCameraPermission}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition-colors text-sm"
                >
                  カメラ許可を再試行
                </button>
              </div>
            )}
          </div>
        )}

        <div className="relative">
          <video 
            ref={videoRef}
            className="w-full h-60 bg-black rounded-lg border-2 border-blue-500 object-cover"
            playsInline
            muted
            autoPlay
          />
          <canvas 
            ref={canvasRef}
            className="hidden"
          />
          
          {/* スキャンエリアのオーバーレイ */}
          {isScanning && cameraStatus === '動作中' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-48 h-32 border-2 border-red-500 bg-transparent">
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-red-500"></div>
                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-red-500"></div>
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-red-500"></div>
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-red-500"></div>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="flex space-x-2">
            <button
              onClick={() => setShowManualInput(!showManualInput)}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded transition-colors text-sm"
            >
              ⌨️ 手動入力
            </button>
            
            {isScanning && (
              <button
                onClick={stopCamera}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition-colors text-sm"
              >
                ⏹️ 停止
              </button>
            )}

            {!isScanning && cameraStatus === 'エラー' && (
              <button
                onClick={startCamera}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition-colors text-sm"
              >
                🔄 再試行
              </button>
            )}
          </div>

          {showManualInput && (
            <div className="space-y-2">
              <input
                type="text"
                placeholder="バーコード番号を入力"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleManualSubmit()}
              />
              <button
                onClick={handleManualSubmit}
                disabled={!manualInput.trim()}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-semibold py-2 px-4 rounded transition-colors"
              >
                検索
              </button>
            </div>
          )}
        </div>
        
        <p className="text-xs text-gray-600 text-center mt-2">
          {cameraStatus === '動作中' ? 'バーコードを赤い枠内に合わせてください' : 
           cameraStatus === 'アクセス中' ? 'カメラのアクセス許可を確認してください' :
           'カメラが利用できない場合は手動入力をご利用ください'}
        </p>
      </div>
    </div>
  );
}