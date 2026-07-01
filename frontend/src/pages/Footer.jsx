export default function Footer() {
  return (
    <footer className="bg-blue-50 text-gray-700 py-10 px-4 md:px-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 md:gap-16">

        {/* Left Section */}
        <div className="md:w-1/2">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-600">
            HealthTech
          </h1>
          <p className="mt-4 text-base md:text-lg leading-relaxed">
            HealthTech is built with a modern, professional, and user-friendly
            design that delivers a seamless experience for every visitor. It
            combines advanced technology with a clean, elegant interface to
            ensure fast performance, secure access, and reliable functionality.
            Crafted with a focus on quality, efficiency, and trust, the platform
            offers a powerful set of features optimized to meet industry
            standards. With a smart, responsive layout and a commitment to
            high-value service, our website stands as a premium, future-ready
            solution designed to deliver an exceptional user experience.
          </p>
        </div>

        {/* Right Section (optional – future use) */}
        <div className="md:w-1/2 flex items-center md:items-start justify-center md:justify-end text-sm text-gray-500">
          © {new Date().getFullYear()} HealthTech. All rights reserved.
        </div>

      </div>
    </footer>
  );
}
