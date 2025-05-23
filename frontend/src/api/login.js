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

const verify = async (authCode) => {
    if (!authCode) {
        return { success: false, message: "Please fill in all fields." };
    }
    const res = await fetch(url + "teacher/verify/" + authCode, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const data = await res.json();
    if (!data.success) {
        return { success: false, message: data.message };
    }
    return { success: true, message: "Verification successful" };
}

const getTeacherData = async (authCode) => {
    if (!authCode) {
        return { success: false, message: "Please fill in all fields." };
    }
    const res = await fetch(url + "teacher/" + authCode, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const data = await res.json();
    if (!data.success) {
        return { success: false, message: data.message };
    }
    return { success: true, message: "Verification successful", data: data.data };
}

export { signup, signin, verify, getTeacherData };