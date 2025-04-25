// app/about/page.tsx
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import aboutImg from "/public/assets/about.jpg";
import teamImg1 from "/public/assets/michel.jpg";
import teamImg2 from "/public/assets/emily.jpg";
import teamImg3 from "/public/assets/sarah.jpg";
import teamImg4 from "/public/assets/sergio.jpg";
import altImg from "/public/placeholder-image.svg";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                About BasaFinder
              </h1>
              <p className="text-lg text-blue-100 mb-6">
                BasaFinder is Bangladesh's premier platform connecting tenants
                with their ideal rental homes. Our mission is to make the house
                hunting process simple, transparent, and stress-free.
              </p>
              <Link href="/listings">
                <Button
                  size="lg"
                  className="bg-white text-blue-700 hover:bg-blue-50 cursor-pointer"
                >
                  Browse Listings
                </Button>
              </Link>
            </div>
            <div className="md:w-1/2 relative h-64 md:h-96 w-full rounded-lg overflow-hidden shadow-xl">
              <Image
                src={aboutImg || altImg}
                alt="About BasaFinder"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-10 text-center">Our Story</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                Our Beginning
              </h3>
              <p className="text-gray-700">
                BasaFinder was founded in 2023 by a group of young entrepreneurs
                who experienced firsthand the challenges of finding suitable
                housing in Bangladesh's fast-growing urban centers. Frustrated
                by the lack of transparency and efficiency in the traditional
                rental market, they created BasaFinder to revolutionize how
                people find their perfect home.
              </p>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                Our Mission
              </h3>
              <p className="text-gray-700">
                Our mission is to create a transparent, efficient, and
                user-friendly platform that empowers both tenants and landlords.
                We believe everyone deserves access to quality housing
                information and fair rental opportunities. By leveraging
                technology, we're making the rental process simpler and more
                accessible for all Bangladeshis.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Separator className="max-w-6xl mx-auto" />

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-10 text-center">Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              {
                img: teamImg1,
                name: "Michel Johnson",
                position: "Co-Founder & CEO",
              },
              {
                img: teamImg2,
                name: "Emily Chen",
                position: "Co-Founder & CTO",
              },
              {
                img: teamImg3,
                name: "Sarah Ahmed",
                position: "Head of Operations",
              },
              {
                img: teamImg4,
                name: "Sergio Rahman",
                position: "Marketing Director",
              },
            ].map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer"
              >
                <div className="relative h-56 w-full overflow-hidden">
                  <Image
                    src={member.img || altImg}
                    alt={`Team Member ${member.name}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{member.name}</h3>
                  <p className="text-sm mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 font-medium">
                    {member.position}
                  </p>
                  <p className="text-gray-600 text-sm">
                    Passionate about creating innovative solutions for the
                    rental market in Bangladesh.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-10 text-center">
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
                className="rounded-xl p-6 bg-gradient-to-r from-blue-50 to-purple-50 shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-xl font-semibold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white text-center">
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
                  className="bg-white text-blue-600 hover:bg-blue-50 cursor-pointer"
                >
                  Search Properties
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white bg-transparent text-white hover:bg-white/10 cursor-pointer"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
