import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ message = "Something went wrong", onRetry, className = "" }) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <div className="w-20 h-20 bg-gradient-to-br from-error-100 to-error-200 rounded-full flex items-center justify-center mb-6 shadow-lg">
        <ApperIcon name="AlertTriangle" size={40} className="text-error-600" />
      </div>
      
      <h3 className="text-xl font-display font-semibold text-gray-900 mb-2">
        Oops! Something went wrong
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md">
        {message}
      </p>
      
      {onRetry && (
        <Button onClick={onRetry} className="bg-gradient-to-r from-error-500 to-error-600 hover:from-error-600 hover:to-error-700">
          <ApperIcon name="RefreshCw" size={18} className="mr-2" />
          Try Again
        </Button>
      )}
    </div>
  );
};

export default Error;