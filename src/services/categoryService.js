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

/* NEW CODE - Add a new category to the database
This function allows admins to create new product categories dynamically.
When a new category is added, it's stored in the database and immediately
becomes available for use when creating or categorizing products.

@param {string} categoryName - The name of the new category
@returns {Promise<Object>} - The created category with its ID
@throws {Error} - If the category name is empty or database operation fails
*/
export const addCategory = async (categoryName) => {
  try {
    // Validate that category name is provided and not empty
    if (!categoryName || categoryName.trim().length === 0) {
      throw new Error("Category name cannot be empty");
    }

    // Check if category already exists (case-insensitive)
    const { data: existingCategory, error: checkError } = await supabase
      .from("categories")
      .select("id, name")
      .ilike("name", categoryName.trim())
      .single();

    if (!checkError && existingCategory) {
      throw new Error(`Category "${categoryName}" already exists`);
    }

    // Insert the new category
    const { data, error } = await supabase
      .from("categories")
      .insert([{ name: categoryName.trim() }])
      .select()
      .single();

    if (error) {
      console.error("Error adding category:", error);
      throw new Error(`Failed to add category: ${error.message}`);
    }

    console.log(`✅ New category added: "${data.name}" (ID: ${data.id})`);
    return data;
  } catch (error) {
    console.error("Error in addCategory:", error);
    throw error;
  }
};

/* NEW CODE - Delete a category from the database
This function allows admins to remove categories that are no longer needed.
Once a category is deleted, it will no longer be available for use when
creating or categorizing products.

@param {number} categoryId - The ID of the category to delete
@returns {Promise<void>}
@throws {Error} - If the category doesn't exist or database operation fails
*/
export const deleteCategory = async (categoryId) => {
  try {
    // Validate that category ID is provided
    if (!categoryId) {
      throw new Error("Category ID is required");
    }

    // Delete the category from database
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", categoryId);

    if (error) {
      console.error("Error deleting category:", error);
      throw new Error(`Failed to delete category: ${error.message}`);
    }

    console.log(`✅ Category ${categoryId} deleted successfully`);
  } catch (error) {
    console.error("Error in deleteCategory:", error);
    throw error;
  }
};


