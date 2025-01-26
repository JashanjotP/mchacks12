import React from 'react'
import ReviewUploadPage from './uploadpage'
import NavbarTrans from '@/app/Components/NavbarTrans'
import Footer from '@/app/Components/Footer'

const page = () => {
  return (
    <>
        <NavbarTrans/>
        <div className='mt-20'>
            <ReviewUploadPage/>
        </div>
        <Footer/>
    </>
  )
}

export default page
