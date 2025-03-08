import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import SearchBox from "./SearchBox";
// import { useAppSelector } from "@/hooks/reduxHooks";

const HeroSection = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  return (
    <section className="relative bg-gradient-to-r from-primary/10 via-background to-primary/10 py-20 md:py-32">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 md:grid-cols-2 items-center">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Find Your Perfect Rental House Today!
              </h1>
              <p className="text-muted-foreground md:text-xl">
                BasaFinder connects landlords with tenants, making house hunting
                simple, secure, and stress-free.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              {isAuthenticated && user?.role === "landlord" ? (
                <Link href="/landlord/add-listing">
                  <Button size="lg" className="w-full min-[400px]:w-auto">
                    Post Your Rental House
                  </Button>
                </Link>
              ) : !isAuthenticated ? (
                <Link href="/register">
                  <Button size="lg" className="w-full min-[400px]:w-auto">
                    Get Started
                  </Button>
                </Link>
              ) : null}
              <Link href="/listings">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full min-[400px]:w-auto"
                >
                  Browse Listings
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="w-full max-w-md p-4 bg-card rounded-lg shadow-lg border">
              <h2 className="text-xl font-semibold mb-4">
                Find Your Next Home
              </h2>
              <SearchBox />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
