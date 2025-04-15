import Link from 'next/link';

export default function Navbar() {
  return (
    <div className="navbar bg-base-100 shadow-md rounded-b-xl flex flex-row justify-between items-center">
      <div className="navbar-start flex-none">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-4 shadow bg-base-100 rounded-box w-52">
            <li><Link href="/" className="font-medium">🏠 Home</Link></li>
            <li><Link href="/upload" className="font-medium">📤 Upload Assignment</Link></li>
            <li><Link href="#" className="font-medium">👨‍🎓 How It Works</Link></li>
          </ul>
        </div>
        <Link href="/" className="btn btn-ghost normal-case text-xl font-bold text-primary">
          📚 BreakMyAssignment
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex flex-none">
        <ul className="menu menu-horizontal px-1 gap-2 flex flex-row">
          <li><Link href="/" className="font-medium rounded-full px-4">🏠 Home</Link></li>
          <li><Link href="/upload" className="font-medium rounded-full px-4">📤 Upload</Link></li>
          <li><Link href="#" className="font-medium rounded-full px-4">👨‍🎓 How It Works</Link></li>
        </ul>
      </div>
      <div className="navbar-end flex-none">
        <Link href="/upload" className="btn btn-primary rounded-full px-6">
          Start Now 🚀
        </Link>
      </div>
    </div>
  );
} 