import React from "react";
import { Chart, ChartWrapperOptions } from "react-google-charts";

export const data = [
  ["Task", "Hours per Day"],
  ["Work", 10],
  ["Eat", 2],
  ["Commute", 2],
  ["Sleep", 8],
];

const options: ChartWrapperOptions["options"] = {
  title: "Hosts with CVEs or exploits",
  backgroundColor: "transparent", // azul-escuro com transparência
  legend: {
    position: "right",
    alignment: "center",
    textStyle: {
      color: "#fff", // Cor do texto da legenda
      fontSize: 12, // Tamanho da fonte
    },
  },
  slices: {
    0: { color: "#ff0000" }, // Cor do primeiro pedaço (Work)
    1: { color: "#00ff00" }, // Cor do segundo pedaço (Eat)
    2: { color: "#0000ff" }, // Cor do terceiro pedaço (Commute)
    3: { color: "#ffff00" }, // Cor do quarto pedaço (Sleep)
  },
};

const PieChart = () => {
  return (
    <Chart
      chartType="PieChart"
      data={data}
      options={options}
      width={"100%"}
      height="100%"
    />
  );
}
export default PieChart;