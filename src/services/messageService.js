// services/messageService.js
import { supabase } from "../lib/supabase/client";

/**
 * Save customer message to database
 * @param {Object} messageData - Message information from contact form
 * @returns {Promise<Object>} - Saved message with ID
 */
export const saveMessage = async (messageData) => {
  try {
    if (!messageData.customerName || !messageData.customerEmail || !messageData.customerPhone || !messageData.subject || !messageData.notes) {
      throw new Error("Missing required message fields.");
    }

    const messagePayload = {
      customer_name: messageData.customerName.trim(),
      customer_phone: messageData.customerPhone.trim(),
      customer_email: messageData.customerEmail.trim().toLowerCase(),
      subject: messageData.subject.trim(),
      notes: messageData.notes.trim(),
    };

    const { data, error } = await supabase
      .from("send_message")
      .insert([messagePayload])
      .select();

    if (error) throw error;

    console.log("Message saved successfully:", data);
    return data[0] || { success: true };
  } catch (error) {
    console.error("Error saving message:", error);
    throw error;
  }
};

/**
 * Get all customer messages (for admin)
 * @returns {Promise<Array>} - Array of all messages
 */
export const getAllMessages = async () => {
  try {
    const { data, error } = await supabase
      .from("send_message")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

/**
 * Get message by ID
 * @param {number} messageId - The message ID
 * @returns {Promise<Object>} - Message object
 */
export const getMessageById = async (messageId) => {
  try {
    const { data, error } = await supabase
      .from("send_message")
      .select("*")
      .eq("id", messageId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching message:", error);
    throw error;
  }
};

/**
 * Delete message (admin only)
 * @param {number} messageId - The message ID
 * @returns {Promise<Object>} - Deletion result
 */
export const deleteMessage = async (messageId) => {
  try {
    const { error } = await supabase
      .from("send_message")
      .delete()
      .eq("id", messageId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Error deleting message:", error);
    throw error;
  }
};
