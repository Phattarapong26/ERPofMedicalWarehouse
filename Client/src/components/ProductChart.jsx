import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts";
import { useEffect, useState } from "react";

export default function ProductChart(props) {
  const [product, setProduct] = useState(0);
  const [outOfStock, setOutOfStock] = useState(0);
  const [lowStock, setLowStock] = useState(0);
  const [overdue, setOverdue] = useState(0);

  const fetchDate = async () => {
    try {
      const response = await fetch("http://localhost:3000/inventorySummary");
      const data = await response.json();
      if (data.status === "success") {
        setProduct(data.total_product_count);
        setLowStock(data.low_stock_products.length);
        setOverdue(data.overdue_lots.length);
        setOutOfStock(data.out_of_stock_products.length);
      }
    } catch (error) {
      console.error("Error fetching purchase history:", error);
    }
  };
  const [allLocation, setAllLocation] = useState(0);
  const [emptyLocation, setEmptyLocation] = useState(0);
  // Coerce to numbers to avoid NaN
  const productCount = Number(product) || 0;
  const lowStockCount = Number(lowStock) || 0;
  const outOfStockCount = Number(outOfStock) || 0;
  const overdueCount = Number(overdue) || 0;
  const LocationUse = (Number(allLocation) || 0) - (Number(emptyLocation) || 0);

  const getLocationDetail = async () => {
    try {
      const response = await fetch("http://localhost:3000/getAllLocation");
      const data = await response.json();
      if (data.status === "success") {
        setAllLocation(data.all_locations.length);
        setEmptyLocation(data.empty_locations.length);
      }
    } catch (error) {
      console.error("Error fetching purchase history:", error);
    }
  };

  useEffect(() => {
    // Prefer counts from props if provided, otherwise fetch
    if (typeof props?.lowStockCount === 'number') {
      setLowStock(props.lowStockCount);
    } else {
      fetchDate();
    }

    if (typeof props?.outOfStockCount === 'number') {
      setOutOfStock(props.outOfStockCount);
    }

    if (typeof props?.overdueCount === 'number') {
      setOverdue(props.overdueCount);
    }

    // Always fetch product count and location detail (can be optimized if needed)
    if (typeof props?.lowStockCount !== 'number' || typeof props?.outOfStockCount !== 'number' || typeof props?.overdueCount !== 'number') {
      fetchDate();
    }
    getLocationDetail();
  }, [props?.lowStockCount, props?.outOfStockCount, props?.overdueCount]);
  const chartSetting = {
    width: 700,
    height: 300,
    sx: {
      [`.${axisClasses.left} .${axisClasses.label}`]: {
        transform: "translate(-20px, 0)",
      },
    },
  };
  const dataset = [
    {
      product: productCount,
      low: lowStockCount,
      out: outOfStockCount,
      lot: Number.isFinite(LocationUse) ? LocationUse : 0,
      overdue: overdueCount,
      type: "สถานะยาในคลัง",
    },
  ];

    const valueFormatter = (value) => `${value} ล็อต`;

  return (
    <div className="d-flex justify-content-center align-items-center">
      <BarChart
        dataset={dataset}
        xAxis={[
          {
            scaleType: "band",
            dataKey: "type",
            categoryGapRatio: 0.2,
            barGapRatio: 0,
          },
        ]}
        series={[
          { dataKey: "product", label: "ยาทั้งหมด" },
          { dataKey: "out", label: "ยาหมดสต๊อก" },
          { dataKey: "low", label: "ยาเหลือน้อย" },
          { dataKey: "overdue", label: "ล็อตใกล้หมดอายุ",valueFormatter },
          { dataKey: "lot", label: "ล็อตใช้ไป",valueFormatter },
        ]}
        {...chartSetting}
      />
    </div>
  );
}
