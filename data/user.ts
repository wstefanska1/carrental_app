// Define the 'type' or 'shape' of a single user object.
export interface User {
  email: string;
  name: string;
  surname: string;
  dateOfBirth: string;
  cpr: string;
}

// fetch from backend
export const getUser = async (email: string): Promise<User | null> => {
  try {
    const response = await fetch(`http://10.0.2.2:5000/userprofile?username=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();

    const user: User = {
      email: data.email,
      name: data.name,
      surname: data.surname,
      dateOfBirth: data.dateOfBirth,
      cpr: data.cpr,
    };

    return user;
  } catch (err) {
    console.error("Error downloading user data:", err);
    return null;
  }
};
