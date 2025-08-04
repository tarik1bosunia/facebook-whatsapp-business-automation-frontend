import Head from 'next/head';
import Link from 'next/link';

// Define the static policy data. You can update these values directly.
const policyData = {
  companyName: '[Your Company Name]',
  websiteUrl: 'https://www.yourwebsite.com',
  lastUpdated: 'August 3, 2025',
  contactEmail: 'privacy@yourcompany.com',
  address: '[Your Company Address]',
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Head>
        <title>{`Privacy Policy | ${policyData.companyName}`}</title>
        <meta name="description" content="Read our privacy policy to understand how we collect, use, and protect your information." />
      </Head>

      <main className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8 lg:p-12">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">Privacy Policy</h1>
            <p className="mt-2 text-sm text-gray-500">Last updated: <span className="font-medium">{policyData.lastUpdated}</span></p>
          </div>

          <div className="mt-10 space-y-8 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-gray-900">1. Introduction</h2>
              <p className="mt-4">
                Welcome to {policyData.companyName} (&quot;we,&quot; &quot;our,&quot; &quot;us&quot;). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website at <Link href={policyData.websiteUrl} className="text-indigo-600 hover:underline">{policyData.websiteUrl}</Link>, including any other media form, media channel, mobile website, or mobile application related or connected thereto (collectively, the &quot;Site&quot;).
              </p>
              <p className="mt-4">
                Please read this Privacy Policy carefully. If you do not agree with the terms of this privacy policy, please do not access the Site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">2. Information We Collect</h2>
              <p className="mt-4">
                We may collect information about you in a variety of ways. The information we may collect on the Site includes:
              </p>
              <ul className="mt-4 list-disc list-inside space-y-2">
                <li>
                  <span className="font-semibold">Personal Data:</span> Personally identifiable information, such as your name, shipping address, email address, and telephone number, that you voluntarily give to us when you register with the Site or when you choose to participate in various activities related to the Site.
                </li>
                <li>
                  <span className="font-semibold">Derivative Data:</span> Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.
                </li>
                <li>
                  <span className="font-semibold">Financial Data:</span> Financial information, such as data related to your payment method (e.g., valid credit card number, card brand, expiration date) that we may collect when you purchase, order, return, exchange, or request information about our services from the Site.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">3. Use of Your Information</h2>
              <p className="mt-4">
                Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:
              </p>
              <ul className="mt-4 list-disc list-inside space-y-2">
                <li>Create and manage your account.</li>
                <li>Email you regarding your account or order.</li>
                <li>Fulfill and manage purchases, orders, payments, and other transactions related to the Site.</li>
                <li>Notify you of updates to the Site.</li>
                <li>Request feedback and contact you about your use of the Site.</li>
                <li>Resolve disputes and troubleshoot problems.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">4. Disclosure of Your Information</h2>
              <p className="mt-4">
                We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
              </p>
              <ul className="mt-4 list-disc list-inside space-y-2">
                <li>
                  <span className="font-semibold">By Law or to Protect Rights:</span> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.
                </li>
                <li>
                  <span className="font-semibold">Third-Party Service Providers:</span> We may share your information with third parties that perform services for us or on our behalf, including data analysis, payment processing, email delivery, hosting services, customer service, and marketing assistance.
                </li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-900">5. Security of Your Information</h2>
              <p className="mt-4">
                We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">6. Changes to This Privacy Policy</h2>
              <p className="mt-4">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">7. Contact Us</h2>
              <p className="mt-4">
                If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at:
              </p>
              <ul className="mt-4 list-disc list-inside space-y-2">
                <li>Email: <Link href={`mailto:${policyData.contactEmail}`} className="text-indigo-600 hover:underline">{policyData.contactEmail}</Link></li>
                <li>Address: {policyData.address}</li>
              </ul>
            </section>

          </div>
        </div>
      </main>
    </>
  );
};
