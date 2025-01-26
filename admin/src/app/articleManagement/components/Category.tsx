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
        { value: "การดูแลสุขภาพ", label: "การดูแลสุขภาพv" },
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
                className="bg-zinc-950 text-white font-medium px-3 py-2 border rounded-3xl w-fit min-w-16 h-10 flex justify-center items-center hover:shadow hover:bg-zinc-800"
            >
                <>
                    <p className="md:hidden text-xs">Category</p>
                    <p className="hidden text-base md:inline">Select a category</p>
                </>
            </button>

            {isOpen && (
                <ul className="absolute mt-14 bg-white z-10">
                    {categories.map((category) => (
                        <li
                            key={category.value}
                            onClick={() => handleSelect(category.value)}
                            className={`px-5 py-2 border border-zinc-200 text-base hover:bg-zinc-200 hover:font-medium cursor-pointer ${selectedCategory === category.value ? 'bg-zinc-200' : ''}`}
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