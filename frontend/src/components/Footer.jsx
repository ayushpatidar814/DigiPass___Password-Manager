import React from 'react'

const Footer = () => {
    return (
        <div className='fixed bottom-0 bg-slate-800 text-white flex justify-between items-center px-5 md:px-23 h-8 w-full pt-0'>
            <div className="logo font-bold text-white text-xl md:text-2xl">
                <span className='text-green-500'> &lt;</span>
                <span>DigiPass</span><span className='text-green-500'>&gt;</span>    
            </div>
            <div className='flex justify-center items-center text-xl md:text-2xl'> Created with <img className='invert w-7 mx-2' src="/favourite-stroke-rounded.svg" alt="icon" /> by CodeWithAyush </div>
        </div>
    )
}

export default Footer
