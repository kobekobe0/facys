import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'
import { useEffect, useState } from "react";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
)

const EducationChart = ({data}) => {
    const [barData, setBarData] = useState(null)

    useEffect(() => {
        console.log(data)
        setBarData({
            labels: ['No Grade', 'Elementary', 'High School', 'Undergraduate', 'Vocational', 'Masteral', 'Doctorate'],
            datasets: [
                {
                    label: 'Education',
                    data: [
                        data?.noEducation,
                        data?.elementary,
                        data?.highschool,
                        data?.undergraduate,
                        data?.vocational,
                        data?.masteral,
                        data?.doctorate
                    ],
                    backgroundColor: 'rgba(82, 166, 255, 0.8)',
                    borderColor: 'rgba(102, 102, 102, 0.1)',
                    hoverBackgroundColor: 'rgba(43, 146, 255, 1)',
                    borderWidth: 1
                }
            ],
            
        })
    }, [data])

    const options = {   
        maintainAspectRatio: false,
        // remove grid lines
        scales: {
            x: {
                grid: {
                    display: false
                }
            },
            y: {
                grid: {
                    display: false
                }
            }
        },
        indexAxis: 'y',
        legend: {
            display: false
        }
    }

    if(!barData) return 'Loading...'

    return (
        <Bar options={options} data={barData} />
    )
}

export default EducationChart