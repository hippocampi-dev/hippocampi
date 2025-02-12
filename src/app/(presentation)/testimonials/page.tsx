// app/testimonials/page.tsx
export default function Testimonials() {
    return (
      <div className="py-16 px-4 md:px-20 bg-white">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Testimonials & Case Studies</h1>
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="p-6 bg-gray-50 rounded-lg shadow">
            <p className="text-xl italic text-gray-700">"Before Hippocampi, I struggled with memory loss. Now, I’ve regained focus and clarity."</p>
            <p className="mt-2 text-right text-gray-500">– Patient A</p>
          </div>
          <div className="p-6 bg-gray-50 rounded-lg shadow">
            <p className="text-xl italic text-gray-700">"Hippocampi streamlined our care process, letting us focus on treatment while they handle the admin work."</p>
            <p className="mt-2 text-right text-gray-500">– Dr. Smith</p>
          </div>
        </div>
      </div>
    );
  }
  