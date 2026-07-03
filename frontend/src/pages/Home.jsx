import Navbar from "./Navbar";
import main from "../assets/mainlanding.png" 
import Card from "./Card" 
import hosp from "../assets/hosp.jpg" 
import hosp12 from "../assets/hosp12.jpg" 
import { Link } from "react-router-dom"; 
import book from "../assets/booking.jpg" 
import doctor from "../assets/doctors.jpg" 
import twenty from "../assets/twentyfour.png" 
import short2 from "../assets/short2.jpg" 
import short3 from "../assets/short3.jpeg" 
import family from "../assets/family3.png" 
import Footer from "./Footer";

function Home(){
  return<div className="font-medium text-base md:text-lg">
    <Navbar/>

    <div>
      <div>
        <img className="w-full pt-15 h-auto md:h-[550px] object-cover" src={main} alt="" />
      </div>

      <div>
        <Card/>
        <br></br>
        <hr className="border-2 border-black"/>
      </div>
      
      <div className="m-5 md:m-15 px-4 md:pl-20 md:pr-20">
        <p className="text-2xl md:text-[35px] font-bold">
          Discover Hospitals Known for Excellence and Verified Reviews
        </p>

        <p className="text-base md:text-[20px]">
          Experience world-class healthcare across specialized hubs of medical excellence.We offer access to multiple hospitals and clinics, helping you find the one that best fits your needs. Each listed healthcare provider includes verified details, trusted patient reviews, and authentic ratings for confident decision-making.
        </p>
      
        <div className="rounded-2xl flex flex-col md:flex-row">
          <img className="mt-5 md:mt-10 w-full md:w-[50%] rounded-xl" src={hosp}/>
          <p className="md:pl-5 md:pt-30 md:pb-10 md:pr-20 text-base md:text-[20px]">
            HealthTech platform is a modern digital healthcare solution designed to simplify how patients, doctors, and hospitals connect and communicate. With secure technology and user-friendly tools, we make healthcare more accessible, organized, and efficient.Whether you're a patient booking an appointment, a doctor managing schedules, or a hospital monitoring daily operations — everything is available in one smart system.
          </p>
        </div>

        <hr className="border-2 mt-10 md:mt-20 border-blue-500"/>

{/*change page 1*/}
  <div>
        <div className="md:ml-30">
          <p className="text-xl md:text-[30px] font-bold mt-10">Trusted Hospital Network</p>

          <div className="mt-5 md:mt-10 rounded-2xl flex flex-col md:flex-row shadow-xl/30">
            <img className="p-5 rounded-2xl w-full md:w-[50%]" src={hosp12} alt="" />
            <div>
              <p className="md:pt-10 pl-3 md:pl-0 pr-3  md:pr-10">
                You can search hospitals, view doctor profiles, book appointments, and communicate securely online.We offers a wide range of healthcare services with help of Health Tech to ensure patient well-being. Outpatient consultations are available across multiple specialties, while inpatient care provides comfortable rooms and 24/7 nursing.The hospital features a fully equipped emergency department and critical care units for urgent cases.
              </p>
              <p className="mt-5 mb-5 ml-2 pl-5 rounded md:rounded-lg  w-32 h-10 flex items-center text-white bg-blue-500">
                <Link to="/Hospitals">View More</Link>
              </p>
            </div>
          </div>
        </div>

        <hr className="border-2 mt-10 md:mt-20 border-blue-500"/>

{/*change page2*/}
        <div className="md:ml-30">
          <p className="text-xl md:text-[30px] font-bold mt-10">Book Appointments in Multiple Hospitals</p>

          <div className="mt-5 md:mt-10 rounded-2xl flex flex-col md:flex-row shadow-xl/30">
            <img className="p-5 rounded-2xl w-full md:w-[50%]" src={book} alt="" />
            <div>
              <p className="md:pt-10 pl-3 md:pl-0 pr-3  md:pr-10">
                HealthTech platform makes booking medical appointments simple, fast, and convenient.Patients can search forhospitals and doctors based on specialty, location, and availability then schedule appointments in just a few clicks. The system allows multiple hospital bookings, ensuring users can choose the best facility and doctor for their needs.
              </p>
              <p className="mt-5 mb-5 ml-2 pl-5 rounded md:rounded-lg w-32 h-10 flex items-center text-white bg-blue-500">
                <Link to="/booking">View More</Link>
              </p>
            </div>
          </div>
        </div>

        <hr className="border-2 mt-10 md:mt-20 border-blue-500"/>

{/*change page3*/}
        <div className="md:ml-30">
          <p className="text-xl md:text-[30px] font-bold mt-10">
            Meet Our Expert Doctors Providing Quality Healthcare Services
          </p>

          <div className="mt-5 md:mt-10 rounded-2xl flex flex-col md:flex-row shadow-xl/30">
            <img className="p-5 rounded-2xl w-full md:w-[50%]" src={doctor} alt="" />
            <div>
              <p className="md:pt-10 pl-3 md:pl-0 pr-3  md:pr-10">
                HealthTech brings together a team of highly skilled and compassionate doctors dedicated to providing exceptional healthcare. Each doctor specializes in their respective fields, including cardiology, orthopedics, pediatrics, neurology, and more.They focus on accurate diagnosis, effective treatment, and personalized patient care.
              </p>
              <p className="mt-5 mb-5 ml-2 pl-5 rounded md:rounded-lg w-32 h-10 flex items-center text-white bg-blue-500">
                <Link  to="/doctors">View More</Link>
              </p>
            </div>
          </div>
        </div>

        <hr className="border-2 mt-10 md:mt-20 border-blue-500"/>
      </div>
      </div>
          
      <div className="mt-10 md:mt-20 px-4 md:px-30 py-10 bg-red-100">
        <p className="text-2xl md:text-[40px] font-bold leading-8">Why Choose Us</p>
        <p className="pt-5">We Value Your Health and Time</p>

        <div className="flex flex-col md:flex-row justify-between gap-5">
          <p className="pt-5 md:w-[70%]">
            We offer fast appointment booking, verified doctor profiles, secure patient history storage, and easy communication through chat, calls, and video consultations. With reminders, transparency, and a user-friendly interface, we make healthcare simple, accessible, and reliable. Choose us for trusted care and a seamless digital medical experience.
          </p>

          <div className="bg-blue-500 text-white rounded-2xl w-50 h-10 flex items-center justify-center">
            <Link to="/booking">📅Make Appoitment</Link>
          </div>
        </div>

{/*cards*/}
        <div className="flex flex-col md:flex-row gap-5 mt-10">
          <div className="bg-blue-200 p-4 rounded-2xl shadow-xl/30 flex gap-5">
            <img className="w-20" src={twenty}/>
            <p>24/7 care with instant support, emergency help, and doctor availability.</p>
          </div>

          <div className="bg-blue-200 p-4 rounded-2xl shadow-xl/30 flex gap-5">
            <img className="w-20" src={short2}/>
            <p>Certified expert doctors providing trusted advanced healthcare solutions.</p>
          </div>

          <div className="bg-blue-200 p-4 rounded-2xl shadow-xl/30 flex gap-5">
            <img className="w-20" src={short3}/>
            <p>Your medical records are safely stored with secure, encrypted, trusted access.</p>
          </div>
        </div>
      </div>

{/*bottom*/}
      <div className="bg-blue-950 flex flex-col md:flex-row md:gap-5 items-end p-5 md:p-10">
  <img className="md:pl-30 w-80 md:w-180" src={family}/>

  <div className="pt-5 md:pt-30 md:w-100">
    <p className="text-white text-xl md:text-[40px]">
      Trusted Care for Every Stage of Life !
    </p>

    <div className="bg-blue-500 text-white rounded-2xl w-50 h-10 flex items-center justify-center">
      <Link to="/booking">📅Make Appoitment</Link>
    </div>
  </div>
</div>

      <Footer/>
    </div>
  </div>
}
export default Home;