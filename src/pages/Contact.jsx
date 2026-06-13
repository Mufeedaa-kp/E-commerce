import { useState } from "react";
import toast from "react-hot-toast";

function Contact() {
  const user = JSON.parse(localStorage.getItem("user"));

const [formData, setFormData] = useState({
  name: user?.name || "",
  email: user?.email || "",
  message: "",
});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
 
  try {
    const res = await fetch("http://localhost:5000/api/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,
        date: new Date().toISOString(),
      }),
    });

    if (!res.ok) throw new Error();

    toast.success("Message sent successfully 💌");

    setFormData({
      name: "",
      email: "",
      message: "",
    });

  } catch {
    toast.error("Failed to send message");
  }
};

  return (
    <div className="bg-gray-50 min-h-screen">

     
      <section className="bg-primary-600 text-white py-16 px-6 text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          Contact Us
        </h1>
        <p className="max-w-2xl mx-auto text-sm md:text-lg opacity-90">
          We're here to support you with all your mom and baby care needs.
        </p>
      </section>

     
      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12">

       
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold mb-6">
            Get In Touch
          </h2>

          <div className="space-y-6">

            <div className="flex items-start gap-4 bg-white p-5 rounded-xl shadow-sm">
              <span className="text-2xl">📧</span>
              <div>
                <h3 className="font-semibold">Email</h3>
                <p className="text-gray-600 text-sm">
                  support@momcare.com
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white p-5 rounded-xl shadow-sm">
              <span className="text-2xl">📞</span>
              <div>
                <h3 className="font-semibold">Phone</h3>
                <p className="text-gray-600 text-sm">
                  +91 98765 43210
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white p-5 rounded-xl shadow-sm">
              <span className="text-2xl">📍</span>
              <div>
                <h3 className="font-semibold">Location</h3>
                <p className="text-gray-600 text-sm">
                  Kerala, India
                </p>
              </div>
            </div>

          </div>
        </div>

        
        <div className="bg-white p-8 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold mb-6">
            Send Us a Message
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block text-sm mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Message</label>
              <textarea
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition duration-300"
            >
              Send Message
            </button>

          </form>
        </div>

      </section>

    </div>
  );
}

export default Contact;
