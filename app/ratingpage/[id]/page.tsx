import React from 'react'
import HouseProfilePage from './houseprofile'
import NavbarTrans from '@/app/Components/NavbarTrans'
import Footer from '@/app/Components/Footer'

const page = ({params}) => {
  return (
    <>
    <div className='min-h-screen bg-[#f1f0e8] p-8 overflow-x-auto'>
      <NavbarTrans />
      <div className='container mx-auto mt-20'>
        <HouseProfilePage id={params.id}/>
      </div>
    </div>
    <Footer/>
    </>
  )
}

export default page
