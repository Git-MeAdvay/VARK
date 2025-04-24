const url = import.meta.env.VITE_API_URL || "http://localhost:5000/";
const endpoint = "teacher/";

const updateILSResult = async (newUser) => {
    if(!newUser.ilsData || !newUser.ilsResults) {
        return { success: false, message: "Please fill in all fields." };
    }
    const res = await fetch(url + endpoint, {
        method: "Post",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
    });
    const data = await res.json();
    if (!data.success) {
        return { success: false, message: data.message };
    }
    return { success: true, message: "Data saved successfully" };
}

export { updateILSResult };