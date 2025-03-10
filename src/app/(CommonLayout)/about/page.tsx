// app/about/page.tsx
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center mb-16 gap-8">
        <div className="md:w-1/2">
          <h1 className="text-4xl font-bold mb-4 text-blue-700">
            About BasaFinder
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            BasaFinder is Bangladesh's premier platform connecting tenants with
            their ideal rental homes. Our mission is to make the house hunting
            process simple, transparent, and stress-free.
          </p>
          <Link href="/listings">
            <Button size="lg" className="bg-blue-700 hover:bg-blue-800">
              Browse Listings
            </Button>
          </Link>
        </div>
        <div className="md:w-1/2 relative h-64 md:h-96 w-full rounded-lg overflow-hidden">
          <Image
            src="/api/placeholder/800/600"
            alt="About BasaFinder"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Our Story Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold mb-6 text-center">Our Story</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-xl font-medium mb-3 text-blue-700">
              Our Beginning
            </h3>
            <p className="text-gray-700">
              BasaFinder was founded in 2023 by a group of young entrepreneurs
              who experienced firsthand the challenges of finding suitable
              housing in Bangladesh's fast-growing urban centers. Frustrated by
              the lack of transparency and efficiency in the traditional rental
              market, they created BasaFinder to revolutionize how people find
              their perfect home.
            </p>
          </div>
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-xl font-medium mb-3 text-blue-700">
              Our Mission
            </h3>
            <p className="text-gray-700">
              Our mission is to create a transparent, efficient, and
              user-friendly platform that empowers both tenants and landlords.
              We believe everyone deserves access to quality housing information
              and fair rental opportunities. By leveraging technology, we're
              making the rental process simpler and more accessible for all
              Bangladeshis.
            </p>
          </div>
        </div>
      </section>

      <Separator className="my-12" />

      {/* Team Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold mb-10 text-center">Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((member) => (
            <div
              key={member}
              className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105"
            >
              <div className="relative h-56 w-full">
                <Image
                  src={`/api/placeholder/300/300`}
                  alt={`Team Member ${member}`}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg">Team Member {member}</h3>
                <p className="text-blue-600 text-sm mb-2">
                  Co-Founder & Position
                </p>
                <p className="text-gray-600 text-sm">
                  Passionate about creating innovative solutions for the rental
                  market in Bangladesh.
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold mb-10 text-center">
          Why Choose BasaFinder
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Verified Listings",
              description:
                "All our listings go through a verification process to ensure you get accurate information.",
            },
            {
              title: "Transparent Process",
              description:
                "Clear pricing, no hidden fees, and direct communication with property owners.",
            },
            {
              title: "Secure Payments",
              description:
                "Our secure payment system ensures all transactions are protected and traceable.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="border border-blue-100 rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-xl font-medium mb-3 text-blue-700">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Find Your Perfect Home?
        </h2>
        <p className="text-lg mb-6 max-w-2xl mx-auto">
          Join thousands of satisfied customers who have found their ideal
          rental through BasaFinder.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/listings">
            <Button
              size="lg"
              className="bg-white text-blue-700 hover:bg-blue-50"
            >
              Browse Listings
            </Button>
          </Link>
          <Link href="/contact">
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              Contact Us
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
