export const calculateBMI = (weight: number, height: number): number => {
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
  };
  
  export const getBMICategory = (bmi: number): { text: string; color: string } => {
    if (bmi < 18.5) {
      return { text: "ผอม", color: "#FFD444" }; // underweight (yellow)
    } else if (bmi >= 18.5 && bmi < 25) {
      return { text: "สมส่วน", color: "#2ED74D" }; // normal (green)
    } else if (bmi >= 25 && bmi < 30) {
      return { text: "น้ำหนักเกิน", color: "#FFA500" }; // overweight (orange)
    } else {
      return { text: "อ้วน", color: "#FE5757" }; // obese (red)
    }
  };