"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../../contexts/authContext";
import AuthModal from "../auth/AuthModal";
import {
  FaHome,
  FaCompass,
  FaVideo,
  FaUsers,
  FaPlusCircle,
  FaSignOutAlt,
  FaUser,
  FaUserPlus,
} from "react-icons/fa";

const MainLayout = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  // Protected route check - redirect to login if trying to access protected routes
  const isProtectedRoute = pathname === '/upload' || pathname === '/following';
  
  if (isProtectedRoute && !isAuthenticated) {
    return (
      <div className="ml-64 flex-1 p-8">
        <div className="text-center py-10">
          <p className="text-gray-500 mb-4">Please log in to access this page</p>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 flex h-full w-64 flex-col border-r bg-white p-4 shadow-sm">
        <div className="mb-8">
          <Link href="/" className="text-2xl font-bold text-blue-500">
            TikTok
          </Link>
        </div>

        <nav className="flex-1">
          <ul className="space-y-2">
            <li>
              <Link
                href="/"
                className={`flex items-center rounded-lg p-3 transition-colors ${
                  pathname === "/"
                    ? "bg-blue-50 text-blue-500"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <FaHome className="mr-3 text-lg" /> For You
              </Link>
            </li>
            <li>
              <Link
                href="/following"
                className={`flex items-center rounded-lg p-3 transition-colors ${
                  pathname === "/following"
                    ? "bg-blue-50 text-blue-500"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <FaUsers className="mr-3 text-lg" /> Following
              </Link>
            </li>
            <li>
              <Link
                href="/explore-users"
                className={`flex items-center rounded-lg p-3 transition-colors ${
                  pathname === "/explore-users"
                    ? "bg-blue-50 text-blue-500"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <FaUserPlus className="mr-3 text-lg" /> Find Users
              </Link>
            </li>
            <li>
              <Link
                href="/explore"
                className={`flex items-center rounded-lg p-3 transition-colors ${
                  pathname === "/explore"
                    ? "bg-blue-50 text-blue-500"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <FaCompass className="mr-3 text-lg" /> Explore
              </Link>
            </li>
            <li>
              <Link
                href="/live"
                className={`flex items-center rounded-lg p-3 transition-colors ${
                  pathname === "/live"
                    ? "bg-blue-50 text-blue-500"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <FaVideo className="mr-3 text-lg" /> LIVE
              </Link>
            </li>
          </ul>
        </nav>

        <div className="mt-auto space-y-2 pt-4 border-t">
          {isAuthenticated ? (
            <>
              <Link
                href="/upload"
                className="flex w-full items-center justify-center rounded-full bg-blue-500 p-3 text-white transition-colors hover:bg-blue-600"
              >
                <FaPlusCircle className="mr-2" /> Upload
              </Link>
              <Link
                href={`/profile/${user?.id}`}
                className="flex items-center rounded-lg p-3 text-gray-700 transition-colors hover:bg-gray-50"
              >
                <FaUser className="mr-3 text-lg" /> Profile
              </Link>
              <button
                onClick={handleLogout}
                className="flex w-full items-center rounded-lg p-3 text-gray-700 transition-colors hover:bg-gray-50"
              >
                <FaSignOutAlt className="mr-3 text-lg" /> Logout
              </button>
              <div className="mt-4 text-sm text-gray-500 px-3">
                @{user?.username || user?.email?.split('@')[0]}
              </div>
            </>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex w-full items-center justify-center rounded-full bg-blue-500 p-3 text-white transition-colors hover:bg-blue-600"
            >
              Log in / Sign up
            </button>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="ml-64 flex-1">
        <div className="container mx-auto max-w-2xl px-4 py-8">
          {children}
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};

export default MainLayout;