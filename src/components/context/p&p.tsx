
const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen pt-24 bg-gray-50 text-gray-800 py-12 px-6 sm:px-16">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-2xl p-8">
       <h1 className="text-3xl font-bold text-center mb-6 text-orange-500">
  Privacy Policy
</h1>

<p className="text-sm text-gray-500 text-center mb-10">
  Last Updated: July 12, 2026
</p>

<section className="space-y-5 text-[15px] leading-relaxed">
  <p>
    Welcome to <strong>Decorya</strong>. Your privacy is important to us.
    This Privacy Policy explains how we collect, use, and protect your
    information when you use our website and services.
  </p>

  <h2 className="text-xl font-semibold mt-6">
    1. Information We Collect
  </h2>

  <ul className="list-disc pl-6 space-y-2">
    <li>Name and email address.</li>
    <li>Phone number and shipping address.</li>
    <li>Account information and login details.</li>
    <li>Order history and purchase information.</li>
    <li>Device information such as browser and IP address.</li>
  </ul>

  <h2 className="text-xl font-semibold mt-6">
    2. How We Use Your Information
  </h2>

  <ul className="list-disc pl-6 space-y-2">
    <li>To create and manage your account.</li>
    <li>To process orders and deliveries.</li>
    <li>To send order confirmations and notifications.</li>
    <li>To improve our website and services.</li>
    <li>To respond to customer support requests.</li>
  </ul>

  <h2 className="text-xl font-semibold mt-6">
    3. Payment Information
  </h2>

  <p>
    Payments on Decorya are processed securely through trusted
    third-party payment providers. We do not store your debit card,
    credit card, or banking details on our servers.
  </p>

  <h2 className="text-xl font-semibold mt-6">
    4. Cookies and Analytics
  </h2>

  <p>
    We use cookies and similar technologies to improve your browsing
    experience, remember your preferences, and analyze website traffic.
  </p>

  <h2 className="text-xl font-semibold mt-6">
    5. Sharing of Information
  </h2>

  <p>
    We do not sell or rent your personal information. Your data may be
    shared only with:
  </p>

  <ul className="list-disc pl-6 space-y-2">
    <li>Payment service providers.</li>
    <li>Shipping and delivery partners.</li>
    <li>Government authorities when legally required.</li>
  </ul>

  <h2 className="text-xl font-semibold mt-6">
    6. Data Security
  </h2>

  <p>
    We take reasonable security measures to protect your personal
    information. However, no online platform can guarantee complete
    security.
  </p>

  <h2 className="text-xl font-semibold mt-6">
    7. Your Rights
  </h2>

  <ul className="list-disc pl-6 space-y-2">
    <li>Access and update your account information.</li>
    <li>Request deletion of your account.</li>
    <li>Opt out of promotional emails and notifications.</li>
  </ul>

  <h2 className="text-xl font-semibold mt-6">
    8. Third-Party Links
  </h2>

  <p>
    Our website may contain links to third-party websites. We are not
    responsible for the privacy practices of those websites.
  </p>

  <h2 className="text-xl font-semibold mt-6">
    9. Changes to This Privacy Policy
  </h2>

  <p>
    We may update this Privacy Policy from time to time. Changes will
    be posted on this page with an updated revision date.
  </p>

  <h2 className="text-xl font-semibold mt-6">
    10. Contact Us
  </h2>

  <p>
    If you have any questions regarding this Privacy Policy, please
    contact us.
  </p>

  <div className="bg-gray-50 rounded-xl p-4 mt-4">
    <p>
      <strong>Decorya</strong>
    </p>

    <p>📧 {import.meta.env.VITE_EMAIL_ID}</p>
    <p>🌐  {import.meta.env.VITE_DECORYA_URL}</p>
  </div>
</section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
