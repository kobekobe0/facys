import { Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js'
import { useEffect, useState } from "react";

ChartJS.register(
    Tooltip,
    Legend,
    ArcElement,
)

const SexRatio = ({data}) => {
    const [pieData, setPieData] = useState(null)

    useEffect(() => {
        setPieData({
            labels: ['Male', 'Female'],
            datasets: [
                {
                    label: 'Sex Ratio',
                    data: [data.male, data.female],
                    backgroundColor: [
                        
                        'rgba(77, 166, 255, 0.8)',  // Blue
                        'rgba(255, 77, 157, 0.8)',  // Pink
                    ],
                    borderColor: [
                        
                        'rgba(77, 166, 255, 1)',  // Blue
                        'rgba(255, 77, 157, 1)',  // Pink
                    ],
                    borderWidth: 1
                }
            ]
        })
    }, [data])

    const options = {   
        maintainAspectRatio: false,
    }

    if(!pieData) return 'Loading...'

    return (
        <Pie options={options} data={pieData} />
    )
}

export default SexRatio