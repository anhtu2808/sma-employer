import React from "react";
import Loading from "./index";

const LoadingOverlay = ({ isLoading }) => {
  if (!isLoading) return null;
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/75 backdrop-blur-sm rounded-xl">
      <Loading size={120} />
    </div>
  );
};

export default LoadingOverlay;
