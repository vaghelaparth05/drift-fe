"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";
import { Menu, X } from "lucide-react";

interface CircleMenuItem {
  label: string;
  icon: React.ReactNode;
  href: string;
}

const ITEM_SIZE = 48;
const CONTAINER_SIZE = 250;
const OPEN_STAGGER = 0.02;
const CLOSE_STAGGER = 0.07;

const pointOnCircle = (index: number, total: number, radius: number, cx = 0, cy = 0) => {
  const theta = (2 * Math.PI * index) / total - Math.PI / 2;
  return {
    x: cx + radius * Math.cos(theta),
    y: cy + radius * Math.sin(theta),
  };
};

interface MenuItemProps {
  item: CircleMenuItem;
  index: number;
  total: number;
  isOpen: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ item, index, total, isOpen }) => {
  const { x, y } = pointOnCircle(index, total, CONTAINER_SIZE / 2);
  const [hover, setHover] = useState(false);

  return (
    <motion.a
      href={item.href}
      className="absolute flex items-center justify-center rounded-full bg-gray-300 hover:bg-gray-400 cursor-pointer"
      animate={{ x: isOpen ? x : 0, y: isOpen ? y : 0, scale: hover ? 1.1 : 1 }}
      transition={{
        delay: isOpen ? index * OPEN_STAGGER : index * CLOSE_STAGGER,
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
      style={{ width: ITEM_SIZE, height: ITEM_SIZE }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {item.icon}
      {hover && (
        <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 text-xs bg-black text-white px-1 rounded">
          {item.label}
        </span>
      )}
    </motion.a>
  );
};

interface MenuTriggerProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const MenuTrigger: React.FC<MenuTriggerProps> = ({ isOpen, setIsOpen }) => {
  return (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className="z-50 flex items-center justify-center w-12 h-12 rounded-full bg-gray-700 text-white hover:bg-gray-600"
    >
      <AnimatePresence mode="popLayout">
        {isOpen ? <X key="close" size={18} /> : <Menu key="open" size={18} />}
      </AnimatePresence>
    </button>
  );
};

interface CircleMenuProps {
  items: CircleMenuItem[];
}

const CircleMenu: React.FC<CircleMenuProps> = ({ items }) => {
  const [isOpen, setIsOpen] = useState(false);
  const animate = useAnimationControls();

  return (
    <div
      style={{ width: CONTAINER_SIZE, height: CONTAINER_SIZE }}
      className="relative flex items-center justify-center"
    >
      <MenuTrigger isOpen={isOpen} setIsOpen={setIsOpen} />
      <motion.div animate={animate} className="absolute inset-0 flex items-center justify-center">
        {items.map((item, idx) => (
          <MenuItem key={idx} item={item} index={idx} total={items.length} isOpen={isOpen} />
        ))}
      </motion.div>
    </div>
  );
};

export { CircleMenu };