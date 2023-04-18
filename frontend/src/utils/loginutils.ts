import axios from "axios";
import { useUserStore } from "../stores/UserStore";
import router from "../router";

// NOTES: should password be string?

/**
 * Function for logging in a user.
 * @param username - The username of the user.
 * @param password - The password of the user.
 * @returns Promise<void> - A Promise that resolves to void.
 */
export async function login(username: string, password: string): Promise<void> {
  const userStore = useUserStore();

  try {
    const response = await axios.post("http://localhost:3333/token", {
      username: username,
      password: password,
    });

    userStore.token = response.data;

    await axios.get("http://localhost:3333/", {
      headers: {
        Authorization: `Bearer ${userStore.token}`,
      },
    });
  } catch (error) {
    // Handle error
    console.error(error);
  }
}

/**
 * Function for creating a user.
 * @param username - The username of the user.
 * @param password - The password of the user.
 * @returns Promise<void> - A Promise that resolves to void.
 */
export async function createuser(
  username: string,
  password: string
): Promise<void> {
  try {
    const response = await axios.post("http://localhost:3333/login", {
      username: username,
      password: password,
    });

    router.push("/");
  } catch (error) {
    // Handle error
    console.error(error);
  }
}
