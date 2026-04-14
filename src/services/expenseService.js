// services/expenseService.js
import { getAllProducts } from './productService';

// Generate demo expenses from products
export const generateDemoExpenses = (products) => {
  if (!products || products.length === 0) return [];
  
  return products.map(p => ({
    id: `EXP-${p.id}`,
    type: 'product_purchase',
    description: `Initial stock: ${p.name} (${p.stock} units × $${(p.cost || p.price * 0.6).toFixed(2)})`,
    amount: (p.cost || p.price * 0.6) * p.stock,
    date: new Date().toISOString().split('T')[0],
    productId: p.id
  }));
};

// Initialize expenses
export const initializeExpenses = async () => {
  const storedExpenses = localStorage.getItem('expenses');
  const products = await getAllProducts();
  if (!storedExpenses) {
    const expenses = generateDemoExpenses(products);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    return expenses;
  }
  
  try {
    return JSON.parse(storedExpenses);
  } catch (e) {
    const expenses = generateDemoExpenses(products);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    return expenses;
  }
};

// Get all expenses
export const getAllExpenses = () => {
  return initializeExpenses();
};

// Add expense
export const addExpense = (expense) => {
  const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
  const newExpense = {
    ...expense,
    id: `EXP-${Date.now()}`,
    date: new Date().toISOString().split('T')[0]
  };
  const updatedExpenses = [...expenses, newExpense];
  localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
  return newExpense;
};