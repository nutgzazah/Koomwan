'use client';

import { useState, useEffect, useRef } from "react";

type Category = {
    value: string;
    label: string;
};

type SearchCategoryProps = {
    selectedCategory: string;
    setSelectedCategory: (value: string) => void;
};

const SearchCategory: React.FC<SearchCategoryProps> = ({ selectedCategory, setSelectedCategory }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const categories: Category[] = [
        { value: "การดูแลสุขภาพ", label: "การดูแลสุขภาพ" },
        { value: "ความรู้", label: "ความรู้" },
        { value: "โภชนาการ", label: "โภชนาการ" },
        { value: "การออกกำลังกาย", label: "การออกกำลังกาย" },
        { value: "โรค", label: "โรค" },
        { value: "อื่นๆ", label: "อื่นๆ" },
    ];

    const handleSelect = (value: string) => {
        setSelectedCategory(value);
        setIsOpen(false);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative flex justify-end" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="btn short-btn blue-btn flex items-center justify-center whitespace-nowrap"
            >
                <>
                    <p className="md:hidden">หมวดหมู่</p>
                    <p className="hidden md:block">เลือกหมวดหมู่</p>
                </>
            </button>

            {isOpen && (
                <ul className="absolute mt-16 bg-card z-10">
                    {categories.map((category) => (
                        <li
                            key={category.value}
                            onClick={() => handleSelect(category.value)}
                            className={`px-7 py-2 border border-ourGray text-detail_3 hover:bg-unread cursor-pointer ${selectedCategory === category.value ? 'bg-unread' : ''}`}
                        >
                            {category.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchCategory;