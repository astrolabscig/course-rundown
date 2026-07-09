export type VariableCategory = "nominal" | "ordinal" | "discrete" | "continuous";

export interface ClassificationItem {
  id: string;
  label: string;
  category: VariableCategory;
}

// The exact 31-item list from Class Activity 1 ("Assignment 1"), classified
// using the room's own definitions (qualitative: nominal has no order,
// ordinal has a natural rank; quantitative: discrete is countable, continuous
// allows a value between any two values).
export const variableClassificationBank: ClassificationItem[] = [
  { id: "v1", label: "Educational level (elementary school, high school, college, postgraduate)", category: "ordinal" },
  { id: "v2", label: "Customer satisfaction ratings (very satisfied ... very dissatisfied)", category: "ordinal" },
  { id: "v3", label: "Economic status (low income, middle income, high income)", category: "ordinal" },
  { id: "v4", label: "Star ratings for a product (1-star ... 5-star)", category: "ordinal" },
  { id: "v5", label: "Likert scale responses (strongly agree ... strongly disagree)", category: "ordinal" },
  { id: "v6", label: "Pain intensity levels (mild, moderate, severe)", category: "ordinal" },
  { id: "v7", label: "Gender (male, female, other)", category: "nominal" },
  { id: "v8", label: "Marital status (single, married, divorced)", category: "nominal" },
  { id: "v9", label: "Eye color (blue, brown, green, etc.)", category: "nominal" },
  { id: "v10", label: "Types of cars (SUV, sedan, truck)", category: "nominal" },
  { id: "v11", label: "Types of fruits (apple, banana, orange)", category: "nominal" },
  { id: "v12", label: "Blood type (A, B, AB, O)", category: "nominal" },
  { id: "v13", label: "Hair color (blonde, brown, black, etc.)", category: "nominal" },
  { id: "v14", label: "Number of siblings", category: "discrete" },
  { id: "v15", label: "Number of cars in a parking lot", category: "discrete" },
  { id: "v16", label: "Height of a person", category: "continuous" },
  { id: "v17", label: "Weight of an object", category: "continuous" },
  { id: "v18", label: "Temperature", category: "continuous" },
  { id: "v19", label: "Time taken to complete a race", category: "continuous" },
  { id: "v20", label: "Distance traveled by a car", category: "continuous" },
  { id: "v21", label: "Blood pressure", category: "continuous" },
  { id: "v22", label: "Wind speed", category: "continuous" },
  { id: "v23", label: "The volume of liquid in a container", category: "continuous" },
  { id: "v24", label: "Number of pets in a household", category: "discrete" },
  { id: "v25", label: "Number of students in a classroom", category: "discrete" },
  { id: "v26", label: "Clothing sizes (small, medium, large, extra-large)", category: "ordinal" },
  { id: "v27", label: "Political affiliation (Democrat, Republican, Independent)", category: "nominal" },
  { id: "v28", label: "Types of pets (dog, cat, bird, fish)", category: "nominal" },
  { id: "v29", label: "Educational grades (A, B, C, D, F)", category: "ordinal" },
  { id: "v30", label: "Job positions (entry-level, mid-level, senior)", category: "ordinal" },
  { id: "v31", label: "Service quality ratings (poor, fair, good, very good, excellent)", category: "ordinal" },
];
