import FeaturedListings from "@/components/home/FeaturedListings";
import Hero from "@/components/home/Hero";
import InlineSearchResults from "@/components/home/SearchBar";
import SearchBar from "@/components/home/SearchBar";
import { getAllListings } from "@/services/ListingService";
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;
export default async function HomePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const query = await searchParams;
  const { data: listingsData } = await getAllListings(
    undefined,
    undefined,
    query
  );
  return (
    <main>
      <Hero />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <InlineSearchResults initialListings={listingsData || []} />
        <FeaturedListings />
        {/* <Testimonials /> */}
      </div>
    </main>
  );
}
