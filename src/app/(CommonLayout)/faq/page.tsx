// app/faqs/page.tsx
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function FAQsPage() {
  const faqCategories = [
    {
      title: "General Questions",
      faqs: [
        {
          question: "What is BasaFinder?",
          answer:
            "BasaFinder is Bangladesh's premier platform connecting tenants with their ideal rental homes. Our mission is to make the house hunting process simple, transparent, and stress-free for all Bangladeshis.",
        },
        {
          question: "Is BasaFinder available throughout Bangladesh?",
          answer:
            "Yes, BasaFinder services are available across all major cities in Bangladesh, with a focus on Dhaka, Chittagong, and Sylhet regions. We're continuously expanding to cover more areas.",
        },
        {
          question: "Is the BasaFinder service free to use?",
          answer:
            "BasaFinder is free for tenants searching for properties. Property owners may have listing fees depending on their subscription plan. Check our pricing page for more detailed information.",
        },
        {
          question: "How can I contact BasaFinder support?",
          answer:
            "You can reach our support team via email at support@basafinder.com, through the contact form on our website, or by calling our customer service line at +880 1700-000000 during business hours.",
        },
      ],
    },
    {
      title: "For Tenants",
      faqs: [
        {
          question: "How do I search for properties on BasaFinder?",
          answer:
            "You can search for properties using our search filters on the homepage or listings page. Filter by location, price range, property type, number of bedrooms, and various amenities to find your perfect match.",
        },
        {
          question: "How can I schedule a property viewing?",
          answer:
            "Once you find a property you're interested in, you can request a viewing directly through our platform. The property owner or agent will then contact you to arrange a convenient time.",
        },
        {
          question: "Are the listings on BasaFinder verified?",
          answer:
            "Yes, we make efforts to verify all listings on our platform. Properties undergo a basic verification process, and we encourage users to report any suspicious listings. Premium listings undergo a more thorough verification process.",
        },
        {
          question:
            "What information do I need to provide to contact a property owner?",
          answer:
            "You'll need to create a BasaFinder account with your basic contact information. When inquiring about a property, you may be asked to provide additional details about your rental requirements and move-in timeline.",
        },
      ],
    },
    {
      title: "For Property Owners",
      faqs: [
        {
          question: "How do I list my property on BasaFinder?",
          answer:
            "You can easily list your property by creating an account, clicking on 'Add Listing' and following the step-by-step guide to upload property details and photos. You can choose between our free basic listing or premium listing options.",
        },
        {
          question: "What are the fees for listing a property?",
          answer:
            "We offer both free and premium listing options. Free listings include basic property information display. Premium listings start at 500 BDT per month and include featured placement, verified status badges, and priority customer support.",
        },
        {
          question: "How long does it take for my listing to go live?",
          answer:
            "Basic listings usually go live within 24 hours after submission. Premium listings undergo a verification process that typically takes 1-3 business days before going live on the platform.",
        },
        {
          question: "How do I receive inquiries from potential tenants?",
          answer:
            "When a potential tenant expresses interest in your property, you'll receive notifications via email and in your BasaFinder dashboard. You can respond directly through our messaging system or contact them using their provided information.",
        },
      ],
    },
    {
      title: "Account & Payments",
      faqs: [
        {
          question: "How do I create a BasaFinder account?",
          answer:
            "You can sign up for a BasaFinder account by clicking the 'Sign Up' button at the top of any page. You'll need to provide your name, email address, phone number, and create a password.",
        },
        {
          question: "What payment methods do you accept?",
          answer:
            "We accept various payment methods including credit/debit cards, bKash, Nagad, Rocket, and bank transfers for property owner subscription fees and premium services.",
        },
        {
          question: "How do I cancel my subscription?",
          answer:
            "You can cancel your subscription at any time by going to your Account Settings and selecting 'Manage Subscription.' Your subscription will remain active until the end of the current billing cycle.",
        },
        {
          question: "Is my payment information secure?",
          answer:
            "Yes, we use industry-standard encryption and security measures to protect your payment information. We do not store your full credit card details on our servers.",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-blue-100 mb-6">
              Find answers to common questions about using BasaFinder, whether
              you're a tenant looking for your next home or a property owner
              listing your space.
            </p>
            {/* <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact">
                <Button
                  size="lg"
                  className="bg-white text-blue-700 hover:bg-blue-50 cursor-pointer"
                >
                  Contact Support
                </Button>
              </Link>
            </div> */}
          </div>
        </div>
      </div>

      {/* FAQ Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex overflow-x-auto pb-4 mb-8 -mx-4 px-4 scrollbar-hide">
              <div className="flex space-x-4">
                {[
                  "All Questions",
                  ...faqCategories.map((cat) => cat.title),
                ].map((category, index) => (
                  <a
                    key={index}
                    href={`#${category.replace(/\s+/g, "-").toLowerCase()}`}
                    className="px-6 py-2 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 rounded-full font-medium whitespace-nowrap hover:shadow-md transition-shadow"
                  >
                    {category}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {faqCategories.map((category, categoryIndex) => (
              <div
                key={categoryIndex}
                id={category.title.replace(/\s+/g, "-").toLowerCase()}
                className="mb-16"
              >
                <h2 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                  {category.title}
                </h2>
                <div className="space-y-6">
                  {category.faqs.map((faq, faqIndex) => (
                    <div
                      key={faqIndex}
                      className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                    >
                      <h3 className="text-xl font-semibold mb-3 text-gray-800">
                        {faq.question}
                      </h3>
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  ))}
                </div>
                {categoryIndex < faqCategories.length - 1 && (
                  <Separator className="mt-16" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Still Have Questions?</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Can't find the answer you're looking for? Our dedicated support
              team is here to help you with any questions or concerns.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Email Support */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-blue-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-blue-600"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg mb-2">Email Support</h3>
                <p className="text-gray-600 mb-4">
                  Send us your questions anytime
                </p>
                <p className="font-medium text-blue-600">
                  support@basafinder.com
                </p>
              </div>

              {/* Phone Support */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-blue-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-blue-600"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg mb-2">Phone Support</h3>
                <p className="text-gray-600 mb-4">
                  Call us during business hours
                </p>
                <p className="font-medium text-blue-600">+880 1700-000000</p>
              </div>

              {/* Contact Form */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-blue-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-blue-600"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg mb-2">Contact Form</h3>
                <p className="text-gray-600 mb-4">Submit your inquiry online</p>
                <Link href="/contact">
                  <p className="font-medium text-blue-600 hover:underline cursor-pointer">
                    Send a Message
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Call to Action */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">
              Questions About Your Privacy?
            </h2>
            <p className="text-lg mb-6 max-w-2xl mx-auto">
              If you have any questions or concerns about your privacy or our
              data practices, our team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-blue-50 cursor-pointer"
                >
                  Contact Us
                </Button>
              </Link>
              <Link href="/terms">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white bg-transparent hover:bg-white/10 cursor-pointer"
                >
                  Terms of Service
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
