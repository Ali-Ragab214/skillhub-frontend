import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 md:pt-20 md:pb-12">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="flex flex-col gap-4">
            

            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
              Master Skills That
              <br />
              <span className="text-slate-500 dark:text-slate-400">Shape Your Future</span>
            </h1>

            <p className="text-base text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
              Unlock your potential with expert-led courses designed to take you from beginner to pro. Start learning today.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/register"
                className="bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 font-medium px-5 py-2.5 rounded-lg transition-colors duration-150 active:scale-[0.98]"
              >
                Get Started Free
              </Link>
              <Link
                to="/"
                className="border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium px-5 py-2.5 rounded-lg transition-colors duration-150"
              >
                Explore Courses
              </Link>
            </div>

            <div className="flex items-center gap-6 pt-2">
              <div>
                <p className="text-lg font-semibold text-slate-900 dark:text-white">10k+</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Students</p>
              </div>
              <div className="w-px h-7 bg-slate-200 dark:bg-slate-700" />
              <div>
                <p className="text-lg font-semibold text-slate-900 dark:text-white">500+</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Courses</p>
              </div>
              <div className="w-px h-7 bg-slate-200 dark:bg-slate-700" />
              <div>
                <p className="text-lg font-semibold text-slate-900 dark:text-white">50+</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Instructors</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <img
           // src="public/1782952591399.png"
           src="public/1782952478483.jpg.jpeg"
            //  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800"
             //   src="public/IMG_20260404_162520_879.JPG.jpeg?"
              alt="Students collaborating in a modern classroom"
              className="rounded-lg object-cover w-full h-80 md:h-110 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
