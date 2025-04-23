import Link from "next/link";
import { Button } from "../ui/button";

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="md:w-3/5">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Find Your Perfect Rental House Today!
          </h1>
          <p className="mt-6 text-lg md:text-xl text-blue-100">
            BasaFinder connects you with the best rental options in your area.
            Browse listings, connect with landlords, and secure your new home
            hassle-free.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link href="/listings">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
              >
                Browse Listings
              </Button>
            </Link>
            <Link href="/listings/create">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                Post a Rental
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative element */}
      <div className="hidden lg:block absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-blue-500 opacity-20"></div>
    </div>
  );
};

export default Hero;
