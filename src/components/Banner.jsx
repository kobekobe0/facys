import card1 from '../assets/1.webp'
import card2 from '../assets/2.webp'
import card3 from '../assets/hero.png'
import DETAILS from '../constants/details'

const Banner = () => {
    return (
        <div className="flex items-center flex-col justify-around w-full h-[85vh] xl:p-12 overflow-hidden">
        <div className="relative w-full items-center justify-center xl:flex xl:px-72">
          {/* Text Container */}
          <div className="relative text-center xl:p-32 z-10 mb-20 mt-20 ">
            <h1 className="text-6xl font-bold text-gray-800">{DETAILS.hero}</h1>
            <p className="text-md mt-4">{DETAILS.subtitle}</p>
          </div>
    
          {/* Image Container */}
          <div className="relative flex justify-center items-center xl:bg-gradient-to-r from-red-500 to-orange-500 rounded-lg ">

            <img
              src={card3}
              alt="banner_pic"
              className="relative h-full transition-all xl:w-[50vw] rounded-3xl z-50 transform "
            />
          </div>
        </div>
    
      </div> 
    )
}

export default Banner