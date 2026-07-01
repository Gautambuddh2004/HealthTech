import React, { useState, useEffect } from 'react';
import { Phone, Star, Award, Search } from 'lucide-react';
import Navbar from './navbar';

const DoctorPage = () => {
  const [search, setSearch] = useState("");
  const [dbDoctors, setDbDoctors] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/doctors")
      .then(res => res.json())
      .then(data => setDbDoctors(data))
      .catch(err => console.error("Doctors fetch error:", err));
  }, []);

  const allDoctors = dbDoctors.map(d => ({
    id: d._id,
    name: d.name,
    spec: d.specialty,
    exp: d.experience ? `${d.experience}` : "N/A",
    fees: d.fees || "N/A",
    rating: d.rating || 4.5,
    phone: d.phone || "",
    img: d.image || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80",
    desc: d.desc || `${d.specialty} at ${d.hospital}`
  }));

  const filteredDoctors = allDoctors.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.spec.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className='pt-15'>
      <Navbar />
      <div className="bg-slate-50 min-h-screen p-6">
        <div className="max-w-6xl mx-auto mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Our Specialist Doctors</h1>
          <p className="text-slate-600 mb-8">Consult with our world-class medical experts.</p>

          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search by doctor name or specialty..."
              className="w-full pl-12 pr-4 py-3.5 rounded-full border border-slate-200 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDoctors.map((doc) => (
            <div key={doc.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
              <div className="relative h-56">
                <img src={doc.img} alt={doc.name} className="w-full h-full object-cover" />
                <div className="absolute bottom-3 left-3 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                  {doc.spec}
                </div>
              </div>

              <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-slate-800">{doc.name}</h3>
                  <div className="flex items-center text-yellow-500 gap-1 bg-yellow-50 px-2 py-0.5 rounded">
                    <Star size={14} fill="currentColor" />
                    <span className="text-xs font-bold">{doc.rating}</span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Award size={16} className="text-blue-500" />
                    {doc.exp} Experience
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2">{doc.desc}</p>
                </div>

                <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-100">
                  <span className="text-blue-700 font-bold">
                    {doc.fees} <span className="text-xs text-slate-400 font-normal">/ Visit</span>
                  </span>

                  {doc.phone ? (
                    <a
                      href={`tel:${doc.phone}`}
                      className="flex items-center gap-2 bg-green-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-700 transition"
                    >
                      <Phone size={14} />
                      {doc.phone}
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400 italic">No contact</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredDoctors.length === 0 && (
          <div className="text-center py-20 text-slate-400">
            No doctors found for "{search}"
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorPage;
