import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 pt-14 pb-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              CoursePilot
            </span>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
              Empowering learners worldwide with expert-led courses. Start your journey today and master the skills that matter.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Platform
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link to="/" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-150">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-150">
                  Courses
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-150">
                  Dashboard
                </Link>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-150">
                  Support
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Learn
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a href="#" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-150">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-150">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-150">
                  FAQ
                </a>
              </li>
              <li>
                <a href="mailto:alighonim78@gmail.com" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-150">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Contact
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a href="tel:01017040332" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-150">
                  01017040332
                </a>
              </li>
              <li>
                <a href="mailto:alighonim78@gmail.com" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-150">
                  alighonim78@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/ali_ragab214"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-150"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com/in/ali-ghonim-b139b8223/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-150"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-6 space-y-3 md:space-y-0">
          <div className="text-sm text-slate-500 dark:text-slate-400">
            &copy; {new Date().getFullYear()} CoursePilot. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors duration-150">
              Privacy Policy
            </a>
            <span className="text-slate-300 dark:text-slate-600">·</span>
            <a href="#" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors duration-150">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
