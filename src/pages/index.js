//import Head from 'next/head'
//import Image from 'next/image'
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap styles
import { Inter } from 'next/font/google'
import axios from "axios"
const inter = Inter({ subsets: ['latin'] })
export default function Home() {
  async function getUser(){
    const res=await axios.get('api/hello');
    console.log(res);

  }
  return (
    <div>
    <header className="bg-dark text-white text-center py-5">
      <h1 className="display-4">Health data management </h1>
      <ul className="list-inline">
        <li className="list-inline-item"><a href="/" className="text-white">About</a></li>
        <li className="list-inline-item"><a href="/signin" className="text-white">Login</a></li>
      </ul>
    </header>
    <h1>About the application</h1>
    <p>The application will help you take control of your healthcare data</p>
    <section>
      <ul>
        <li>My identity: Create or view your healthcare data</li>
        <li>Control your data: Authorize the access to your data</li>
        <li>Get and verify your patients' data: As a healthcare staff, you can easily access your patients' data and add new medical records.</li>
      </ul>
    </section>
    {/* Render other components or HTML code */}
  </div>
   
  )
}
