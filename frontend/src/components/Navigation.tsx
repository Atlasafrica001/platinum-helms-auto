import { Menu, X, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logoImage from "../assets/logo.png";

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { id: "/", label: "Home" },
    { id: "/purchase", label: "Purchase" },
    { id: "/importation", label: "Importation" },
    { id: "/financing", label: "Financing" },
    { id: "/about", label: "About Us" },
    { id: "/contact", label: "Contact" },
  ];

  const handleLogoClick = () => {
    const newCount = logoClickCount + 1;
    setLogoClickCount(newCount);
    if (newCount >= 5) {
      navigate("/admin");
      setLogoClickCount(0);
    } else {
      navigate("/");
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 backdrop-blur-md bg-white/5 rounded-2xl border border-white/10">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button
            onClick={handleLogoClick}
            className="flex items-center"
          >
            <img 
              src={logoImage} 
              alt="Platinum Helms" 
              className="h-24 w-auto object-contain"
            />
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.id}
                className={`text-sm tracking-wider transition-colors ${
                  isActive(item.id)
                    ? "text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/coming-soon"
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm tracking-wider transition-all flex items-center gap-2 animate-pulse hover:animate-none"
            >
              <Sparkles size={14} />
              Coming Soon
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.id}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block w-full text-left px-4 py-2 text-sm tracking-wider transition-colors ${
                  isActive(item.id)
                    ? "text-white bg-white/10"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/coming-soon"
              onClick={() => setIsMobileMenuOpen(false)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm tracking-wider transition-all flex items-center gap-2 mx-4 justify-center animate-pulse hover:animate-none"
            >
              <Sparkles size={14} />
              Coming Soon
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
