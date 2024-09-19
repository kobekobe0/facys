import SexRatio from "./SexRatio"
import AgeGroup from "./AgeGroup"


const CensusChart = ({ data }) => {
    return (
        <div className=" w-full flex items-start gap-4 h-[50vh]">
            <div className="w-2/3 p-8 flex flex-col shadow-lg border border-gray-100 rounded-md h-full">
                <div className="flex items-end">
                    <div className="flex flex-col px-8">
                        <h3 className="text-sm mb-4">Total Population</h3>
                        <div className="flex items-end gap-4">
                            <h2 className="font-medium text-6xl">{data?.totalPopulation?.toLocaleString()}</h2>
                            <p className="bg-green-500 text-white rounded-full px-2 text-sm">Residents</p>
                        </div>
                    </div>
                    <div className="flex flex-col px-8">
                        <h3 className="text-sm mb-4">Total Households</h3>
                        <div className="flex items-end gap-4">
                            <h2 className="font-medium text-4xl">{data?.totalHouseholds?.toLocaleString()}</h2>
                            <p className="bg-violet-500 text-white rounded-full px-2 text-xs">Households</p>
                        </div>
                    </div>
                    <div className="flex flex-col px-8">
                        <h3 className="text-sm mb-4">Total Families</h3>
                        <div className="flex items-end gap-4">
                            <h2 className="font-medium text-4xl">{data?.totalFamilies?.toLocaleString()}</h2>
                            <p className="bg-yellow-500 text-white rounded-full px-2 text-xs">Families</p>
                        </div>
                    </div>
                </div>

                
                <hr className="my-8"/>
                <div className="h-full">
                    <AgeGroup data={data.ageGroup} />
                </div>
            </div>
            <div className="w-1/3 p-8 flex flex-col shadow-lg border border-gray-100 rounded-md h-full">
                <div className="flex flex-col px-8">
                    <h3 className="text-sm mb-4">Sex Ratio</h3>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <h2 className="font-medium text-3xl">{data?.male?.toLocaleString()}</h2>
                            <p className="bg-blue-500 text-white rounded-full px-2 text-sm">Male</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <h2 className="font-medium text-3xl">{data?.female?.toLocaleString()}</h2>
                            <p className="bg-pink-500 text-white rounded-full px-2 text-sm">Female</p>
                        </div>
                    </div>
                </div>
                <hr className="my-8"/>
                <div className="h-full">
                    <SexRatio data={{
                        male: data.male,
                        female: data.female
                    }}/>
                </div>
            </div>
        </div>
    )
}

export default CensusChart