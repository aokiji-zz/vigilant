import React from "react";
import { Chart, ChartWrapperOptions } from "react-google-charts";

type Props = {
  data: (string | number)[][];
};

const DashboardMaps = ({ data }: Props) => {
  const options: ChartWrapperOptions["options"] = {
    backgroundColor: "transparent", // azul-escuro com transparência
    datalessRegionColor: "#1f1f1f", // regiões sem dados (opcional)
    defaultColor: "#444", // cor base para países com poucos dados
    colorAxis: {
      colors: [
        "#ffcccc", // rosa claro
        "#ff9999", // rosa médio
        "#ff6666", // vermelho claro
        "#ff3333", // vermelho vivo
        "#ff0000", // vermelho puro
        "#cc0000", // vermelho escuro
        "#990000", // bordô claro
        "#660000", // bordô escuro
        "#8b0000"  // vermelho bem escuro (DarkRed)
      ]

    },
    legend: false
  };
  return (
    <Chart
      chartEvents={[
        {
          eventName: "select",
          callback: ({ chartWrapper }) => {
            const chart = chartWrapper?.getChart() || null;
            const selection = chart?.getSelection() || [];
            if (selection.length === 0) return;
            const region = data[selection[0].row + 1];
            console.log("Selected : " + region);
          },
        },
      ]}
      chartType="GeoChart"
      width="100%"
      height="400px"
      data={data}
      options={options}

    />
  );
};

export default DashboardMaps;
