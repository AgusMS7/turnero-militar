"use client";
import {
  useGetAllSocialWorkStatsQuery,
  useGetAppointmentStatsAllPractitionerQuery,
  useGetTopPatientStatsQuery,
} from "@/app/redux/api/appointment.api";
import { useSession } from "next-auth/react";
import { SocialWorkStat } from "@/app/definitions/definitions";
import { Bar, Doughnut } from "react-chartjs-2";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
} from "chart.js";
import { useEffect, useState } from "react";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title);

const optionsVerticalBar = {
  responsive: true,
};
const optionsHorizontalBar = {
  indexAxis: "y" as const,//Lineas Horizontales
  responsive: true,
};

const colors = [
  "#87CEEB", "#0000FF", "#00FF00", "#FFA500", "#800080",
  "#00FFFF", "#FFFF00", "#FFC0CB", "#8B4513", "#808080",
  "#BFFF00", "#40E0D0", "#EE82EE", "#FFD700", "#FF7F50",
  "#000080", "#C0C0C0", "#808000", "#008B8B", "#FF00FF",
  "#4682B4", "#00FF7F", "#8B0000", "#FF0000", "#FA8072",
  "#4B0082", "#228B22", "#D2691E", "#F0E68C", "#191970"
];

const placeholderSocialWorksData = {
  labels: ["Sin datos"],
  datasets: [
    {
      data: [1],
      backgroundColor: ["#808080"],
      hoverBackgroundColor: ["#808080"],
      borderWidth: 2,
    },
  ],
};

const socialWorkChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "80%",
  plugins: {
    legend: {
      display: false,
    },
  },
};

const getDates = (timePeriod: string) => {
  const currentDate = new Date

  const startDate = new Date

  if (timePeriod == "all") {
    return ["2000-01-01", `${currentDate.getFullYear()}-${currentDate.getMonth() < 9 ? `0${currentDate.getMonth() + 1}` : currentDate.getMonth() + 1}-${currentDate.getDate() < 10 ? `0${currentDate.getDate()}` : currentDate.getDate()}`]
  }

  if (timePeriod == "week") {
    startDate.setDate(currentDate.getDate() - 7)
    return [`${startDate.getFullYear()}-${startDate.getMonth() < 9 ? `0${startDate.getMonth() + 1}` : startDate.getMonth() + 1}-${startDate.getDate() < 10 ? `0${startDate.getDate()}` : startDate.getDate()}`, `${currentDate.getFullYear()}-${currentDate.getMonth() < 9 ? `0${currentDate.getMonth() + 1}` : currentDate.getMonth() + 1}-${currentDate.getDate() < 10 ? `0${currentDate.getDate()}` : currentDate.getDate()}`]
  }

  if (timePeriod == "month") {
    startDate.setMonth(currentDate.getMonth() - 1)
    return [`${startDate.getFullYear()}-${startDate.getMonth() < 9 ? `0${startDate.getMonth() + 1}` : startDate.getMonth() + 1}-${startDate.getDate() < 10 ? `0${startDate.getDate()}` : startDate.getDate()}`, `${currentDate.getFullYear()}-${currentDate.getMonth() < 9 ? `0${currentDate.getMonth() + 1}` : currentDate.getMonth() + 1}-${currentDate.getDate() < 10 ? `0${currentDate.getDate()}` : currentDate.getDate()}`]
  }

  if (timePeriod == "year") {
    startDate.setMonth(currentDate.getMonth() - 6)
    return [`${startDate.getFullYear()}-01-01`, `${currentDate.getFullYear()}-${currentDate.getMonth() < 9 ? `0${currentDate.getMonth() + 1}` : currentDate.getMonth() + 1}-${currentDate.getDate() < 10 ? `0${currentDate.getDate()}` : currentDate.getDate()}`]
  }
  return ["", ""]

}

