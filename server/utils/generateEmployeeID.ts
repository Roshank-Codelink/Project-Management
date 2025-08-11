import crypto from "crypto";

export const generateEmployeeID = async () => {
  try {
    const randomPart = crypto.randomBytes(3).toString("hex").toUpperCase(); 
    const employeeID = `EMP-${randomPart}`; 
    return employeeID;
  } catch (error: any) {
    console.error("Error generating employee ID:", error.message);
    throw new Error("Failed to generate employee ID. Please try again.");
  }
};
