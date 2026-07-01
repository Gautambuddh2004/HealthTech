import React from 'react'
import Navbar from '..pages/navbar'
import about1 from '../assets/about1.png'

function About() {
  return (
    <div className='bg-[#123043] min-h-screen'>
      <div className='px-5 sm:px-10 md:px-20 lg:px-40'>
        <Navbar/>

        <div className='text-red-500 text-2xl sm:text-3xl md:text-4xl font-semibold pt-16 sm:pt-20 justify-center flex'>
          <h1><u>About HealthTech</u></h1>
        </div>

        <div className='pt-5 text-white text-base sm:text-lg md:text-2xl text-center leading-relaxed'>
          Our platform allows users to search, compare, and book appointments across multiple hospitals in one place.
          Whether it's a routine check-up or specialist consultation, we make healthcare access faster and easier.
          You can also view doctor profiles, check real-time availability, read verified patient reviews, and get transparent pricing before booking.
          With seamless scheduling, reminders, and digital records, we ensure a hassle-free healthcare experience—saving your time and helping you make informed decisions for you and your family.
        </div>

        <div className='flex justify-center'>
          <img className='pt-10 w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl h-auto object-contain' src={about1} alt="About HealthTech"/>
        </div>

        <p className='pt-10 flex justify-center text-2xl sm:text-3xl font-semibold text-red-500'><u>Key Features</u></p>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 pt-10 text-white gap-6 sm:gap-8 md:gap-10'>
          <div className='border rounded-2xl p-5'>
            <h3 className='text-lg sm:text-xl md:text-2xl text-yellow-600 font-semibold mb-2'>Multi-Hospital Booking</h3>
            <p className='text-sm sm:text-base leading-relaxed'>Easily search, compare, and book appointments across multiple hospitals from a single platform.</p>
          </div>
          <div className='border rounded-2xl p-5'>
            <h3 className='text-lg sm:text-xl md:text-2xl text-yellow-600 font-semibold mb-2'>Search any Hospital</h3>
            <p className='text-sm sm:text-base leading-relaxed'>Easily search and discover hospitals by location, specialty, or services, with all essential details available at your fingertips.</p>
          </div>
          <div className='border rounded-2xl p-5'>
            <h3 className='text-lg sm:text-xl md:text-2xl text-yellow-600 font-semibold mb-2'>Find a Doctor</h3>
            <p className='text-sm sm:text-base leading-relaxed'>Easily search the right doctor based on your needs. Filter by specialty, location, experience, and availability.</p>
          </div>
        </div>

        <p className='pt-10 flex justify-center text-2xl sm:text-3xl font-semibold text-red-500'><u>Vision</u></p>
        <div className='pt-6 text-white font-semibold text-base sm:text-lg md:text-2xl leading-relaxed'>
          To make HealthTech accessible, connected, and efficient by enabling seamless interaction between patients, doctors, and medical data.
          We aim to simplify the entire healthcare journey by providing a unified platform where users can easily find the right doctors, book appointments, and securely manage their medical records.
          Our vision is to enhance transparency, save time, and empower individuals to make informed healthcare decisions anytime, anywhere.
        </div>

        <div className='pb-10'>
          <p className='text-2xl sm:text-3xl md:text-4xl text-red-500 font-semibold pt-10 flex justify-center'><u>How It Works</u></p>

          <h1 className='pt-5 text-lg sm:text-xl md:text-2xl text-yellow-600 font-mono'><u>User Login</u></h1>
          <ol className='list-disc text-sm sm:text-base md:text-lg text-white pl-5 space-y-2 mt-2'>
            <li>Login: User logs into their account, if have account otherwise Signup.</li>
            <li>Next step they search interested hospital which they want.</li>
            <li>After that they can make the booking by clicking on Book Now from there.</li>
            <li>Once the booking is confirmed by the hospitals, a message will be sent to their given email.</li>
            <li>You can also see more notifications on our site.</li>
          </ol>

          <h1 className='pt-5 text-lg sm:text-xl md:text-2xl text-yellow-600 font-mono'><u>Hospital Login</u></h1>
          <ol className='list-disc text-sm sm:text-base md:text-lg text-white pl-5 space-y-2 mt-2'>
            <li>Hospitals can login with their registered Email and password.</li>
            <li>After that they access Hospital Dashboard.</li>
            <li>Where they Accept/Reject the bookings.</li>
          </ol>
        </div>
      </div>

      <hr />
      <div className='flex flex-col sm:flex-row justify-around items-center text-white font-semibold gap-3 py-5 sm:h-20 text-center px-5 text-sm sm:text-base'>
        <p>Making your experience simple and efficient.</p>
        <p>Contact: guptagautambuddh@gmail.com</p>
        <p>© 2026 YourApp. All rights reserved.</p>
      </div>
    </div>
  )
}

export default About
