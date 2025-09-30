// This file contains helper functions for interacting with Firebase Storage.
// It simplifies the process of uploading and deleting files, like user-submitted images.

import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "./firebase";

/**
 * Uploads a file to a specified path in Firebase Storage.
 * 
 * @param {File} file - The file object to upload (e.g., from an <input type="file"> element).
 * @param {string} path - The destination path in Firebase Storage where the file should be stored.
 *                        Example: `uploads/users/${userId}/${file.name}`
 * @returns {Promise<string>} A promise that resolves with the public download URL of the uploaded file.
 */
export async function uploadImage(file: File, path: string): Promise<string> {
  // Create a storage reference with the specified path.
  const storageRef = ref(storage, path);
  
  // 'uploadBytes' uploads the file to the location defined by the storage reference.
  const snapshot = await uploadBytes(storageRef, file);
  
  // After the upload is complete, 'getDownloadURL' retrieves the public URL 
  // which can be stored in Firestore or used in an <img> tag.
  const downloadURL = await getDownloadURL(snapshot.ref);
  
  return downloadURL;
}

/**
 * Deletes a file from Firebase Storage.
 * 
 * @param {string} path - The full path to the file in Firebase Storage that should be deleted.
 * @returns {Promise<void>} A promise that resolves when the file has been successfully deleted.
 */
export async function deleteImage(path: string): Promise<void> {
  // Create a reference to the file to delete.
  const storageRef = ref(storage, path);
  
  // Delete the file.
  await deleteObject(storageRef);
}
