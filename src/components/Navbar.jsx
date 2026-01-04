export default function Navbar({ setPage, page, user, logout }) {
  const linkClass = (tab) =>
    `relative pb-1 transition ${page === tab
      ? 'text-amber-400 after:absolute after:left-0 after:-bottom-1 after:w-full after:h-[2px] after:bg-amber-400'
      : 'text-zinc-300 hover:text-amber-300'
    }`;
  return (
    <nav className="bg-zinc-900 border-b border-zinc-800">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">

         <div className="flex items-center gap-10">

          {/* LOGO / BRAND */}
          <button
            onClick={() => setPage('home')}
            className="text-2xl font-bold tracking-wide text-amber-400 hover:text-amber-300 transition"
          >
            Amber<span className="text-white">Bid</span>
          </button>

          {/* NAV LINKS */}
          <div className="flex items-center gap-6">
            <button onClick={() => setPage('home')} className={linkClass('home')}>
              Home
            </button>

            {user?.role === "seller" && (
              <button onClick={() => setPage('seller')} className={linkClass('seller')}>
                Seller
              </button>
            )}
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          {!user ? (
            <>
              <button
                onClick={() => setPage('register')}
                className={linkClass('register')}
              >
                Register
              </button>
              <button
                onClick={() => setPage('login')}
                className={linkClass('login')}
              >
                Login
              </button>
            </>
          ) : (
            <>
              <span className="text-amber-400 text-md">
                {user.name} <span className="text-amber-500">({user.role})</span>
              </span>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-md transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
