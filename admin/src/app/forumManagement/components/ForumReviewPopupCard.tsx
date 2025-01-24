import PopupCard from '@/components/PopupCard';
import forumReviews from '../../../data/forumReviews.json'

export default function ForumReviewPopupCard() {
    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 space-y-4">
            {forumReviews.map((review) => (
                <PopupCard key={review.id} title="ตรวจสอบฟอรั่ม">
                    <div className="flex items-center mb-4">
                        <div>
                            <p className="font-bold">{review.username}</p>
                            <p className="text-gray-600 text-sm">{review.created_at}</p>
                        </div>
                    </div>
                    <div className="mb-4">
                        <p>{review.content}</p>
                    </div>
                    <div className="flex justify-between">
                        <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                            อนุมัติ
                        </button>
                        <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                            ลบ
                        </button>
                    </div>
                </PopupCard>
            ))}
        </div>
    );
}
