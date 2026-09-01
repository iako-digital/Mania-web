import React from "react";

export default function CoursesPage() {
  const categories = [
    {
      title: "ვიდეო ჩანაწერების კურსები",
      description: "Explore our video recorded courses for self-paced learning.",
    },
    {
      title: "AI მასწავლებელი",
      description: "Learn with the help of an AI mentor for personalized guidance.",
    },
    {
      title: "საბავშვო ტანსაცმლის ჭრა-კერვის კურსი დედებისა და მკერავებისთვის",
      description:
        "Learn to craft children's clothing with tailored sizing, step-by-step video lessons, eco-friendly fabric choices, and AI-guided pattern construction.",
    },
  ];

  return (
    <div className="courses-page">
      {categories.map((category, index) => (
        <div key={index} className="course-category">
          <h2>{category.title}</h2>
          <p>{category.description}</p>
          <button className="btn-primary">Explore {category.title}</button>
        </div>
      ))}
    </div>
  );
}
