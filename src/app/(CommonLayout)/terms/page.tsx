// app/terms/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Terms of Service
            </h1>
            <p className="text-lg text-blue-100 mb-6">
              Please read these terms carefully before using BasaFinder.
            </p>
          </div>
        </div>
      </div>

      {/* Terms Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-xl shadow-sm">
            <div className="prose max-w-none">
              <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                1. Introduction
              </h2>
              <p className="text-gray-700 mb-6">
                Welcome to BasaFinder. These Terms of Service ("Terms") govern
                your use of the BasaFinder website, mobile application, and
                services (collectively, the "Service") operated by BasaFinder
                ("we," "us," or "our"). By accessing or using the Service, you
                agree to be bound by these Terms. If you disagree with any part
                of the Terms, you may not access the Service.
              </p>

              <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                2. User Accounts
              </h2>
              <p className="text-gray-700 mb-3">
                When you create an account with us, you must provide information
                that is accurate, complete, and current at all times. Failure to
                do so constitutes a breach of the Terms, which may result in
                immediate termination of your account on our Service.
              </p>
              <p className="text-gray-700 mb-6">
                You are responsible for safeguarding the password you use to
                access the Service and for any activities or actions under your
                password. You agree not to disclose your password to any third
                party. You must notify us immediately upon becoming aware of any
                breach of security or unauthorized use of your account.
              </p>

              <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                3. Property Listings
              </h2>
              <p className="text-gray-700 mb-3">
                Property owners are responsible for ensuring that all listings
                are accurate, up-to-date, and comply with all applicable laws
                and regulations. BasaFinder reserves the right to remove any
                listing that violates our policies or is deemed inappropriate at
                our sole discretion.
              </p>
              <p className="text-gray-700 mb-6">
                We make efforts to verify listings but cannot guarantee the
                accuracy of all information provided by property owners. Users
                are encouraged to verify all details independently before making
                any decisions or commitments.
              </p>

              <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                4. Fees and Payments
              </h2>
              <p className="text-gray-700 mb-3">
                Some features of the Service may require payment of fees. You
                agree to pay all fees specified at the time of purchase. Payment
                must be made using the methods specified on our website.
              </p>
              <p className="text-gray-700 mb-6">
                All fees are exclusive of all taxes, levies, or duties imposed
                by taxing authorities, and you will be responsible for payment
                of all such taxes, levies, or duties, excluding only Bangladesh
                VAT.
              </p>

              <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                5. Intellectual Property
              </h2>
              <p className="text-gray-700 mb-6">
                The Service and its original content, features, and
                functionality are and will remain the exclusive property of
                BasaFinder and its licensors. The Service is protected by
                copyright, trademark, and other laws of both Bangladesh and
                foreign countries. Our trademarks and trade dress may not be
                used in connection with any product or service without the prior
                written consent of BasaFinder.
              </p>

              <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                6. Limitation of Liability
              </h2>
              <p className="text-gray-700 mb-6">
                In no event shall BasaFinder, nor its directors, employees,
                partners, agents, suppliers, or affiliates, be liable for any
                indirect, incidental, special, consequential or punitive
                damages, including without limitation, loss of profits, data,
                use, goodwill, or other intangible losses, resulting from your
                access to or use of or inability to access or use the Service.
              </p>

              <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                7. Changes to Terms
              </h2>
              <p className="text-gray-700 mb-6">
                We reserve the right, at our sole discretion, to modify or
                replace these Terms at any time. If a revision is material, we
                will try to provide at least 30 days' notice prior to any new
                terms taking effect. What constitutes a material change will be
                determined at our sole discretion.
              </p>

              <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                8. Governing Law
              </h2>
              <p className="text-gray-700 mb-6">
                These Terms shall be governed and construed in accordance with
                the laws of Bangladesh, without regard to its conflict of law
                provisions. Our failure to enforce any right or provision of
                these Terms will not be considered a waiver of those rights.
              </p>

              <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                9. Contact Us
              </h2>
              <p className="text-gray-700 mb-6">
                If you have any questions about these Terms, please contact us
                at legal@basafinder.com.
              </p>
            </div>

            <div className="mt-10 pt-6 border-t border-gray-200">
              <p className="text-gray-600 text-sm">
                Last updated: April 25, 2025
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">
              Have Questions About Our Terms?
            </h2>
            <p className="text-lg mb-6 max-w-2xl mx-auto">
              Our support team is ready to assist you with any questions
              regarding our Terms of Service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-blue-50 cursor-pointer"
                >
                  Contact Support
                </Button>
              </Link>
              <Link href="/privacy">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white bg-transparent hover:bg-white/10 cursor-pointer"
                >
                  Privacy Policy
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
