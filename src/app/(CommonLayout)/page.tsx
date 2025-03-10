import FeaturedListings from "@/components/home/FeaturedListings";
import Hero from "@/components/home/Hero";
import SearchBar from "@/components/home/SearchBar";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SearchBar />
        <FeaturedListings />
        {/* <Testimonials /> */}
      </div>
    </main>
  );
}
