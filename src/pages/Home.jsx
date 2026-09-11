import React from 'react';
import HeroBanner from '../components/Home/HeroBanner';
import CategorySection from '../components/Home/CategorySection';
import PromoCards from '../components/Home/PromoCards';
import BestDealsSection from '../components/Home/BestDealsSection';
import RecommendedSection from '../components/Home/RecommendedSection';
import TrustFeatures from '../components/Home/TrustFeatures';

export default function Home() {
  return (
    <div className="space-y-2">
      {/* 1. Hero Banner Carousel */}
      <HeroBanner />

      {/* 2. Circular Category Pills */}
      <CategorySection />

      {/* 3. Promotional Horizontal Cards (Flash Sale, Free Shipping, New Arrivals) */}
      <PromoCards />

      {/* 4. Best Deals for You */}
      <BestDealsSection />

      {/* 5. Recommended for You */}
      <RecommendedSection />

      {/* 6. Trust Feature Bar */}
      <TrustFeatures />
    </div>
  );
}
