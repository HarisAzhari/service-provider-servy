export const registerProvider = async (formData: FormData) => {
    try {
      const response = await fetch('/api/provider/register', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }
  
      return await response.json();
    } catch (error) {
      throw error;
    }
  };
  
  export const loginProvider = async (credentials: { email: string; password: string }) => {
    try {
      const response = await fetch('/api/provider/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }
  
      return await response.json();
    } catch (error) {
      throw error;
    }
  };
  