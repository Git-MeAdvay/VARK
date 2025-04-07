const url = import.meta.env.VITE_API_URL || "http://localhost:5000/";
const endpoint = "student";

export const fetchStudents = async (students) => {
    if (!students || students.length === 0) {
        return [];
    }

    try {
        const studentsData = await Promise.all(students.map(async (student) => {
            const res = await fetch(url + endpoint + "/" + student, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            
            if (!res.ok) {
                throw new Error(`Failed to fetch student with ID ${student}`);
            }
            
            return await res.json();
        }));
        
        return studentsData;
    } catch (error) {
        console.error("Error fetching students:", error);
        return [];
    }
}