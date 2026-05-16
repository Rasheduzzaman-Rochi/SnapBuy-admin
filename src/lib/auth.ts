// Test credentials for demo
export const TEST_CREDENTIALS = {
  admin: {
    email: 'admin@snapbuy.com',
    password: 'admin123',
    role: 'admin',
    name: 'Admin User'
  },
  seller: {
    email: 'seller@snapbuy.com',
    password: 'seller123',
    role: 'seller',
    name: 'Seller User'
  }
};

export const validateLogin = (email: string, password: string) => {
  // Check admin credentials
  if (email === TEST_CREDENTIALS.admin.email && password === TEST_CREDENTIALS.admin.password) {
    return {
      success: true,
      user: TEST_CREDENTIALS.admin
    };
  }
  
  // Check seller credentials
  if (email === TEST_CREDENTIALS.seller.email && password === TEST_CREDENTIALS.seller.password) {
    return {
      success: true,
      user: TEST_CREDENTIALS.seller
    };
  }
  
  return {
    success: false,
    error: 'Invalid email or password'
  };
};
