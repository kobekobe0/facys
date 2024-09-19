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

const AgeGroup = ({data}) => {
    const [barData, setBarData] = useState(null)

    useEffect(() => {
        setBarData({
            labels: ['Under 5', '5-9', '10-14', '15-19', '20-24', '25-29', '30-34', '35-39', '40-44', '45-49', '50-54', '55-59', '60-64', '65-69', '70-74', '75-79', '80+'],
            datasets: [
                {
                    label: 'Population',
                    data: [
                        data?.under5,
                        data?.fiveToNine,
                        data?.tenToFourteen,
                        data?.fifteenToNineteen,
                        data?.twentyToTwentyFour,
                        data?.twentyFiveToTwentyNine,
                        data?.thirtyToThirtyFour,
                        data?.thirtyFiveToThirtyNine,
                        data?.fortyToFortyFour,
                        data?.fortyFiveToFortyNine,
                        data?.fiftyToFiftyFour,
                        data?.fiftyFiveToFiftyNine,
                        data?.sixtyToSixtyFour,
                        data?.sixtyFiveToSixtyNine,
                        data?.seventyToSeventyFour,
                        data?.seventyFiveToSeventyNine,
                        data?.eightyAbove
                    ],
                    backgroundColor: 'rgba(82, 166, 255, 0.8)',
                    borderColor: 'rgba(102, 102, 102, 0.1)',
                    hoverBackgroundColor: 'rgba(43, 146, 255, 1)',
                    borderWidth: 1
                }
            ]
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
        }
    }

    if(!barData) return 'Loading...'

    return (
        <Bar options={options} data={barData} />
    )
}

export default AgeGroup