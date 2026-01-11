import { useEffect, useState } from "react";
import { useGame } from "../Game/useGame";
import { MeepleInventoryItem } from "../types";
import type { Meeple } from "../Game/Meeple";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type ProductsChartProps = {
  meeples: Meeple[];
};

export const ProductsChart = ({ meeples }: ProductsChartProps) => {
  const { hasStarted } = useGame();
  const [productHistory, setProductHistory] = useState<
    Array<{ time: number; money: number; minerals: number; fizzy: number }>
  >([]);

  // Track product amounts over time
  useEffect(() => {
    if (!hasStarted || meeples.length === 0) {
      setProductHistory([]);
      return;
    }

    // Capture initial data point immediately
    const captureData = () => {
      const totalMoney = meeples.reduce(
        (sum, m) => sum + m.inventory[MeepleInventoryItem.Money],
        0
      );
      const totalMinerals = meeples.reduce(
        (sum, m) => sum + m.inventory[MeepleInventoryItem.Minirals],
        0
      );
      const totalFizzy = meeples.reduce(
        (sum, m) => sum + m.inventory[MeepleInventoryItem.Fizzy],
        0
      );

      setProductHistory((prev) => {
        const newData = {
          time: prev.length,
          money: totalMoney,
          minerals: totalMinerals,
          fizzy: totalFizzy,
        };

        // Keep last 30 data points
        return [...prev, newData].slice(-30);
      });
    };

    // Capture initial data immediately
    captureData();

    // Then set up interval for updates
    const interval = setInterval(captureData, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [meeples, hasStarted]);

  if (!hasStarted || meeples.length === 0) {
    return null;
  }

  return (

      <div className="p-4">
        {productHistory.length === 0 ? (
          <div className="w-full" style={{ height: "300px" }}>
            <div className="flex items-center justify-center h-full text-gray-500">
              Collecting data...
            </div>
          </div>
        ) : (
          <div className="w-full" style={{ height: "300px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={productHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="time"
                />
                <YAxis
                  label={{
                    value: "Amount",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip
                  formatter={(value: number | undefined) =>
                    value !== undefined ? value.toLocaleString() : ""
                  }
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="money"
                  stroke="#22c55e"
                  strokeWidth={2}
                  name="Money"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="minerals"
                  stroke="#eab308"
                  strokeWidth={2}
                  name="Minerals"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="fizzy"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Fizzy"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

  );
};
