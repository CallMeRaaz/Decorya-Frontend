
const TermsAndConditions = () => {
  return (
    <div className="min-h-screen pt-24 bg-gray-50 text-gray-800 py-12 px-6 sm:px-16">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
          Terms & Conditions
        </h1>
        <p className="text-sm text-gray-500 text-center mb-10">
          Last Updated: October 21, 2025
        </p>

    <section className="space-y-5 text-[15px] leading-relaxed">
  <p>
    Welcome to <strong>Decorya</strong>. By accessing or using our
    website, creating an account, or purchasing products from us,
    you agree to be bound by these Terms & Conditions.
  </p>

  <h2 className="text-xl font-semibold mt-6">
    1. Eligibility
  </h2>

  <p>
    You must be at least 18 years old or use this website under the
    supervision of a parent or legal guardian.
  </p>

  <h2 className="text-xl font-semibold mt-6">
    2. Products & Pricing
  </h2>

  <ul className="list-disc pl-6 space-y-2">
    <li>We strive to display accurate product information and images.</li>
    <li>Product colors may vary slightly depending on your device.</li>
    <li>Prices and offers may change without prior notice.</li>
    <li>Products are subject to availability.</li>
  </ul>

  <h2 className="text-xl font-semibold mt-6">
    3. Orders
  </h2>

  <ul className="list-disc pl-6 space-y-2">
    <li>Orders are confirmed only after successful payment.</li>
    <li>You will receive order updates through email or notifications.</li>
    <li>
      We reserve the right to cancel orders due to pricing errors,
      stock issues, or suspected fraudulent activity.
    </li>
  </ul>

  <h2 className="text-xl font-semibold mt-6">
    4. Payments
  </h2>

  <p>
    Payments are processed securely through trusted third-party
    payment gateways. Decorya does not store your card or banking
    information.
  </p>

  <h2 className="text-xl font-semibold mt-6">
    5. Shipping & Delivery
  </h2>

  <ul className="list-disc pl-6 space-y-2">
    <li>Estimated delivery times are displayed during checkout.</li>
    <li>Delivery delays may occur due to weather or courier issues.</li>
    <li>
      Customers are responsible for providing accurate shipping
      information.
    </li>
  </ul>

  <h2 className="text-xl font-semibold mt-6">
    6. Returns & Refunds
  </h2>

  <ul className="list-disc pl-6 space-y-2">
    <li>Returns are accepted only for eligible products.</li>
    <li>
      Refunds are processed after the returned product passes
      inspection.
    </li>
    <li>
      Shipping charges, if applicable, may not be refundable.
    </li>
  </ul>

  <h2 className="text-xl font-semibold mt-6">
    7. User Responsibilities
  </h2>

  <ul className="list-disc pl-6 space-y-2">
    <li>Maintain the confidentiality of your account credentials.</li>
    <li>Provide accurate and up-to-date information.</li>
    <li>
      Do not attempt to misuse, disrupt, or gain unauthorized access
      to our services.
    </li>
  </ul>

  <h2 className="text-xl font-semibold mt-6">
    8. Intellectual Property
  </h2>

  <p>
    All content on Decorya, including logos, images, graphics, text,
    and designs, is the property of Decorya and may not be copied,
    reproduced, or distributed without permission.
  </p>

  <h2 className="text-xl font-semibold mt-6">
    9. Limitation of Liability
  </h2>

  <p>
    Decorya shall not be liable for any indirect, incidental, or
    consequential damages arising from the use of our website or
    products.
  </p>

  <h2 className="text-xl font-semibold mt-6">
    10. Changes to Terms
  </h2>

  <p>
    We reserve the right to update these Terms & Conditions at any
    time. Continued use of the website after changes means you accept
    the updated terms.
  </p>

  <h2 className="text-xl font-semibold mt-6">
    11. Governing Law
  </h2>

  <p>
    These Terms & Conditions are governed by the laws of India. Any
    disputes arising from the use of this website shall be subject to
    the jurisdiction of the competent courts in India.
  </p>

  <h2 className="text-xl font-semibold mt-6">
    12. Contact Us
  </h2>

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

export default TermsAndConditions;
