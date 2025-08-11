"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface AuthMiddlewareProps {
  children: React.ReactNode;
}

export default function AuthMiddleware({ children }: AuthMiddlewareProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (isLoading) return; // Wait for auth context to load

    // Define public paths that don't require authentication
    const publicPaths = ['/', '/signin', '/signup', '/emailverify', '/otpverify', '/newpassword'];
    
    // Check if current path is public
    const isPublicPath = publicPaths.some(publicPath => 
      pathname === publicPath || pathname.startsWith(publicPath + '/')
    );

    if (!isAuthenticated && !isPublicPath) {
      // Not authenticated and trying to access protected route
      router.push('/signin');
      return;
    }

    if (isAuthenticated && (pathname === '/signin' || pathname === '/signup')) {
      // Authenticated and trying to access auth pages
      router.push('/dashboard');
      return;
    }

    // Role-based access control
    if (isAuthenticated && user) {
      const isTeamLeader = user.Role === 'TeamLeader';
      const isManager = user.Role === 'Manager';
      const isEmployee = user.Role === 'Employee';
      
      // TeamLeader specific access
      if (isTeamLeader) {
        // TeamLeaders can access: dashboard, allproject, team, userproflie
        const allowedTeamLeaderPaths = ['/dashboard', '/dashboard/allproject', '/dashboard/team', '/dashboard/userproflie'];
        const isAllowedPath = allowedTeamLeaderPaths.some(path => pathname.startsWith(path));
        
        if (!isAllowedPath && pathname.startsWith('/dashboard')) {
          // Redirect to dashboard if trying to access unauthorized path
          router.push('/dashboard');
          return;
        }
      }
      
      // Manager specific access
      if (isManager) {
        // Managers can access: dashboard, allproject, team, department, userproflie
        const allowedManagerPaths = ['/dashboard', '/dashboard/allproject', '/dashboard/team', '/dashboard/department', '/dashboard/userproflie'];
        const isAllowedPath = allowedManagerPaths.some(path => pathname.startsWith(path));
        
        if (!isAllowedPath && pathname.startsWith('/dashboard')) {
          router.push('/dashboard');
          return;
        }
      }
      
      // Employee specific access
      if (isEmployee) {
        // Employees can access: dashboard, allproject, userproflie
        const allowedEmployeePaths = ['/dashboard', '/dashboard/allproject', '/dashboard/userproflie'];
        const isAllowedPath = allowedEmployeePaths.some(path => pathname.startsWith(path));
        
        if (!isAllowedPath && pathname.startsWith('/dashboard')) {
          router.push('/dashboard');
          return;
        }
      }
    }
  }, [isAuthenticated, isLoading, pathname, router, user]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
