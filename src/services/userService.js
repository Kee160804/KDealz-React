// services/userService.js

// Demo users
export const demoUsers = [
  { id: '1', name: 'John Smith', email: 'john.smith@email.com', orders: 8, totalSpent: 425.95, joinDate: '2024-01-15', role: 'customer' },
  { id: '2', name: 'Maria Garcia', email: 'maria.g@email.com', orders: 12, totalSpent: 789.97, joinDate: '2024-02-20', role: 'customer' },
  { id: '3', name: 'David Lee', email: 'david.lee@email.com', orders: 5, totalSpent: 287.98, joinDate: '2024-03-10', role: 'customer' },
  { id: '4', name: 'Sarah Johnson', email: 'sarah.j@email.com', orders: 15, totalSpent: 1245.50, joinDate: '2024-01-05', role: 'customer' },
  { id: '5', name: 'Michael Brown', email: 'michael.b@email.com', orders: 3, totalSpent: 156.75, joinDate: '2024-04-22', role: 'customer' },
  { id: '6', name: 'Admin User', email: 'admin@karibbean.com', role: 'admin', orders: 0, totalSpent: 0, joinDate: '2024-01-01' }
];

// Initialize users
export const initializeUsers = () => {
  const storedUsers = localStorage.getItem('users');
  if (!storedUsers || storedUsers === '[]') {
    localStorage.setItem('users', JSON.stringify(demoUsers));
    return demoUsers;
  }
  return JSON.parse(storedUsers);
};

// Get all users
export const getAllUsers = () => {
  return initializeUsers();
};

// Get user by ID
export const getUserById = (id) => {
  const users = getAllUsers();
  return users.find(u => u.id === id);
};

// Add new user
export const addUser = (user) => {
  const users = getAllUsers();
  const newUser = {
    ...user,
    id: String(users.length + 1),
    joinDate: new Date().toISOString().split('T')[0],
    orders: 0,
    totalSpent: 0
  };
  const updatedUsers = [...users, newUser];
  localStorage.setItem('users', JSON.stringify(updatedUsers));
  return newUser;
};