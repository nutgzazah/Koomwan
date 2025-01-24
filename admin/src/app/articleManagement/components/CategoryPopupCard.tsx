import PopupCard from "@/components/PopupCard";

export default function CategoryPopupCard() {
    return (
        <PopupCard title="หมวดหมู่">
            <ul className="space-y-2">
                {['การดูแลสุขภาพ', 'ความรู้', 'โภชนาการ', 'การออกกำลังกาย', 'โรค', 'ปัจจัย'].map(
                    (category, index) => (
                        <li key={index} className="flex items-center">
                            <input type="checkbox" id={`category-${index}`} className="mr-2" />
                            <label htmlFor={`category-${index}`} className="text-gray-700">
                                {category}
                            </label>
                        </li>
                    )
                )}
            </ul>
            <div className="mt-6 flex justify-between">
                <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
                    ยกเลิก
                </button>
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    ยืนยัน
                </button>
            </div>
        </PopupCard>
    );
}
