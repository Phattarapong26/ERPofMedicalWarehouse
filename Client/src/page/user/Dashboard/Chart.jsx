import { LineChart } from "@mui/x-charts/LineChart";

const uData = [3, 3, 4, 5, 6, 23, 2];
const pData = [2, 2, 2, 2, 2, 2, 2];
const xLabels = [
  "มกรา",
  "กุมภา",
  "มีนา",
  "เมษา",
  "พฤษภา",
  "มิถุนา",
  "กรกฎา",
  "สิงหา",
  "กันยา",
  "ตุลา",
  "พฤศจิกา",
  "ธันวา",
];


export function Chart() {
  return (
    <div className="px-3">
        <LineChart
      width={820}
      height={300}
      series={[
        { data: pData, label: "สั่งซื้อ" },
        { data: uData, label: "เบิกออก" },
        
      ]}
      
      xAxis={[{ scaleType: "point", data: xLabels }]}
    />
    </div>
  );
}
