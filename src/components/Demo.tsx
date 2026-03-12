import React from "react";
import { CircleMenu } from "./circle-menu";
import { Home, Projector, DollarSign, BookOpen, FlaskConical, User, Mail } from "lucide-react";

export default function Demo() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      <CircleMenu
        items={[
          { label: "Home", icon: <Home size={16} />, href: "#" },
          { label: "Projects", icon: <Projector size={16} />, href: "#" },
          { label: "Skills", icon: <DollarSign size={16} />, href: "#" },
          { label: "Articles", icon: <BookOpen size={16} />, href: "#" },
          { label: "Lab", icon: <FlaskConical size={16} />, href: "#" },
          { label: "About", icon: <User size={16} />, href: "#" },
          { label: "Contact", icon: <Mail size={16} />, href: "#" },
        ]}
      />
    </div>
  );
}