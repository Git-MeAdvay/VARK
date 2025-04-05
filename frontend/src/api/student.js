const url = import.meta.env.VITE_API_URL || "http://localhost:5000/";

const endpoint = "student";

const createStudent = async (newResponse) => {
    if (!newResponse.name || !newResponse.auth || !newResponse.Id || !newResponse.testData || !newResponse.testResult) {
        return { success: false, message: "Please fill in all fields." };
    }
    const res = await fetch(url+endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newResponse),
    });
    const data = await res.json();
    if (!data.success) {
        return { success: false, message: data.message };
    }
    return { success: true, message: "Data saved successfully" };
}

export { createStudent };