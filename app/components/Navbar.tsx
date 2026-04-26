import { Link, useNavigate } from "react-router";

const Navbar = () => {
  const navigate = useNavigate();
  const studentName =
    typeof window !== "undefined" ? localStorage.getItem("studentName") || "Student" : "Student";

  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("studentName");
    localStorage.removeItem("studentEmail");
    navigate("/");
  };

  return (
    <nav className="navbar bg-transparent px-6 py-4 flex items-center">
      <Link to="/hub" className="hover:opacity-90">
        <p className="text-1xl font-bold text-gradient">Career prep hub</p>
      </Link>

      <div className="flex items-center gap-3">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm">{studentName}</span>
        <button onClick={logout} className="primary-button w-fit rounded-md">
          Logout
        </button>
      </div>
    </nav>
  );
};
export default Navbar;