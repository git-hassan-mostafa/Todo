import { User } from "@/components/context";
import { host } from "./constants";

export const saveUserToLocalStorage = (key: string, value: User) => {
    const jsonValue = JSON.stringify(value);
    localStorage.setItem(key, jsonValue);
  };
  
  export const getUserFromLocalStorage = (key: string): User | null => {
    const jsonValue = localStorage.getItem(key);
    return jsonValue ? JSON.parse(jsonValue) : null;
  };

  export const deleteUserFromLocalStorage = (key: string): void => {
    localStorage.removeItem(key);
  };

  // Validate date format (MM/DD/YYYY)
  export const validateDateFormat = (date: string | undefined): boolean => {
    if (!date) return false;

    const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
    return dateRegex.test(date);
  };

  export async function fetchData<T>(url:string, body: T , method:string): Promise<boolean> {
    try {
      const response = await fetch(`${url}`, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          // Add any authentication headers or tokens if required
        },
        body: JSON.stringify(body),
      });
  
      if (!response.ok) {
        console.error(`Error updating Todo: ${response.statusText}`);
        return false;
      }
      return true
    } catch (error) {
      // Handle network or other errors
      console.error(`${error}`);
      return false;
    }
  }
   