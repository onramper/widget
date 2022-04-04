import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import BuyCryptoView from "../BuyCryptoView";
import DynamicLandingPageView from "../DynamicLandingPageView";
import { NavContainer } from "../NavContext";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<NavContainer home={<BuyCryptoView />} />} />
      <Route
        path="/transaction/:gateway/:step/:token/:session"
        element={<NavContainer home={<DynamicLandingPageView />} />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