export default function PanelEstadisticasGeneral() {

  const currentDate = new Date

  const { data: session } = useSession();

  const token = session?.user.accessToken;

  const [socialWorkChartData, setSocialWorkChartData] = useState<{
    labels: string[];
    datasets: {
      data: number[];
      backgroundColor: string[];
      borderWidth: number;
    }[];
  }>(placeholderSocialWorksData)

  const [socialWorkPercentageData, setSocialWorkPercentageData] = useState<{
    data: {
      SocialWorkStat: SocialWorkStat,
      percentage: string,
      color: string,
    }[],
    total: number,
  }>({
    data: [],
    total: 0,
  })

  const [period, setPeriod] = useState("week");

  const { //Torta
    data: socialWorkStats,
    isLoading: isLoadingSocialWorkStats,
    isError: isErrorSocialWorkStats
  } = useGetAllSocialWorkStatsQuery({
    token: token,
    entity: {
      startDate: getDates(period)[0],
      endDate: getDates(period)[1],
    }
  })

  const { //Barras verticales
    data: topPatientStats,
    isLoading: isLoadingTopPatientStats,
    isError: isErrorTopPatientStats,
  } = useGetTopPatientStatsQuery({
    token: token,
    entity: {
      startDate: getDates(period)[0],
      endDate: getDates(period)[1],
      limit: 5,
    }
  })

  const { //Barras horizontales
    data: appointmentStats,
    isLoading: isLoadingAppointmentStats,
    isError: isErrorAppointmentStats
  } = useGetAppointmentStatsAllPractitionerQuery({
    token: token,
    entity: {
      period: period
    }
  })

  //Torta obras sociales
  const handleChartDataConversion = () => {
    const labels: string[] = []
    const data: number[] = []
    const backgroundColor: string[] = []
    let colVar = 0

    socialWorkStats?.socialWorkStats.map((stat) => {
      labels.push(stat.name)
      data.push(stat.count)
      backgroundColor.push(colors[colVar])
      colVar += 1
    })
    setSocialWorkChartData({
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: backgroundColor,
          borderWidth: 1,
        }
      ]
    })
  }
  const handlePercentangeConversion = () => {
    let total = 0
    let colVar = 0
    const socialWorkData: {
      SocialWorkStat: SocialWorkStat,
      percentage: string,
      color: string,
    }[] = []
    socialWorkStats?.socialWorkStats.map((stat) => {
      total += stat.count
    })
    socialWorkStats?.socialWorkStats.map((stat) => {
      socialWorkData.push(
        {
          SocialWorkStat: stat,
          percentage: `${(Math.floor((stat.count * 100) / total)).toString()}%`,
          color: colors[colVar]
        }
      )
      colVar += 1
    })
    setSocialWorkPercentageData({
      data: socialWorkData,
      total: total
    })
  }

  useEffect(() => {
    handlePercentangeConversion()
    handleChartDataConversion()
  }, [socialWorkStats])

  //Barras verticales
  const handleTopPatientBarDataConversion = () => {
    const labels: string[] = []
    const data: number[] = []
    topPatientStats?.forEach((stat) => {
      labels.push(`${stat.name} ${stat.lastName}`)
      data.push(stat.count)
    })

    const maxValue = Math.max(...data);

    const backgroundColors = data.map((v) =>
      v === maxValue ? "#078B8C" : "#D9E6E6"
    );

    return {
      labels: labels,
      datasets: [{
        label: "Cantidad de turnos",
        data: data,
        backgroundColor: backgroundColors,
        barThickness: 40,
      }]
    }
  }
  //Barras horizontales
  const getTotalAppointmentAmount = () => {
    const canceledCount = appointmentStats?.canceledStats.count ? appointmentStats?.canceledStats.count : 0
    const completedCount = appointmentStats ? appointmentStats?.completedStats.count : 0
    const rescheduledCount = appointmentStats ? appointmentStats?.rescheduledStats.count : 0
    return canceledCount + completedCount + rescheduledCount
  }

  const handleAppointentBarDataConvesion = () => {
    const labels: string[] = []
    const data: number[] = []

    labels.push("Cancelados", "Completos", "Reprogramados")
    data.push(appointmentStats?.canceledStats.count ? appointmentStats?.canceledStats.count : 0,
      appointmentStats?.completedStats.count ? appointmentStats?.completedStats.count : 0,
      appointmentStats?.rescheduledStats.count ? appointmentStats?.rescheduledStats.count : 0)

    const maxValue = Math.max(...data);

    const backgroundColors = data.map((v) =>
      v === maxValue ? "#078B8C" : "#D9E6E6"
    );
    return {
      labels: labels,
      datasets: [{
        label: "Cantidad de turnos",
        data: data,
        backgroundColor: backgroundColors,
        barThickness: 40,
      }]
    }
  }
  return (
    <div className="w-full bg-gray-50">
      <div className="flex flex-col items-center py-10 gap-10">
        <div className="flex md:flex-row flex-col justify-between w-1/2">
            <h2 className="text-2xl font-bold mb-4">Estadísticas generales</h2>
            <select value={period} onChange={(e) => setPeriod(e.target.value)} className="select w-44">
              <option value="week">Semanal</option>
              <option value="month">Mensual</option>
              <option value="year">Anual</option>
              <option value="all">Siempre</option>
            </select>
          </div>
        {isLoadingSocialWorkStats ?
          <div className="bg-white flex flex-col shadow-md justify-center items-center  min-w-1/2 md:w-xl w-11/12 md:h-70 p-4 rounded-2xl border border-gray-400">
            <img src="/hourglass.svg" className="w-30 animate-spin" />
            <p>Cargando...</p>
          </div>
          : isErrorSocialWorkStats ?
            <div className="bg-white flex flex-col shadow-md justify-center items-center  min-w-1/2 md:w-xl w-11/12 md:h-70 p-4 rounded-2xl border border-gray-400">
              <img src="/crossError.svg" className="w-30" />
              <p>Ocurrio un error</p>
            </div>
            : <div className="bg-white flex md:flex-row flex-col shadow-md  min-w-1/2 md:w-xl w-11/12 md:h-70 p-4 rounded-2xl md:gap-15 border border-gray-400">
              <div className="flex flex-col gap-6 md:w-5/12">
                <div className="flex flex-row justify-between">
                  <p className="font-bold text-[#078B8C] text-xl">{socialWorkPercentageData.total} Turnos</p>
                </div>
                <div>
                  <Doughnut data={socialWorkPercentageData.data.length > 0 ? socialWorkChartData : placeholderSocialWorksData} options={socialWorkChartOptions} />
                </div>
              </div>
              <div className="md:grid flex md:grid-cols-2 flex-col gap-4">
                {
                  socialWorkPercentageData.data.length > 0 ?
                    socialWorkPercentageData.data.map((stat, key) => (
                      <div key={key} className="flex flex-col gap-2 rounded">
                        <span className="text-2xl font-bold">{stat.percentage}</span>
                        <span>{stat.SocialWorkStat.name}</span>
                        <div className={`bg-gray-200 w-full text-transparent h-2 rounded-2xl`}>
                          <div className={`text-transparent h-2 rounded-2xl`} style={{ background: `${stat.color}`, width: `${stat.percentage}` }}>:)</div>
                        </div>
                      </div>
                    ))
                    :
                    <div className="flex flex-col gap-2 rounded">
                      <span className="text-2xl font-bold">0%</span>
                      <span>Sin datos</span>
                      <div className={`bg-gray-200 w-full text-transparent h-2 rounded-2xl`}>:)</div>
                    </div>
                }
              </div>
            </div>
        }

        {isLoadingTopPatientStats ?
          <div className="bg-white flex flex-col justify-center items-center shadow-md  min-w-1/2 md:w-xl w-11/12 md:h-90 h-fit p-4 rounded-2xl border border-gray-400">
            <img src="/hourglass.svg" className="w-30 animate-spin" />
            <p>Cargando...</p>
          </div>
          : isErrorTopPatientStats ?
            <div className="bg-white flex flex-col justify-center items-center shadow-md  min-w-1/2 md:w-xl w-11/12 md:h-90 h-fit p-4 rounded-2xl border border-gray-400">
              <img src="/crossError.svg" className="w-30" />
              <p>Ocurrio un error</p>
            </div>
            :
            <div className="bg-white flex flex-col shadow-md  min-w-1/2 md:w-xl w-11/12 md:h-90 h-fit p-4 rounded-2xl border border-gray-400">
              <div className=" flex flex-row justify-between">
                <p className="text-sm font-bold text-gray-500">Pacientes con mas turnos</p>
              </div>
              <div className=" flex flex-row justify-between">
                <p className="font-bold text-[#078B8C] text-2sm">{topPatientStats ? topPatientStats?.length > 1 ? `${topPatientStats.length} Pacientes` : `${topPatientStats.length} Paciente` : ""}</p>
              </div>
              <Bar data={handleTopPatientBarDataConversion()} options={optionsVerticalBar} />
            </div>
        }

        {isLoadingAppointmentStats ?
          <div className="bg-white flex flex-col justify-center items-center shadow-md  min-w-1/2 md:w-xl w-11/12 md:h-90 h-fit p-4 rounded-2xl border border-gray-400">
            <img src="/hourglass.svg" className="w-30 animate-spin" />
            <p>Cargando...</p>
          </div>
          : isErrorAppointmentStats ?
            <div className="bg-white flex flex-col justify-center items-center shadow-md  min-w-1/2 md:w-xl w-11/12 md:h-90 h-fit p-4 rounded-2xl border border-gray-400">
              <img src="/crossError.svg" className="w-30" />
              <p>Ocurrio un error</p>
            </div>
            :
            <div className="bg-white flex flex-col shadow-md  min-w-1/2 md:w-xl w-11/12 md:h-90 h-fit p-4 rounded-2xl border border-gray-400">
              <div className=" flex flex-row justify-between">
                <p className="text-sm font-bold text-gray-500">Cantidad de turnos cancelados, completos y reprogramados</p>
              </div>
              <div className=" flex flex-row justify-between">
                <p className="font-bold text-[#078B8C] text-2sm">{getTotalAppointmentAmount()} Turnos</p>
              </div>
              <Bar data={handleAppointentBarDataConvesion()} options={optionsHorizontalBar} />
            </div>
        }

      </div>
    </div>
  );
}
