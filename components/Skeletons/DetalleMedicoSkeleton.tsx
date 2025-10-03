export default function DetalleMedicoSkeleton() {
    return (
      <div className="flex flex-col space-y-4 p-3 rounded-2xl border border-[#A4D4D4] bg-[#F1F1F1] lg:w-[35%] lg:mx-auto">
        <div className="bg-gray-300 w-20 h-20 rounded-full"></div>
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <div className="w-full bg-gray-300 h-6 rounded"></div>
          <div className="w-full bg-gray-300 h-6 rounded"></div>
          <div className="w-full bg-gray-300 h-6 rounded"></div>
          <div className="w-full bg-gray-300 h-6 rounded"></div>
          <div className="w-full bg-gray-300 h-6 rounded"></div>
        </div>
        <div className="flex flex-row justify-end">
          <div className="animated-pulse bg-gray-300 w-24 h-8 rounded" />
        </div>
      </div>
    );
  }