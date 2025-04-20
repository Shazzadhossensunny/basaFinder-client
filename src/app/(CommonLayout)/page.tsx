import FeaturedListings from "@/components/home/FeaturedListings";
import Hero from "@/components/home/Hero";
import InlineSearchResults from "@/components/home/SearchBar";
import SearchBar from "@/components/home/SearchBar";
import { Button } from "@/components/ui/button";
import { getAllListings } from "@/services/ListingService";
import { Building, Phone, Star, Users } from "lucide-react";
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
    <main className="min-h-screen">
      <Hero />
      {/* Search Section */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="relative -mt-24 md:-mt-32">
            <InlineSearchResults initialListings={listingsData || []} />
          </div>
        </div>
      </section>
      {/* Featured Properties Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <FeaturedListings />
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Us</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're committed to making your rental experience seamless and
              enjoyable. Here's why thousands of renters trust us.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Benefit 1 */}
            <div className="bg-blue-50 p-6 rounded-xl text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Building className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Curated Properties</h3>
              <p className="text-gray-600">
                We carefully verify all listings to ensure quality and
                authenticity.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="bg-purple-50 p-6 rounded-xl text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Trusted Landlords</h3>
              <p className="text-gray-600">
                Our platform connects you with verified and trusted property
                owners.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="bg-green-50 p-6 rounded-xl text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Phone className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600">
                Our dedicated support team is available round the clock to
                assist you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our happy customers
              have to say.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center space-x-1 text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "I found my dream apartment in just a few days using this
                platform. The search tools are intuitive and the listings are
                high quality."
              </p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center mr-3">
                  <span className="text-white font-semibold">JD</span>
                </div>
                <div>
                  <h4 className="font-semibold">John Doe</h4>
                  <p className="text-gray-500 text-sm">Dhaka, Bangladesh</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center space-x-1 text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "As a landlord, this platform has made it so easy to list my
                properties and find reliable tenants. The support team is also
                excellent."
              </p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center mr-3">
                  <span className="text-white font-semibold">JS</span>
                </div>
                <div>
                  <h4 className="font-semibold">Jane Smith</h4>
                  <p className="text-gray-500 text-sm">
                    Chittagong, Bangladesh
                  </p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center space-x-1 text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "The filtering options made it easy to find properties within my
                budget in the exact location I wanted. Highly recommend!"
              </p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center mr-3">
                  <span className="text-white font-semibold">AR</span>
                </div>
                <div>
                  <h4 className="font-semibold">Ahmed Rahman</h4>
                  <p className="text-gray-500 text-sm">Sylhet, Bangladesh</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Find Your Perfect Home?
          </h2>
          <p className="text-white/90 max-w-2xl mx-auto mb-8">
            Thousands of properties are waiting for you. Start your search today
            and find the perfect place to call home.
          </p>
          <div className="flex justify-center gap-4">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50"
            >
              Search Properties
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              List Your Property
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
