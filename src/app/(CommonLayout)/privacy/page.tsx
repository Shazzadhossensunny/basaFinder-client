// app/privacy/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-blue-100 mb-6">
              Your privacy is important to us. Learn how we collect, use, and
              protect your information.
            </p>
          </div>
        </div>
      </div>

      {/* Privacy Policy Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-xl shadow-sm">
            <div className="prose max-w-none">
              <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                1. Information We Collect
              </h2>
              <p className="text-gray-700 mb-3">
                <strong>Personal Information:</strong> When you register for an
                account, we collect your name, email address, phone number, and
                password. For property owners, we may collect additional details
                such as property information and payment details.
              </p>
              <p className="text-gray-700 mb-3">
                <strong>Usage Data:</strong> We collect information on how you
                interact with our service, including pages visited, features
                used, and time spent on the platform.
              </p>
              <p className="text-gray-700 mb-6">
                <strong>Device Information:</strong> We collect information
                about the device you use to access our service, including device
                type, operating system, and browser type.
              </p>

              <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                2. How We Use Your Information
              </h2>
              <p className="text-gray-700 mb-6">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700">
                <li className="mb-2">
                  Provide, maintain, and improve our services
                </li>
                <li className="mb-2">
                  Process transactions and send related information
                </li>
                <li className="mb-2">
                  Send you technical notices, updates, and support messages
                </li>
                <li className="mb-2">
                  Respond to your comments, questions, and requests
                </li>
                <li className="mb-2">
                  Communicate with you about products, services, and events
                </li>
                <li className="mb-2">
                  Monitor and analyze trends, usage, and activities in
                  connection with our services
                </li>
                <li>
                  Detect, investigate, and prevent fraudulent transactions and
                  other illegal activities
                </li>
              </ul>

              <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                3. Information Sharing and Disclosure
              </h2>
              <p className="text-gray-700 mb-3">
                We may share your personal information with:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700">
                <li className="mb-2">
                  Other users of the service as necessary (e.g., property owners
                  see tenant inquiries)
                </li>
                <li className="mb-2">
                  Service providers who perform services on our behalf
                </li>
                <li className="mb-2">
                  Law enforcement or other government entities when required by
                  law
                </li>
                <li>Business partners with your consent</li>
              </ul>

              <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                4. Data Security
              </h2>
              <p className="text-gray-700 mb-6">
                We take reasonable measures to help protect your personal
                information from loss, theft, misuse, and unauthorized access,
                disclosure, alteration, and destruction. However, no internet or
                electronic transmission is ever fully secure or error-free.
              </p>

              <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                5. Cookies and Tracking Technologies
              </h2>
              <p className="text-gray-700 mb-6">
                We use cookies and similar tracking technologies to track
                activity on our service and hold certain information. Cookies
                are files with a small amount of data which may include an
                anonymous unique identifier. You can instruct your browser to
                refuse all cookies or to indicate when a cookie is being sent.
              </p>

              <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                6. Your Rights
              </h2>
              <p className="text-gray-700 mb-3">
                Depending on your location, you may have certain rights
                regarding your personal information, including:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700">
                <li className="mb-2">
                  Right to access personal information we hold about you
                </li>
                <li className="mb-2">
                  Right to correct inaccurate information
                </li>
                <li className="mb-2">
                  Right to delete your personal information
                </li>
                <li className="mb-2">
                  Right to restrict processing of your personal information
                </li>
                <li className="mb-2">Right to data portability</li>
                <li>
                  Right to object to processing of your personal information
                </li>
              </ul>

              <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                7. Children's Privacy
              </h2>
              <p className="text-gray-700 mb-6">
                Our service is not intended for use by children under the age of
                18. We do not knowingly collect personal information from
                children under 18. If you are a parent or guardian and believe
                your child has provided us with personal information, please
                contact us.
              </p>

              <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                8. Changes to This Privacy Policy
              </h2>
              <p className="text-gray-700 mb-6">
                We may update our Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page and updating the "Last updated" date. You are advised
                to review this Privacy Policy periodically for any changes.
              </p>

              <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                9. Contact Us
              </h2>
              <p className="text-gray-700 mb-6">
                If you have any questions about this Privacy Policy, please
                contact us at privacy@basafinder.com.
              </p>
            </div>

            <div className="mt-10 pt-6 border-t border-gray-200">
              <p className="text-gray-600 text-sm">
                Last updated: April 20, 2025
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
