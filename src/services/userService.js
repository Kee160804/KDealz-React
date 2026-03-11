// services/userService.js

// ============================================================================
// ADMIN EMAIL CONFIGURATION
// ============================================================================
// NEW CODE: Admin emails list - easily expandable for multiple admins
// Add new admin emails to this array as needed
// UPDATED: Using correct Supabase email - stored in lowercase for proper matching
// NOTE: isAuthorizedAdmin() converts emails to lowercase before checking
export const AUTHORIZED_ADMIN_EMAILS = [
  "mclaughlinkyan04@gmail.com", // Primary admin email from Supabase (lowercase for case-insensitive matching)
  // Add more admin emails here as needed, e.g.: 'admin2@example.com'
];

// ============================================================================
// OLD CODE (COMMENTED OUT): CUSTOMER/USER MANAGEMENT
// ============================================================================
// NOT NEEDED: This is an open ordering system e-commerce website with NO user accounts
// Users simply log on to place orders without creating accounts
// Only 1-3 Admin accounts are needed for business owners to access the admin dashboard
/*
// OLD CODE: Previously used mock admin user 'admin@karibbean.com'
// export const demoUsers = [
//   { id: '1', name: 'John Smith', email: 'john.smith@email.com', orders: 8, totalSpent: 425.95, joinDate: '2024-01-15', role: 'customer' },
//   { id: '2', name: 'Maria Garcia', email: 'maria.g@email.com', orders: 12, totalSpent: 789.97, joinDate: '2024-02-20', role: 'customer' },
//   { id: '3', name: 'David Lee', email: 'david.lee@email.com', orders: 5, totalSpent: 287.98, joinDate: '2024-03-10', role: 'customer' },
//   { id: '4', name: 'Sarah Johnson', email: 'sarah.j@email.com', orders: 15, totalSpent: 1245.50, joinDate: '2024-01-05', role: 'customer' },
//   { id: '5', name: 'Michael Brown', email: 'michael.b@email.com', orders: 3, totalSpent: 156.75, joinDate: '2024-04-22', role: 'customer' },
//   { id: '6', name: 'Admin User', email: 'admin@karibbean.com', role: 'admin', orders: 0, totalSpent: 0, joinDate: '2024-01-01' }
// ];

// export const initializeUsers = () => {
//   const storedUsers = localStorage.getItem('users');
//   if (!storedUsers || storedUsers === '[]') {
//     localStorage.setItem('users', JSON.stringify(demoUsers));
//     return demoUsers;
//   }
//   return JSON.parse(storedUsers);
// };

// export const getAllUsers = () => {
//   return initializeUsers();
// };

// export const getUserById = (id) => {
//   const users = getAllUsers();
//   return users.find(u => u.id === id);
// };

// export const addUser = (user) => {
//   const users = getAllUsers();
//   const newUser = {
//     ...user,
//     id: String(users.length + 1),
//     joinDate: new Date().toISOString().split('T')[0],
//     orders: 0,
//     totalSpent: 0
//   };
//   const updatedUsers = [...users, newUser];
//   localStorage.setItem('users', JSON.stringify(updatedUsers));
//   return newUser;
// };
*/

// ============================================================================
// NEW CODE: SUPABASE AUTHENTICATION FUNCTIONS FOR ADMIN ACCESS
// ============================================================================
// These functions handle real-time authentication with Supabase
// instead of using hardcoded mock admin credentials

import { supabase } from "../lib/supabase/client";

/**
 * NEW CODE: Check if an email is authorized as an admin
 * @param {string} email - The email to check
 * @returns {boolean} - True if email is in AUTHORIZED_ADMIN_EMAILS
 */
export const isAuthorizedAdmin = (email) => {
  if (!email) return false;
  return AUTHORIZED_ADMIN_EMAILS.includes(email.toLowerCase());
};

/**
 * NEW CODE: Get the current authenticated user from Supabase
 * @returns {Promise<Object|null>} - Returns user object if authenticated, null otherwise
 */
export const getCurrentSupabaseUser = async () => {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) {
      console.error("Error fetching current user:", error.message);
      return null;
    }
    return user;
  } catch (error) {
    console.error("Error in getCurrentSupabaseUser:", error);
    return null;
  }
};

/**
 * NEW CODE: Check if the current authenticated user is an admin
 * @returns {Promise<boolean>} - True if current user is authorized admin
 */
export const isCurrentUserAdmin = async () => {
  try {
    const user = await getCurrentSupabaseUser();
    if (!user || !user.email) return false;
    return isAuthorizedAdmin(user.email);
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};

/**
 * NEW CODE: Sign in admin with email and password (via Supabase)
 * @param {string} email - Admin email
 * @param {string} password - Admin password
 * @returns {Promise<Object>} - Returns { success: boolean, user: Object|null, error: string|null }
 */
export const signInAdmin = async (email, password) => {
  try {
    // DEBUG: Log what we're checking
    console.log("🔐 Admin Login Attempt:");
    console.log("  Email entered:", email);
    console.log("  Email lowercased:", email.toLowerCase());
    console.log("  Authorized emails:", AUTHORIZED_ADMIN_EMAILS);
    
    // First check if email is authorized as admin
    if (!isAuthorizedAdmin(email)) {
      console.log("❌ Email not in authorized list");
      return {
        success: false,
        user: null,
        error: "This email is not authorized for admin access.",
      };
    }

    console.log("✅ Email authorized, attempting Supabase login...");
    // Attempt Supabase authentication
    const {
      data: { user },
      error,
    } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log("❌ Supabase login failed:", error.message);
      return {
        success: false,
        user: null,
        error: error.message || "Invalid credentials",
      };
    }

    if (!user) {
      console.log("❌ No user returned from Supabase");
      return {
        success: false,
        user: null,
        error: "Login failed - no user data returned",
      };
    }

    console.log("✅ Supabase login successful for:", user.email);
    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: "admin",
      },
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      user: null,
      error: error.message || "An error occurred during sign in",
    };
  }
};

/**
 * NEW CODE: Sign out the current admin user
 * @returns {Promise<Object>} - Returns { success: boolean, error: string|null }
 */
export const signOutAdmin = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }
    return {
      success: true,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "An error occurred during sign out",
    };
  }
};

/**
 * NEW CODE: Monitor authentication state changes in real-time
 * This is useful for updating your app when user logs in/out
 * @param {Function} callback - Function to call when auth state changes
 * @returns {Function} - Unsubscribe function to stop listening
 */
export const onAuthStateChange = (callback) => {
  try {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      const user = session?.user || null;
      const isAdmin = user ? isAuthorizedAdmin(user.email) : false;

      callback({
        event,
        user: user
          ? {
              id: user.id,
              email: user.email,
              role: isAdmin ? "admin" : "customer",
            }
          : null,
        isAuthenticated: !!user,
        isAdmin,
      });
    });

    // Return unsubscribe function
    return () => {
      subscription?.unsubscribe();
    };
  } catch (error) {
    console.error("Error setting up auth state listener:", error);
    return () => {}; // Return no-op function on error
  }
};
