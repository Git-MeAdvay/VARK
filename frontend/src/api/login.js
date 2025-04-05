const url = import.meta.env.VITE_API_URL || "http://localhost:5000/";
const endpoint = "login";

const signup = async (newUser) => {
    if (!newUser.name || !newUser.email || !newUser.passWord) {
        return { success: false, message: "Please fill in all fields." };
    }
    const res = await fetch(url + endpoint + "/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
    });
    const data = await res.json();
    if (!data.success) {
        return { success: false, message: data.message };
    }
    return { success: true, message: "User registered successfully" };
}

const signin = async (user) => {
    if (!user.email || !user.passWord) {
        return { success: false, message: "Please fill in all fields." };
    }
    const res = await fetch(url + endpoint + "/signin", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
    });
    const data = await res.json();
    if (!data.success) {
        return { success: false, message: data.message };
    }
    return { success: true, message: "Login successful", user: data.user };
}


export { signup, signin };