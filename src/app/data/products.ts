export interface Product {
  barcode: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  description?: string;
}

export const dummyProducts: Product[] = [
  {
    barcode: "4901085123456",
    name: "コカ・コーラ 500ml",
    category: "飲料",
    stock: 120,
    price: 150
  },
  {
    barcode: "4987654321098",
    name: "ポテトチップス うすしお味",
    category: "スナック",
    stock: 35,
    price: 198
  },
  {
    barcode: "4512345678901",
    name: "おにぎり 鮭",
    category: "食品",
    stock: 8,
    price: 110
  },
  {
    barcode: "4901234567890",
    name: "ペットボトルお茶 600ml",
    category: "飲料",
    stock: 65,
    price: 140
  },
  {
    barcode: "4523456789012",
    name: "チョコレート",
    category: "お菓子",
    stock: 22,
    price: 250
  },
  {
    barcode: "4534567890123",
    name: "カップラーメン",
    category: "食品",
    stock: 45,
    price: 180
  },
  {
    barcode: "4545678901234",
    name: "アイスクリーム バニラ",
    category: "冷凍食品",
    stock: 12,
    price: 220
  },
  {
    barcode: "4556789012345",
    name: "パン 食パン 6枚切り",
    category: "パン",
    stock: 18,
    price: 160
  },
  // ウイスキー・アルコール商品
  {
    barcode: "4580617290019",
    name: "イチローズモルト",
    category: "ウイスキー",
    stock: 2,
    price: 5800,
    description: "埼玉県秩父蒸溜所のプレミアムジャパニーズウイスキー"
  },
  {
    barcode: "4550182010466",
    name: "イチローズモルト ダブルディスティラリーズ",
    category: "ウイスキー", 
    stock: 1,
    price: 12000,
    description: "限定品・希少なジャパニーズウイスキー"
  },
  {
    barcode: "4550182010473",
    name: "イチローズモルト モルト&グレーン",
    category: "ウイスキー",
    stock: 5,
    price: 3200,
    description: "バランスの取れたブレンデッドウイスキー"
  },
  {
    barcode: "4904230123789",
    name: "山崎 12年",
    category: "ウイスキー",
    stock: 0,
    price: 28000,
    description: "サントリーの代表的なシングルモルト（在庫切れ）"
  },
  {
    barcode: "4904230123796",
    name: "白州 NV（ノンヴィンテージ）",
    category: "ウイスキー",
    stock: 2,
    price: 8500,
    description: "森の蒸溜所で作られたシングルモルト"
  },
  {
    barcode: "4562225451689",
    name: "ニッカ 余市 NV",
    category: "ウイスキー",
    stock: 4,
    price: 7200,
    description: "北海道余市蒸溜所のシングルモルト"
  }
];

export const findProductByBarcode = (barcode: string): Product | null => {
  return dummyProducts.find(product => product.barcode === barcode) || null;
};