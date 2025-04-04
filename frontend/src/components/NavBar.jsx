import { useState, useRef, useEffect } from "react";
import { FaTimes, FaFileAlt, FaUserShield, FaChartBar, FaSignOutAlt, FaCog } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [regno, setRegno] = useState("");
  const [userInfo, setUserInfo] = useState({});
  const [loggingOut, setLoggingOut] = useState(false);
  const navRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.regno) {
      setRegno(storedUser.regno);
    }
  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!regno) return;
      try {
        const response = await axios.get(`http://localhost:3000/getUser/${regno}`);
        setUserInfo(response.data);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    fetchUserInfo();
  }, [regno]);

  const handleLogout = () => {
    setLoggingOut(true);
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  return (
    <header className="fixed top-0 left-0 w-full flex justify-between items-center h-16 px-6 bg-gradient-to-r from-red-500 to-pink-500 opacity-100 text-white shadow-lg z-50">
      <h1 className="text-2xl font-extrabold tracking-wider">Fraud Detection</h1>

      {/* Search Bar */}
      <div className="relative">
        <input type="text" placeholder="Search..." className="px-4 py-2 rounded-lg w-64 bg-white text-black" />
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex gap-6 items-center">
        <Link to="/" className="hover:text-gray-300 transition">Home</Link>
        <Link to="/transactions" className="hover:text-gray-300 transition"><FaFileAlt className="inline mr-2" />Transactions</Link>
        <Link to="/review-team" className="hover:text-gray-300 transition"><FaUserShield className="inline mr-2" />Review Team</Link>
        <Link to="/reports" className="hover:text-gray-300 transition"><FaChartBar className="inline mr-2" />Reports</Link>
      </nav>

      {/* Profile Dropdown */}
      <div className="relative">
        <button onClick={() => setProfileDropdown(!profileDropdown)}>
          <img src={userInfo.avatar || "default-avatar.png"} alt="Profile" className="h-8 w-8 rounded-full" />
        </button>
        {profileDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-white text-black shadow-md rounded-lg">
            <div className="p-3 border-b border-gray-300">{userInfo.fullname}</div>
            <Link to="/settings" className="block px-4 py-2 hover:bg-gray-200"><FaCog className="inline mr-2" />Settings</Link>
            <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-200">
              <FaSignOutAlt className="inline mr-2" />Logout
            </button>
          </div>
        )}
      </div>

      {/* Mobile Navigation Button */}
      <button className="md:hidden text-2xl" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>

      {/* Mobile Navigation Menu */}
      <nav className={`fixed top-0 left-0 w-full h-screen bg-gradient-to-r from-red-400 to-pink-400 bg-opacity-80 backdrop-blur-md flex flex-col items-center justify-center transition-transform duration-500 ${isOpen ? "translate-x-0" : "-translate-x-full"} z-40`}>
        <button className="absolute top-6 right-6 text-2xl" onClick={() => setIsOpen(false)}>
          <FaTimes />
        </button>
        <Link to="/" className="py-3" onClick={() => setIsOpen(false)}>Home</Link>
        <Link to="/transactions" className="py-3" onClick={() => setIsOpen(false)}>Transactions</Link>
        <Link to="/review-team" className="py-3" onClick={() => setIsOpen(false)}>Review Team</Link>
        <Link to="/reports" className="py-3" onClick={() => setIsOpen(false)}>Reports</Link>
        <button onClick={handleLogout} className="mt-6 py-3 flex items-center gap-2">
          <FaSignOutAlt /> Logout
        </button>
      </nav>

      {/* Logging Out Animation */}
      {loggingOut && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="text-white text-2xl animate-pulse">Logging Out...</div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
