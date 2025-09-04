import React from "react";

const Loading = ({ className = "" }) => {
  return (
    <div className={`animate-pulse space-y-6 ${className}`}>
      {/* Header skeleton */}
      <div className="space-y-3">
        <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg w-1/3 animate-pulse"></div>
        <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg w-1/2 animate-pulse"></div>
      </div>

      {/* Content skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl animate-pulse"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-2/3 animate-pulse"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-pulse"></div>
                <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-3/4 animate-pulse"></div>
              </div>
              <div className="flex space-x-2">
                <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full w-16 animate-pulse"></div>
                <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full w-20 animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;