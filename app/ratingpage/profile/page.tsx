import React from 'react'
import HouseProfilePage from './houseprofile'
import NavbarTrans from '@/app/Components/NavbarTrans'
import Footer from '@/app/Components/Footer'

const page = () => {
  return (
    <>
    <div className='min-h-screen bg-[#f1f0e8] p-8'>
      <NavbarTrans />
      <div className='container mx-auto mt-20'>
        <HouseProfilePage />
      </div>
    </div>
    <Footer/>
    </>
  )
}

export default page
