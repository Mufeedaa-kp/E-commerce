
function About() {
  return (
    <div className="bg-gray-50 min-h-screen">

      
      <section className="bg-primary-600 text-white py-16 px-6 text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          About Babio
        </h1>
        <p className="max-w-2xl mx-auto text-sm md:text-lg opacity-90">
          Your trusted online store for safe, affordable, and high-quality
          essentials for mothers and babies.
        </p>
      </section>

     
      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
        
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">
            Our Mission
          </h2>

          <p className="text-gray-600 leading-relaxed mb-4">
            At Babio, we understand that motherhood is a beautiful
            journey filled with love, care, and responsibility. Our mission is
            to make parenting easier by providing carefully selected baby and
            maternity essentials that meet the highest standards of safety
            and comfort.
          </p>

          <p className="text-gray-600 leading-relaxed">
            From newborn clothing to feeding essentials and daily care
            products, we ensure that every item supports both mother and baby
            with trust and reliability.
          </p>
        </div>

<div className="w-full h-64">

<img
  src="/images/baby.jpg"
  alt="Mother and baby"
  className="rounded-2xl shadow-lg w-full object-cover"
/>
</div>


      </section>

      
      <section className="bg-white py-16 px-6">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold">
            Why Choose Us?
          </h2>
          <p className="text-gray-500 mt-3">
            Because your baby deserves the best care and comfort.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 md:grid-cols-4 gap-8">

          <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition duration-300">
            <div className="text-3xl mb-4">💖</div>
            <h3 className="font-semibold mb-2">Premium Quality</h3>
            <p className="text-sm text-gray-600">
              Safe, gentle, and reliable products for your little one.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition duration-300">
            <div className="text-3xl mb-4">🔒</div>
            <h3 className="font-semibold mb-2">Secure Shopping</h3>
            <p className="text-sm text-gray-600">
              Protected payments and trusted customer service.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition duration-300">
            <div className="text-3xl mb-4">🚚</div>
            <h3 className="font-semibold mb-2">Fast Delivery</h3>
            <p className="text-sm text-gray-600">
              Quick doorstep delivery across locations.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition duration-300">
            <div className="text-3xl mb-4">😊</div>
            <h3 className="font-semibold mb-2">Customer Support</h3>
            <p className="text-sm text-gray-600">
              Friendly support team ready to help you anytime.
            </p>
          </div>

        </div>
      </section>

     
      <section className="bg-primary-50 py-16 px-6 text-center">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">
          Supporting Every Step of Motherhood
        </h2>
        <p className="max-w-2xl mx-auto text-gray-600">
          Babio is more than an online store — it’s a trusted
          partner in your parenting journey, delivering comfort, care, and
          confidence every day.
        </p>
      </section>

    </div>
  );
}

export default About;
