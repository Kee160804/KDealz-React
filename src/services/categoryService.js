// services/categoryService.js
import { supabase } from "../lib/supabase/client";

/**
 * Get all categories
 * @returns {Promise<Array>} - Array of all categories
 */
export const getAllCategories = async () => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("id, name")
      .order("name", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

/**
 * Get all subcategories
 * @returns {Promise<Array>} - Array of all subcategories
 */
export const getAllSubcategories = async () => {
  try {
    const { data, error } = await supabase
      .from("subcategories")
      .select("id, name, category_id")
      .order("name", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    return [];
  }
};

/**
 * Get subcategories by category ID
 * @param {number} categoryId - The category ID
 * @returns {Promise<Array>} - Array of subcategories for that category
 */
export const getSubcategoriesByCategoryId = async (categoryId) => {
  try {
    const { data, error } = await supabase
      .from("subcategories")
      .select("id, name")
      .eq("category_id", categoryId)
      .order("name", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    return [];
  }
};
