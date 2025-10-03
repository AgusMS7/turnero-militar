"use client";
import { useEffect, useState } from "react";
import {TypeStat } from "@/app/definitions/definitions";
import { useSession } from "next-auth/react";
import { useLazyGetTypeAppointentStatsByPractitionerQuery } from "@/app/redux/api/appointment.api";
import { Doughnut } from "react-chartjs-2";

const options = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "80%",
  plugins: {
    legend: {
      display: false,
    },
  },
};

const placeholderData = {
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
//Funciones de obtencio de fechas
const getWeekDates=()=>{ //Obtener la fecha de inicio de semana
  const date=new Date
  const currentDay = date.getDay(); //Obtener el numero de dia (0 domingo, 6 sabado)
  const diff = (currentDay === 0 ? -6 : 1 - currentDay); //Si el dia actual es domingo entonces la diferencia al inicio de semana es de 6 dias, si no es asi, entonces le restamos el dia actual y asi queda la diferencia
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() + diff);//diff aca siempre va a ser negativo asique en realidad es una resta para obtener la fecha actual

  const year = startOfWeek.getFullYear();
  const month = String(startOfWeek.getMonth() + 1).padStart(2, '0');
  const day = String(startOfWeek.getDate()).padStart(2, '0');

  return[
    `${year}-${month}-${day}`,
    `${date.getFullYear()}-${date.getMonth()<10? `0${date.getMonth()+1}`:date.getMonth()+1}-${date.getDate()<10? `0${date.getDate()}`:date.getDate()}`
  ]
}

const getMonthDates=()=>{//Obtener la fehca de inicio de mes junto con la fecha actual
  const date=new Date
  return [
    `${date.getFullYear()}-${date.getMonth()<10? `0${date.getMonth()+1}`:date.getMonth()+1}-01`,
    `${date.getFullYear()}-${date.getMonth()<10? `0${date.getMonth()+1}`:date.getMonth()+1}-${date.getDate()<10? `0${date.getDate()}`:date.getDate()}`
  ]
  
}

const getYearDates=()=>{//Obtener las fecha de inicio de año y fin de año
  const date=new Date
  return [
    `${date.getFullYear()}-01-01`,
    `${date.getFullYear()}-12-31`
  ]
}

interface Props{
  practitionerId:string
  period: string
}


export default function AppointentTypeStats({practitionerId, period}:Props) {
  
  const { data: session } = useSession();
  const token = session?.user.accessToken;

  const [chartData,setChartData]=useState<{
    labels: string[];
    datasets: {
        data: number[];
        backgroundColor: string[];
        borderWidth: number;
    }[];
}>(placeholderData)

  const [percentageData,setPercentageData]=useState<{
      data:{
      typeStat:TypeStat,
      percentage:string,
      }[],
      total:number,
    }>({
      data:[],
      total:0,
    })
    
    const[
      trigger,
      {
        data:typeAppointmentStats,
        isLoading: isLoadingTypeAppointentStats,
        isSuccess: isSuccessTypeAppointentStats,
        isError: isErrorTypeAppointentStats,
      }
    ]=
    useLazyGetTypeAppointentStatsByPractitionerQuery()
    
    
    useEffect(()=>{
    let dateData= period=="month"?getMonthDates():period=="week"?getWeekDates():getYearDates()
    trigger({
      token:token,
      entity:{
        id:practitionerId,
        startDate: dateData[0],
        endDate: dateData[1],
      }
    })
  },[period])
  
  useEffect(()=>{
    handlePercentangeConversion()
    handleChartDataConversion()
  },[typeAppointmentStats])


  const handleChartDataConversion=()=>{
    const labels: string[]=[]
    const data: number[]=[]
    const backgroundColor: string[]=[]

    typeAppointmentStats?.typeStats.map((stat)=>{
      labels.push(stat.name)
      data.push(stat.count)
      backgroundColor.push(stat.color)
    })
    setChartData({
      labels:labels,
      datasets:[
        {
          data:data,
          backgroundColor:backgroundColor,
          borderWidth:1,
        }
      ]
    })
  }

  const handlePercentangeConversion=()=>{
    let total=0
    const typeAppointentData:{
      typeStat:TypeStat,
      percentage:string
    }[]=[]
    typeAppointmentStats?.typeStats.map((stat)=>{
      total+=stat.count
    })
    typeAppointmentStats?.typeStats.map((stat)=>{
      typeAppointentData.push(
        {
          typeStat:stat,
          percentage:`${(Math.floor((stat.count*100)/total)).toString()}%`
        }
      )
    })
    setPercentageData({
      data:typeAppointentData,
      total:total
    })
  }

  if(!session)return<p>Debes iniciar sesion para ver este contenido</p>

  return (
    <div className="bg-white flex md:flex-row flex-col shadow-md  min-w-1/2 md:w-fit w-1/2 md:h-70 p-4 rounded-2xl md:gap-15">
      <div className="flex flex-col gap-6 md:w-5/12">
        <div className="flex flex-row justify-between">
          <p className="text-[20px] font-bold">{percentageData.total} Turnos</p> 
        </div>
        
        <div>
          <Doughnut data={percentageData.data.length>0?chartData:placeholderData} options={options} />
        </div>
      </div>
      <div className="md:grid flex md:grid-cols-2 flex-col gap-4">
          {
            percentageData.data.length>0?
            percentageData.data.map((stat,key)=>(
            <div key={key} className="flex flex-col gap-2 rounded">
              <span className="text-2xl font-bold">{stat.percentage}</span>
              <span>{stat.typeStat.name}</span>
              <div className={`bg-gray-200 w-full text-transparent h-2 rounded-2xl`}>
                <div className={`text-transparent h-2 rounded-2xl`} style={{background:`${stat.typeStat.color}`,width:`${stat.percentage}`}}>:)</div>
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
  );
}