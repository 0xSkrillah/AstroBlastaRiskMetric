export interface AstroAsset {
  isNative: boolean;
  id: string;
  decimals: number;
  denom?: string;
  symbol: string;
  price: number;
  price_24h_change: number;
  contextChainId: string;
  totalSupply: string;
  address?: string;
}

export interface AssetResponse {
  ok: boolean;
  data: AstroAsset[];
}