import React from "react";

export function Hero() {
  return (
    <section className="hero">
      <button className="btn-primary" onClick={() => scrollToSection("courses")}>
        კურსები
      </button>
    </section>
  );
}

function scrollToSection(id: string) {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
}
