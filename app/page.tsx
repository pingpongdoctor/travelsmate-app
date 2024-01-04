import BlogCards from './_components/BlogCards';
import HeroSection from './_components/HeroSection';
import IntroduceSection from './_components/IntroduceSection';
import { loadQuery } from '@/sanity/lib/store';
import {
  FEATURED_PRODUCTS_QUERY,
  TRENDING_PRODUCTS_QUERY,
} from '@/sanity/lib/queries';
import { SanityDocument } from 'next-sanity';
import { draftMode } from 'next/headers';
import ProductCardsPreview from './_components/ProductCardsPreview';
import ProductCards from './_components/ProductCards';

export default async function Home() {
  const featuredProductPromise = loadQuery<SanityDocument[]>(
    FEATURED_PRODUCTS_QUERY,
    { featured: true },
    { perspective: draftMode().isEnabled ? 'previewDrafts' : 'published' }
  );

  const trendingProductPromise = loadQuery<SanityDocument[]>(
    TRENDING_PRODUCTS_QUERY,
    {},
    { perspective: draftMode().isEnabled ? 'previewDrafts' : 'published' }
  );

  const [featuredProductData, trendingProductData] = await Promise.all([
    featuredProductPromise,
    trendingProductPromise,
  ]);

  return (
    <main>
      <HeroSection />
      <IntroduceSection />
      <BlogCards />

      {/* featured products */}

      <div>
        <h3 className="mx-auto px-4 md:px-8 lg:px-12 xl:max-w-7xl">
          Featured Products
        </h3>

        {draftMode().isEnabled ? (
          <ProductCardsPreview initial={featuredProductData} />
        ) : (
          <ProductCards products={featuredProductData.data} />
        )}
      </div>

      <div>
        <h3 className="mx-auto px-4 md:px-8 lg:px-12 xl:max-w-7xl">
          Trending Products
        </h3>

        {draftMode().isEnabled ? (
          <ProductCardsPreview initial={trendingProductData} />
        ) : (
          <ProductCards products={trendingProductData.data} />
        )}
      </div>
    </main>
  );
}
