import React from "react";
import { Chart, ChartWrapperOptions } from "react-google-charts";

type Props = {
  data: (string | number)[][];
};

const PieChart = ({ data }: Props) => {
  const options: ChartWrapperOptions["options"] = {
    backgroundColor: "transparent",
    legend: {
      position: "right",
      alignment: "center",
      textStyle: {
        color: "#fff",
        fontSize: 12,
      },
    },
    slices: {
      0: { color: "#4fb373" }, // UP
      1: { color: "#ce5555" }, // DOWN
      2: { color: "#aa9c8f" }, // PENDING
    },
  };

  return (
    <Chart
      chartType="PieChart"
      data={data}
      options={options}
      width={"100%"}
      height="100%"
    />
  );
};

export default PieChart;