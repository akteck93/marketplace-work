import { Star } from "lucide-react";

export default function FreelancerReviewsPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-black flex items-center gap-2">
            Reviews & Ratings <Star className="w-6 h-6 text-[#ff2a5f]" />
          </h2>
          <p className="text-sm text-slate-500 mt-1">Manage your feedback from clients and build your reputation.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
          <Star className="w-8 h-8 text-[#ff2a5f]" />
        </div>
        <h3 className="text-lg font-bold text-black">No reviews yet</h3>
        <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
          Complete your first project to start earning ratings and reviews. High ratings help you win more jobs.
        </p>
      </div>
    </div>
  );
}
