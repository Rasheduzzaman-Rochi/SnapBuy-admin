// Mock authentication and role management
// This will be replaced with Firebase Auth + Firestore later

export type UserRole = "admin" | "seller";

export interface MockAdminUser {
  uid: string;
  name: string;
  email: string;
  role: "admin";
  joinedAt: string;
  avatar?: string;
}

export interface MockSellerUser {
  uid: string;
  ownerName: string;
  email: string;
  phone: string;
  role: "seller";
  shopName: string;
  shopAddress: string;
  category: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  avatar?: string;
}

export type MockUser = MockAdminUser | MockSellerUser;

// Mock users
export const mockAdminUser: MockAdminUser = {
  uid: "admin_001",
  name: "Rashed Admin",
  email: "admin@snapbuy.com",
  role: "admin",
  joinedAt: "2026-01-10",
  avatar: "RA",
};

export const mockSellerUser: MockSellerUser = {
  uid: "seller_001",
  ownerName: "SnapBuy Seller",
  email: "seller@snapbuy.com",
  phone: "+8801700000000",
  role: "seller",
  shopName: "SnapBuy Store",
  shopAddress: "Dhaka, Bangladesh",
  category: "Electronics",
  status: "approved",
  createdAt: "2026-01-12",
  avatar: "SS",
};

// Get current mock role from localStorage (fallback to admin)
export function getCurrentMockRole(): UserRole {
  if (typeof window === "undefined") return "admin";
  const role = localStorage.getItem("snapbuy_mock_role");
  return (role as UserRole) || "admin";
}

// Get current mock user based on role
export function getCurrentMockUser(): MockAdminUser | MockSellerUser {
  const role = getCurrentMockRole();
  return role === "admin" ? mockAdminUser : mockSellerUser;
}

// Check if current user is admin
export function isAdmin(): boolean {
  return getCurrentMockRole() === "admin";
}

// Check if current user is seller
export function isSeller(): boolean {
  return getCurrentMockRole() === "seller";
}

// Set mock role (for testing)
export function setMockRole(role: UserRole): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("snapbuy_mock_role", role);
  }
}

// Check if user can access a page based on role
export function canAccessPage(pathname: string): boolean {
  const role = getCurrentMockRole();

  // Admin has access to all pages
  if (role === "admin") return true;

  // Seller access restrictions
  const sellerOnlyPages = [
    "/dashboard",
    "/products",
    "/products/add",
    "/orders",
    "/settings",
  ];

  // Check if pathname starts with any seller-allowed page
  return sellerOnlyPages.some((page) => {
    if (page === "/products/add" || page === "/orders") {
      return pathname === page || pathname.startsWith(page + "/");
    }
    return pathname === page || pathname.startsWith(page + "/");
  });
}

// Get sidebar navigation items based on role
export function getSidebarItems(role: UserRole) {
  const adminItems = [
    { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
    { label: "Seller Applications", href: "/sellers", icon: "Users" },
    { label: "Products", href: "/products", icon: "Package" },
    { label: "Orders", href: "/orders", icon: "ShoppingCart" },
    { label: "Users", href: "/users", icon: "Users" },
    { label: "Settings", href: "/settings", icon: "Settings" },
  ];

  const sellerItems = [
    { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
    { label: "My Products", href: "/products", icon: "Package" },
    { label: "Add Product", href: "/products/add", icon: "Plus" },
    { label: "My Orders", href: "/orders", icon: "ShoppingCart" },
    { label: "Settings", href: "/settings", icon: "Settings" },
  ];

  return role === "admin" ? adminItems : sellerItems;
}

// Get role badge text
export function getRoleBadgeText(role: UserRole): string {
  return role === "admin" ? "Admin Panel" : "Seller Dashboard";
}

// Get role badge color
export function getRoleBadgeColor(role: UserRole): string {
  return role === "admin" ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700";
}
