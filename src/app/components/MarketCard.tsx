import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MarketCardProps {
  asset: {
    name: string;
    symbol: string;
    icon: string;
    supplyAPY: number;
    borrowAPY: number;
    totalSupply: string;
    totalBorrow: string;
    utilization: number;
    price: number;
    change24h: number;
  };
  type: "supply" | "borrow";
}

export function MarketCard({ asset, type }: MarketCardProps) {
  const isSupply = type === "supply";
  const apy = isSupply ? asset.supplyAPY : asset.borrowAPY;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="font-bold text-primary">
                {asset.symbol.charAt(0)}
              </span>
            </div>
            <div>
              <CardTitle className="text-lg">{asset.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{asset.symbol}</p>
            </div>
          </div>
          <Badge variant={isSupply ? "default" : "secondary"}>
            {isSupply ? "Supply" : "Borrow"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* APY */}
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">
            {isSupply ? "Supply APY" : "Borrow APR"}
          </span>
          <span className="font-bold text-lg text-primary">
            {apy.toFixed(2)}%
          </span>
        </div>

        {/* Price */}
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Price</span>
          <div className="flex items-center space-x-2">
            <span>${asset.price.toLocaleString()}</span>
            <div
              className={`flex items-center ${
                asset.change24h >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {asset.change24h >= 0 ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              <span className="text-xs">
                {Math.abs(asset.change24h).toFixed(2)}%
              </span>
            </div>
          </div>
        </div>

        {/* Total Supply/Borrow */}
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">
            {isSupply ? "Total Supply" : "Total Borrow"}
          </span>
          <span>{isSupply ? asset.totalSupply : asset.totalBorrow}</span>
        </div>

        {/* Utilization */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Utilization</span>
            <span>{asset.utilization}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${asset.utilization}%` }}
            />
          </div>
        </div>

        {/* Action Button */}
        <Button
          className="w-full mt-4"
          variant={isSupply ? "default" : "outline"}
        >
          {isSupply ? "Supply" : "Borrow"} {asset.symbol}
        </Button>
      </CardContent>
    </Card>
  );
}
