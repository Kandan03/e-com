import React, { Children } from "react";

const RouteLayout = ({ children }) => {
  return <div className="p-5 sm:px-10 md:px-10 lg:px-48">{children}</div>;
};

export default RouteLayout;
