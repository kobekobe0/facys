import { useEffect, useState } from "react"
import CensusChart from "./census/CensusCharts"
import CensusSector from "./census/CensusSector"
import EducationChart from "./census/EducationChart"
import axios from "axios"
import API_URL from "../constants/api"

const data = {
    senior: 1300,
    p4: 4001,
    pwd: 20,
    soloParent: 654,
    ofw: 145,

    totalPopulation: 12350,

    male: 6350,
    female: 6000,

    totalHouseholds: 4031,
    totalFamilies: 6301,

    elementary: 3200,
    highschool: 5000,
    college: 2500,
    vocational: 1500,
    undergraduate: 1000,
    doctorate: 50,
    masteral: 100,
    noEducation: 43,

    ageGroup: {
        under5: 212,
        fiveToNine: 321,
        tenToFourteen: 311,
        fifteenToNineteen: 421,
        twentyToTwentyFour: 521,
        twentyFiveToTwentyNine: 724,
        thirtyToThirtyFour: 211,
        thirtyFiveToThirtyNine: 216,
        fortyToFortyFour: 341,
        fortyFiveToFortyNine: 211,
        fiftyToFiftyFour: 321,
        fiftyFiveToFiftyNine: 369,
        sixtyToSixtyFour: 131,
        sixtyFiveToSixtyNine: 125,
        seventyToSeventyFour: 231,
        seventyFiveToSeventyNine: 321,
        eightyAbove: 131
    }
}


const CensusReport = () => {
    const [data, setDate] = useState(null)

    const fetchData = async () => {
        try{
            const {data} = await axios.get(`${API_URL}censusReport/`)
            setDate(data.data)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(()=> {
        fetchData()
    },[])

    if(!data) return 'Loading...'
    return (
        <div className="flex w-full flex-col gap-8">
            
            <CensusChart data={data} />
            <CensusSector data={data} />
            <div className="flex w-full gap-4">
                <div className=" shadow-lg border border-gray-100 rounded-md p-8 flex flex-col items-start gap-4 w-2/3">
                    <EducationChart data={{
                        elementary: data.elementary,
                        highschool: data.highschool,
                        college: data.college,
                        vocational: data.vocational,
                        undergraduate: data.undergraduate,
                        doctorate: data.doctorate,
                        masteral: data.masteral,
                        noEducation: data.noEducation
                    }} />
                </div>
            </div>

        </div>
    )
}

export default CensusReport