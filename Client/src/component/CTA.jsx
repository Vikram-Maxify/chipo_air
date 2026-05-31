import React from 'react'

const CTA = () => {
    return (
        <>
            {/* CTA BOX */}
            <div className="bg-gradient-to-r from-[#2276FF] to-[#0057D9] rounded-[32px] p-8 md:p-12 text-white shadow-2xl mt-10 max-w-7xl mx-auto mb-5">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-10">

                    {/* LEFT */}
                    <div className="max-w-2xl">
                        <h3 className="text-3xl md:text-4xl font-black leading-tight mb-5">
                            Ready For Your Next Journey?
                        </h3>

                        <p className="text-blue-100 text-lg leading-8">
                            Book flights, hotels, and holiday packages
                            at unbeatable prices with secure payment and
                            instant confirmation.
                        </p>
                    </div>

                    {/* RIGHT */}
                    <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-3 md:gap-4 w-full sm:w-auto">

                        <button
                            onClick={() => navigate("/")}
                            className="w-full sm:w-auto min-w-[170px] bg-white text-blue-700 hover:bg-blue-50 px-5 md:px-8 h-12 md:h-14 rounded-2xl font-bold text-sm md:text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]"
                        >
                            Start Booking
                        </button>

                        <button
                            onClick={() => navigate("/packages")}
                            className="w-full sm:w-auto min-w-[170px] border-2 border-white/30 hover:border-white bg-white/10 hover:bg-white/20 backdrop-blur-md px-5 md:px-8 h-12 md:h-14 rounded-2xl font-semibold text-sm md:text-lg transition-all duration-300 hover:scale-[1.02]"
                        >
                            Explore Deals
                        </button>

                    </div>
                </div>
            </div>
        </>
    )
}

export default CTA