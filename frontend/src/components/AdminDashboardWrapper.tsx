import { ReactNode, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { AdminDashboard } from "./AdminDashboard";
import { Button } from "./button";
import { Avatar, AvatarFallback } from "./avatar";
import { Car, FileText, LayoutDashboard, LogOut, MessageSquare, Settings, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog";

interface AdminDashboardWrapperProps {
  children?: ReactNode;
}

const adminNavigation = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { label: "Inventory", path: "/admin/vehicles", icon: Car },
  { label: "Finance Apps", path: "/admin/finance-applications", icon: FileText },
  { label: "Leads", path: "/admin/contact-leads", icon: MessageSquare },
  { label: "Settings", path: "/admin/settings", icon: Settings },
];

const AdminDashboardWrapper = ({ children }: AdminDashboardWrapperProps) => {
  const { user, logout, refreshUser } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    refreshUser();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/home");
    } catch {
      // swallow logout errors
    }
  };

  const getUserInitials = () => {
    if (!user) return "A";
    return `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-obsidian shadow-sm">
        <div className="mx-auto flex max-w-screen-2xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-brand">
              <Car size={16} className="text-white" />
            </div>
            <span className="font-display text-base font-bold text-white">
              Platinum Helms
              <span className="ml-2 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-normal uppercase tracking-widest text-white/50">
                Admin
              </span>
            </span>
          </div>

          {/* Nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            {adminNavigation.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/admin"}
                  className={({ isActive }) =>
                    `inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-brand text-white"
                        : "text-white/60 hover:bg-white/10 hover:text-white"
                    }`
                  }
                >
                  <Icon size={15} />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          {/* Mobile nav */}
          <nav className="flex items-center gap-1 lg:hidden">
            {adminNavigation.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/admin"}
                  className={({ isActive }) =>
                    `flex size-9 items-center justify-center rounded-lg transition-colors ${
                      isActive
                        ? "bg-brand text-white"
                        : "text-white/50 hover:bg-white/10 hover:text-white"
                    }`
                  }
                  title={item.label}
                >
                  <Icon size={16} />
                </NavLink>
              );
            })}
          </nav>

          {/* User menu + Logout */}
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-9 gap-2 rounded-lg px-2 text-white/70 hover:bg-white/10 hover:text-white">
                  <Avatar className="size-7">
                    <AvatarFallback className="bg-brand text-xs font-semibold text-white">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden text-sm md:block">
                    {user?.firstName}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-0.5">
                    <p className="text-sm font-medium">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/admin/settings")}>
                  <User size={14} className="mr-2" />
                  Profile Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Visible logout button */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 gap-1.5 rounded-lg border border-white/10 px-3 text-white/60 hover:border-brand/40 hover:bg-brand/10 hover:text-brand"
                >
                  <LogOut size={14} />
                  <span className="hidden text-sm sm:block">Logout</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Log out of admin dashboard?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You will be signed out and returned to the homepage.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleLogout}
                    className="bg-brand text-white hover:bg-brand-strong"
                  >
                    Logout
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </header>

      <main>{children || <AdminDashboard />}</main>
    </div>
  );
};

export default AdminDashboardWrapper;
