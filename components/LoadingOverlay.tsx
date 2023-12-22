export const LoadingOverlay = () => {
  return (
    <div>
      <div id="loading-overlay" className=" w-full h-full fixed block top-0 left-0 bg-gray-100 opacity-60 z-10">
      <div className="absolute right-1/2 bottom-1/2 transform translate-x-1/2 translate-y-1/2 z-50">
        <div className="p-4 bg-gradient-to-tr animate-spin from-pink-400 to-blue-500 via-purple-500 rounded-full">
          <div className="bg-white rounded-full">
            <div className="w-24 h-24 rounded-full"></div>
              <div className="absolute inset-0 bg-transparent"></div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};