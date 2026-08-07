import {
  Mail,
  Phone,
  Home,
  Star,
  Lightbulb,
  GraduationCap,
  ArrowRight,
  CheckCheck
} from "lucide-react";

export default function Footer({
  email,
  setEmail,
  handleSubmit,
}) {
  return (
    <footer
      id="contact"
     
    >
      <div className="w-full overflow-hidden border border-green-100 bg-white/80 shadow-2xl backdrop-blur-xl dark:border-green-900/40 dark:bg-gray-950/80">

        <div className="grid gap-12 p-6 sm:p-10 lg:grid-cols-3 lg:gap-12 lg:p-12">

          {/* Left */}
          <div>
            <GraduationCap className="text-green-500" size={42} />

            <h2 className="text-5xl font-black sm:text-6xl lg:text-7xl">
              <span className="text-black dark:text-white">Syllab </span>
              <span className="text-green-500">IQ</span>
            </h2>

            <p className="mt-4 text-lg text-gray-500">
              Track your syllabus.
              <span className="font-semibold text-green-600">
                {" "}Ace every exam.
              </span>
            </p>

            <h3 className="mt-10 text-3xl font-bold">
              Subscribe for updates
            </h3>

            <p className="text-gray-500 mt-3">
              Get tips, updates and study resources.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 flex w-full max-w-xl flex-col gap-2 sm:flex-row sm:gap-0">
              <input
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                type="email"
                placeholder="Enter your Gmail"
                className="min-w-0 flex-1 rounded-xl border px-5 py-4 font-mono outline-none sm:rounded-r-none"
              />

              <button className="rounded-xl bg-green-500 px-7 py-4 font-semibold text-white hover:bg-green-600 sm:rounded-l-none">
                Subscribe
              </button>
            </form>

            <div className="flex flex-wrap gap-6 mt-8 text-gray-500">
              <span className="flex gap-2 hover:text-green-600 trasition-all duration-300"><CheckCheck /> Exam Tips</span>
              <span className="flex gap-2 hover:text-green-600 trasition-all duration-300"><CheckCheck /> Study Resources</span>
              <span className="flex gap-2 hover:text-green-600 trasition-all duration-300"><CheckCheck /> Smart Updates</span>
            </div>
          </div>

          {/* Center */}
          <div className="border-gray-200 lg:border-x lg:px-12 dark:border-gray-800">
            <h3 className="mb-8 text-3xl font-bold sm:mb-10">
              Quick Links
            </h3>

            <div className="space-y-7">
              <a href="#home" className="flex items-center justify-between hover:text-green-600">
                <span className="flex gap-3 items-center">
                  <Home className="text-green-500"/>
                  Home
                </span>
                <ArrowRight />
              </a>

              <a href="#feature" className="flex items-center justify-between hover:text-green-600">
                <span className="flex gap-3 items-center">
                  <Star className="text-green-500"/>
                  Features
                </span>
                <ArrowRight />
                
              </a>

              <a href="#how-it-works" className="flex items-center justify-between hover:text-green-600">
                <span className="flex gap-3 items-center">
                  <Lightbulb className="text-green-500"/>
                  How it Works
                </span>
                <ArrowRight />
                
              </a>
            </div>
          </div>

          {/* Right */}
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-green-700 text-white flex items-center justify-center text-3xl font-bold mx-auto">
              <img src = "https://res.cloudinary.com/dqtlqvhw5/image/upload/v1781927873/Hemnath_img_yshhlo.png" alt="hemanth's photo" />
            </div>

            <p className="mt-5 text-gray-500">
              Built by
            </p>

            <h3 className="mt-2 text-3xl font-bold text-green-600 sm:text-4xl">
              Hemanth Atthuluri
            </h3>

            <div className="w-20 h-1 bg-green-500 rounded-full mx-auto mt-4"/>

            <p className="mt-10 font-semibold">
              Let's connect
            </p>

            <div className="flex justify-center gap-6 mt-6">

              <a
                href="tel:8143276940"
                className="w-16 h-16 rounded-2xl border flex items-center justify-center hover:bg-green-50 transition"
              >
                <Phone className="text-green-500"/>
              </a>

              <a
                href="mailto:ramasaiahemanth@gmail.com"
                className="w-16 h-16 rounded-2xl border flex items-center justify-center hover:bg-green-50 transition"
              >
                <Mail className="text-green-500"/>
              </a>

            </div>
          </div>

        </div>

        <div className="flex flex-col items-center justify-between gap-2 bg-[#062b21] px-6 py-6 text-center text-white sm:px-10 md:flex-row md:text-left">
          <p>© 2026 SyllabiQ. All rights reserved.</p>

          <p className="mt-4 md:mt-0">
            Made with 💚 for learners everywhere.
          </p>
        </div>

      </div>
    </footer>
  );
}
