import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { BookOpenCheck, PieChart, CalendarClock, Menu, X, ArrowBigDown, ArrowBigRight, Phone, Mail, } from 'lucide-react'
import { useTheme } from '../../context/Themecontext/ThemeContext'
import ThemeButton from '../../context/Themecontext/Themebutton'
import HeroImage from "../../assets/Landing-hero-image.png"
import HeroImage1 from "../../assets/Landing-hero-section-lightMode-Img.jpg"
import { Link } from 'react-router'
import Cookies from 'js-cookie'
import Footer from './Footer'
const LadingPage = () => {
  const [showNav, setShowNav] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const [email, setEmail] = useState('');
  const { darkMode } = useTheme()
  let textTheme = darkMode ? "text-white" : "text-black"
  let bgTheme = darkMode ? 'bg-black' : 'bg-white'
  const navigate = useNavigate();
  const handleSubmit = (event) => {
    event.preventDefault()
    if(!email.trim()){
      alert('Please Enter your Email');
      return;
    }
   navigate('/login')
  }
  useEffect(() => {
    const token = Cookies.get('sylluIQTokens')
    setIsLoggedIn(token)
  }, [])

  return (
    <>
      <div className="min-h-screen select-none">
        <nav className={`w-full h-20 ${bgTheme} fixed top-0 z-50 flex justify-between items-center px-6 p-5 shadow-md dark:shadow-lg dark:shadow-green-900/20`}>
          <div onClick={() => window.location.reload()} className="cursor-pointer  w-48 lg:w-64">
            <svg width="100%" height="100%" viewBox="0 0 420 100" xmlns="http://www.w3.org/2000/svg">

              <circle cx="50" cy="50" r="40" fill="none" stroke="#9FE1CB" strokeWidth="5" strokeOpacity="0.35" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#1D9E75" strokeWidth="5"
                strokeDasharray="188 251" strokeDashoffset="63"
                strokeLinecap="round" transform="rotate(-90 50 50)" />

              <rect x="30" y="36" width="40" height="28" rx="4" fill="#1D9E75" fillOpacity="0.12" />
              <rect x="30" y="36" width="40" height="28" rx="4" fill="none" stroke="#1D9E75" strokeWidth="1.8" />
              <line x1="50" y1="36" x2="50" y2="64" stroke="#1D9E75" strokeWidth="1.5" />

              <line x1="34" y1="45" x2="46" y2="45" stroke="#1D9E75" strokeWidth="1.3" strokeLinecap="round" />
              <line x1="34" y1="51" x2="46" y2="51" stroke="#1D9E75" strokeWidth="1.3" strokeLinecap="round" />
              <line x1="34" y1="57" x2="46" y2="57" stroke="#1D9E75" strokeWidth="1.3" strokeLinecap="round" />
              <line x1="54" y1="45" x2="66" y2="45" stroke="#1D9E75" strokeWidth="1.3" strokeLinecap="round" />
              <line x1="54" y1="51" x2="66" y2="51" stroke="#1D9E75" strokeWidth="1.3" strokeLinecap="round" />

              {/* Syllabi text */}
              <text x="104" y="46"
                fontFamily="'Segoe UI', 'Helvetica Neue', Arial, sans-serif"
                fontSize="32" fontWeight="700"
                fill="#1D9E75"
                letterSpacing="-0.5">Syllabi</text>

              {/* Q — bright green in dark, dark green in light */}
              <text x="205" y="46"
                fontFamily="'Segoe UI', 'Helvetica Neue', Arial, sans-serif"
                fontSize="32" fontWeight="700"
                fill={darkMode ? "#5DCAA5" : "#085041"}>Q</text>

              <rect x="104" y="54" width="180" height="2.5" rx="1.2" fill="#1D9E75" fillOpacity="0.28" />

              {/* Tagline */}
              <text x="104" y="74"
                fontFamily="'Segoe UI', 'Helvetica Neue', Arial, sans-serif"
                fontSize="11" fontWeight="400"
                fill={darkMode ? "#9FE1CB" : "#6b7f99"}
                letterSpacing="1.8">EXAM SYLLABUS TRACKER</text>

            </svg>
          </div>
          <div className='flex gap-10 items-center'>
            <div className={` ${textTheme} hidden lg:flex justify-between items-center gap-20 font-bold `}>
              <a href="#home" className='hover:underline cursor-pointer' >Home</a>
              <a href="#feature" className='hover:underline cursor-pointer' >Features</a>
              <a href="#how-it-works" className='hover:underline cursor-pointer' >How it works</a>
              <a href="#contact" className='hover:underline cursor-pointer' >Contact</a>
              {!isLoggedIn &&
                <Link to="/signup" className={`${textTheme} border p-2 border-green-500 rounded-lg font-bold cursor-pointer hover:text-green-500 transition duration-300`}>
                  Sign Up
                </Link>}

            </div>
            <div className='flex gap-6 items-center'>
              <ThemeButton />
              <div>
                <button className={`lg:hidden ${textTheme} border p-2 rounded-lg`}>
                  {!showNav ? <Menu onClick={() => setShowNav(!showNav)} /> : <X onClick={() => setShowNav(!showNav)} />}

                </button>
              </div>

            </div>
            {showNav && (
              <div className={`absolute top-20 left-0 w-full ${bgTheme} shadow-lg p-6 flex flex-col gap-6 lg:hidden`}>
                <a href="#home" onClick={() => setShowNav(false)} className={`${textTheme} font-bold`}>Home</a>
                <a href="#feature" onClick={() => setShowNav(false)} className={`${textTheme} font-bold`}>Features</a>
                <a href="#how-it-works" onClick={() => setShowNav(false)} className={`${textTheme} font-bold`}>How it Works</a>
                <Link to="/signUp">
                  <a href="#cta" onClick={() => setShowNav(false)} className={`${textTheme} font-bold cursor-pointer hover:text-green-500 transition duration-300`}>
                    {!isLoggedIn ? "Get Started" : "Access DashBoard"}
                  </a>
                </Link>
                <a href="#contact" onClick={() => setShowNav(false)} className={`${textTheme} font-bold`}>Contact</a>
              </div>
            )}
          </div>
        </nav>

        <div>
          {/* Hero Section */}
          <section id="home" className={`${bgTheme}   min-h-screen pt-[110px] lg:pt-20 flex flex-col lg:flex-row lg:justify-center items-center lg:gap-10`}>
            <div className='lg:hidden mt-10 m-5' >
              <img src={!darkMode ? HeroImage : HeroImage1} className="w-full rounded-2xl shadow-xl shadow-green-500/20 
           border-2 border-green-500/30 hover:scale-110 
           transition-transform duration-500"  alt="SyllabusIQ" />
            </div>
            <div className="w-full lg:w-2/5 flex flex-col lg:gap-5">
              <div className='flex flex-col gap-5'>              <h1 className={`${textTheme} text-center lg:text-left text-4xl lg:text-6xl font-bold text-gray-900`}>Track your syllabus Ace every exam.</h1>
                <p className={` ${textTheme} text-center lg:text-left text-sm px-2 text-gray-500 dark:text-gray-400`}>Tired of opening 5 apps just to know what's left to study?
                  SyllabiQ gives you one clean dashboard for your entire exam prep.</p></div>
              <div className={`${textTheme} flex gap-3 lg:gap-4 mt-4 justify-center lg:justify-start items-center p-5`}>
                <Link to="/signup">
                  <button className="text-[14px] px-6 py-3 bg-green-500 hover:bg-green-600 
                   text-white font-semibold rounded-xl 
                   transition duration-300">
                    {!isLoggedIn ? "Get Started" : " Access DashBoard"}
                  </button>
                </Link>
                <a href="#feature">
                  <button className="px-6 py-3 border border-1 border-green-500 
                   text-green-500 hover:bg-green-500 hover:text-white
                   font-semibold rounded-xl transition duration-300">
                    Explore Now
                  </button>
                </a>
              </div>
            </div>
            <div className='hidden lg:flex' >
              <img src={!darkMode ? HeroImage : HeroImage1} className="w-full rounded-2xl shadow-xl shadow-green-500/20 
           border-2 border-green-500/30 hover:scale-110 
           transition-transform duration-500"  alt="SyllabusIQ" />
            </div>
          </section>

          {/* Feature Section */}

          <section id="feature" className={`${bgTheme}  px-6 pb-20 scroll-mt-20`}>
            <h2 className={`${textTheme} text-4xl font-bold text-center p-10`}>
              Why SyllabiQ?
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mx-auto max-w-5xl '>
              <div className={`${darkMode ? 'bg-gray-900 border-green-500/20 text-white' : 'bg-white border-gray-200 text-black'} flex flex-col items-center gap-4 p-6 rounded-2xl border min-h-64 w-full hover:shadow-lg hover:border-green-500/50 hover:-translate-y-1 transition duration-300`}>
                <div className="p-4 bg-green-500/10 rounded-full">
                  <BookOpenCheck size={32} className="text-green-500" />
                </div>
                <h3 className="text-xl font-bold">Topic Tracking</h3>
                <p className="text-center text-sm text-gray-500">
                  Mark every topic as Not Started, In Progress or Done
                </p>
              </div>

              <div className={`${darkMode ? 'bg-gray-900 border-green-500/20 text-white' : 'bg-white border-gray-200 text-black'} flex flex-col items-center gap-4 p-6 rounded-2xl border min-h-64 w-full hover:shadow-lg hover:border-green-500/50 hover:-translate-y-1 transition duration-300`}>
                <div className="p-4 bg-green-500/10 rounded-full">
                  <PieChart size={32} className="text-green-500" />
                </div>
                <h3 className="text-xl font-bold">Visual Progress</h3>
                <p className="text-center text-sm text-gray-500">
                  See your completion percentage per subject at a glance
                </p>
              </div>
              <div className={`${darkMode ? 'bg-gray-900 border-green-500/20 text-white' : 'bg-white border-gray-200 text-black'} flex flex-col items-center gap-4 p-6 rounded-2xl border min-h-64 w-full hover:shadow-lg hover:border-green-500/50 hover:-translate-y-1 transition duration-300`}>
                <div className="p-4 bg-green-500/10 rounded-full">
                  <CalendarClock size={32} className="text-green-500" />
                </div>
                <h3 className="text-xl font-bold">Exam Countdown</h3>
                <p className="text-center text-sm text-gray-500">
                  Know exactly how many days left until your exam
                </p>
              </div>
            </div>
          </section>

          {/* How it work section Work Flow */}
          <section id="how-it-works" className={`${bgTheme} py-20 px-6`}>

            <h2 className={`${textTheme} text-4xl font-bold text-center mb-16`}>
              How It Works
            </h2>

            <div className="max-w-5xl mx-auto relative">

              <div className="grid grid-cols-1 lg:grid-cols-5 items-center gap-4">

                {/* Step 1 */}
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="w-16 h-16 rounded-full border-2 border-green-500 
                    bg-green-500/10 flex items-center justify-center 
                    text-green-500 font-bold text-2xl">
                    1
                  </div>
                  <h3 className={`${textTheme} text-xl font-bold`}>Add Subjects</h3>
                  <p className="text-gray-500 text-sm">Add all your subjects and set your exam date</p>
                  <ArrowBigDown className="lg:hidden text-green-500" size={40} />
                </div>

                {/* Arrow — desktop only */}
                <div className="hidden lg:flex justify-center">
                  <ArrowBigRight className="text-green-500" size={40} />
                </div>

                {/* Step 2 */}
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="w-16 h-16 rounded-full border-2 border-green-500 
                    bg-green-500/10 flex items-center justify-center 
                    text-green-500 font-bold text-2xl">
                    2
                  </div>
                  <h3 className={`${textTheme} text-xl font-bold`}>Track Topics</h3>
                  <p className="text-gray-500 text-sm">Mark each topic as Not Started, In Progress or Done</p>
                  <ArrowBigDown className="lg:hidden text-green-500" size={40} />
                </div>

                {/* Arrow — desktop only */}
                <div className="hidden lg:flex justify-center">
                  <ArrowBigRight className="text-green-500" size={40} />
                </div>

                {/* Step 3 */}
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="w-16 h-16 rounded-full border-2 border-green-500 
                    bg-green-500/10 flex items-center justify-center 
                    text-green-500 font-bold text-2xl">
                    3
                  </div>
                  <h3 className={`${textTheme} text-xl font-bold`}>Ace Your Exam</h3>
                  <p className="text-gray-500 text-sm">Watch progress rings fill up and never miss a topic</p>
                </div>

              </div>
            </div>
          </section>

          {/* CTA section */}
          <section id="cta" className={`${bgTheme} py-20 px-6`}>
            <div className="max-w-3xl mx-auto flex flex-col items-center gap-6 text-center">

              <h2 className={`${textTheme} text-4xl font-bold`}>
                Ready to ace your exams?
              </h2>

              <p className="text-gray-500 text-lg">
                Join students who are already tracking smarter with SyllabiQ
              </p>

              <Link to="/signup">
                <button className="px-8 py-4 bg-green-500 hover:bg-green-600 
                       text-white font-bold text-lg rounded-xl 
                       transition duration-300">
                  {!isLoggedIn ? "Get Started Here 👋" : "Go To Dashbord 👉"}
                </button>
              </Link>

            </div>
          </section>

          <footer id="contact" className={`${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
            {/* <div className="max-w-8xl mx-auto  flex flex-col md:flerow justify-cen items-center gap-6">

              <div className='lg:flex flex-col items-center gap-10'>
       
                <div className='flex flex-col gap-5 text-center'>
                  <h3 className="text-green-500 font-bold text-5xl lg:text-9xl">Syllab IQ</h3>
                  <p className="text-gray-500 text-sm">Track your syllabus. Ace every exam.</p>
                  <div>
                    <form onSubmit={handleSubmit}>
                      <input
                        type="email"
                        placeholder="Enter your Gmail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="text-black p-2 border rounded-l-lg"
                      />

                      <button
                        type="submit"
                        className="bg-green-400 p-2 rounded-r-lg"
                      >
                        Subscribe
                      </button>
                    </form>
                  </div>
                </div>

                
                <div className={`${textTheme} lg:hidden flex flex-col items-center gap-8 m-10`}>
                  <a href="#home">Home</a>
                  <a href="#feature">Features</a>
                  <a href="#how-it-works">How it Works</a>
                </div>
              </div>

      
              <div className='flex flex-col justify-center items-center gap-5'>
                <p className="flex flex-col md:flex-row justify-center items-center  md:items-end gap-2 text-gray-500 text-lg md:text-md">Built by <span className="text-green-500 font-bold text-2xl">Hemanth Atthuluri</span></p>
                <div className='w-full flex flex-row justify-center gap-5 mb-2'>
                  <div className={`p-3 border rounded-full ${darkMode ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-50'} transition-all duration-300 cursor-pointer`}>
                    <a href="tel:8143276940" target='_blank'><Phone size={20} className="text-green-500" /></a>
                  </div>
                  <div className={`p-3 border rounded-full ${darkMode ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-50'} transition-all duration-300 cursor-pointer`}>
                    <a href="https://mail.google.com/mail/?view=cm&to=ramasaiahemanth@gmail.com" target='_blank'><Mail size={20} className="text-green-500" /></a>
                  </div>
                </div>
                <p className="text-gray-500 text-sm">© 2026 SyllabiQ</p>
              </div>

            </div> */}
            <Footer darkMode={darkMode} email={email} handleSubmit={handleSubmit} setEmail={setEmail}/>
          </footer>
        </div>
      </div>
    </>
  )
}

export default LadingPage