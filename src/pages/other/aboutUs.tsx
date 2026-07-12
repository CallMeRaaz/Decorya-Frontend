const AboutUs = () => {
  return (
    <>
      <div className="bg-gray-50 pt-24">
        {/* Hero Section */}
        <section
          className="relative h-[60vh] bg-cover bg-center flex items-center justify-center"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1544717304-a2db4a7b16ee?auto=format&fit=crop&w=1200&q=80")`,
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="relative text-center text-white px-6">
            <h1 className="text-3xl md:text-5xl font-bold mb-3">About Us</h1>
            <p className="text-md md:text-xl">
              Bringing elegance and charm to every home
            </p>
          </div>
        </section>

        {/* About Content */}
        <section className="py-24 px-4 md:px-8 bg-gradient-to-b from-gray-100 to-gray-50">
          <div className="max-w-6xl mx-auto space-y-16">
            {/* Our Story Card */}
            <div className="bg-white p-10 md:p-16 rounded-2xl shadow-2xl transform hover:-translate-y-2 transition-transform duration-300">
              <div className="flex items-center mb-4">
                <div className="w-10 h-1 bg-pink-400 rounded-full mr-3"></div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                  Our Story
                </h2>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">
                At SparkDecor, we believe every home deserves a touch of
                elegance. What started as a small idea to create unique handmade
                decor items has grown into a curated collection of stylish
                pieces for your living spaces.
              </p>
            </div>

            {/* Our Mission Card */}
            <div className="bg-white p-10 md:p-16 rounded-2xl shadow-2xl transform hover:-translate-y-2 transition-transform duration-300">
              <div className="flex items-center mb-4">
                <div className="w-10 h-1 bg-green-400 rounded-full mr-3"></div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                  Our Mission
                </h2>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">
                Our mission is to make beautiful, high-quality decor accessible
                to everyone and to inspire creativity and joy in every home
                through our unique decoration items.
              </p>
            </div>

            {/* Why Choose Us Card */}
            <div className="bg-white p-10 md:p-16 rounded-2xl shadow-2xl transform hover:-translate-y-2 transition-transform duration-300">
              <div className="flex items-center mb-4">
                <div className="w-10 h-1 bg-blue-400 rounded-full mr-3"></div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                  Why Choose Us
                </h2>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">
                We offer handmade, eco-friendly, and customizable decor items
                that add charm to any space. Customer satisfaction is our top
                priority, and our team is always here to help you find the
                perfect piece.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AboutUs;
