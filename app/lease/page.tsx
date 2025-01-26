import React from 'react'
import LeaseAnalysisApp from './leaseupload'
import NavbarTrans from '../Components/NavbarTrans'
import Footer from '../Components/Footer'

const page = () => {
  return (
    <>
      <NavbarTrans/>
      <div className='bg-[#f5f5f4]'>
        <div className='container mx-auto mt-20'>
          <LeaseAnalysisApp/>
        </div>
      </div>
      <Footer/>
    </>
  )
}

export default page
