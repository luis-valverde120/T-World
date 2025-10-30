import HeroSection from '@/components/HeroSection';
import FeaturedProducts from '@/components/FeaturedProducts';
import CategoryCarousel from '@/components/CategoryCarousel';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoryCarousel />
      <FeaturedProducts />
    </>
  );
}