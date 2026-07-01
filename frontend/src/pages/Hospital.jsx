import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from '../pages/Navbar'

const StarIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="#f59e0b" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);
const ClockIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" /><polyline points="12,6 12,12 16,14" />
  </svg>
);
const MailIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
  </svg>
);
const PhoneIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.82a19.79 19.79 0 01-3.07-8.68A2 2 0 012.18 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.15a16 16 0 006.94 6.94l1.52-1.52a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
  </svg>
);
const MapIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

function InfoRow({ icon, children, color }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "7px", fontSize: "13px", color: color || "var(--color-text-secondary)", lineHeight: 1.4 }}>
      <span style={{ marginTop: "1px", flexShrink: 0 }}>{icon}</span>
      <span style={{ flex: 1 }}>{children}</span>
    </div>
  );
}

function HospitalCard({ hospital }) {
  const isAllDay = hospital.openingTime === "24 Hours";
  return (
    <div>
      <Navbar/>
    <div
      style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", overflow: "hidden", display: "flex", flexDirection: "column", transition: "border-color 0.2s ease, transform 0.15s ease" }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--color-border-secondary)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--color-border-tertiary)"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      <div style={{ position: "relative", height: "160px", overflow: "hidden", background: "var(--color-background-secondary)" }}>
        <img
          src={hospital.image || "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&h=200&fit=crop"}
          alt={hospital.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div style={{ position: "absolute", top: "10px", left: "10px", background: "rgba(0,0,0,0.55)", color: "#fff", fontSize: "11px", fontWeight: 500, padding: "3px 8px", borderRadius: "20px" }}>
          {hospital.speciality || hospital.description || "Hospital"}
        </div>
        {hospital.rating && (
          <div style={{ position: "absolute", top: "10px", right: "10px", background: "rgba(0,0,0,0.55)", color: "#f59e0b", fontSize: "12px", fontWeight: 500, padding: "3px 8px", borderRadius: "20px", display: "flex", alignItems: "center", gap: "4px" }}>
            <StarIcon /> {hospital.rating}
          </div>
        )}
      </div>

      <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 500, color: "var(--color-text-primary)", lineHeight: 1.3 }}>
          {hospital.name}
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
          <InfoRow icon={<ClockIcon />} color={isAllDay ? "#16a34a" : "var(--color-text-secondary)"}>
            {isAllDay
              ? <span style={{ color: "#16a34a", fontWeight: 500 }}>Open 24 Hours</span>
              : <span>{hospital.openingTime || "09:00 AM"} – {hospital.closingTime || "06:00 PM"}</span>
            }
          </InfoRow>
          <InfoRow icon={<MailIcon />}>
            <a href={`mailto:${hospital.email}`} style={{ color: "var(--color-text-info)", textDecoration: "none", wordBreak: "break-all" }}>
              {hospital.email}
            </a>
          </InfoRow>
          <InfoRow icon={<PhoneIcon />}>
            <a href={`tel:${hospital.phone}`} style={{ color: "var(--color-text-primary)", textDecoration: "none" }}>
              {hospital.phone}
            </a>
          </InfoRow>
          <InfoRow icon={<MapIcon />}>
            {hospital.address}{hospital.city ? `, ${hospital.city}` : ""}
          </InfoRow>
        </div>

        <div style={{ marginTop: "auto", paddingTop: "4px" }}>
          <Link
            to="/booking"
            state={{ hospitalName: hospital.name, hospitalEmail: hospital.email }}
            style={{ display: "block", width: "100%", textAlign: "center", padding: "9px 0", background: "var(--color-background-info)", color: "var(--color-text-info)", borderRadius: "var(--border-radius-md)", border: "0.5px solid var(--color-border-info)", fontSize: "14px", fontWeight: 500, textDecoration: "none", transition: "opacity 0.15s ease", boxSizing: "border-box" }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            Book Appointment
          </Link>
        </div>
      </div>
    </div>
    </div>
  );
}

export default function HospitalPage() {
  const [search, setSearch] = useState("");
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const res = await fetch("https://healthtech-backend-m2dv.onrender.com/api/hospitals");
        const data = await res.json();
        setHospitals(data);
      } catch {
        setError("Hospitals load nahi ho paye. Server check karo.");
      } finally {
        setLoading(false);
      }
    };
    fetchHospitals();
  }, []);

  const filtered = hospitals.filter(h =>
    h.name?.toLowerCase().includes(search.toLowerCase()) ||
    h.address?.toLowerCase().includes(search.toLowerCase()) ||
    h.city?.toLowerCase().includes(search.toLowerCase()) ||
    h.speciality?.toLowerCase().includes(search.toLowerCase()) ||
    h.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh",paddingTop:50, background: "var(--color-background-tertiary)", fontFamily: "var(--font-sans)" }}>
      <div style={{ background: "var(--color-background-primary)", borderBottom: "0.5px solid var(--color-border-tertiary)", padding: "24px 24px 20px", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h1 style={{ margin: "0 0 4px", fontSize: "30px", fontWeight: 800, color: "var(--color-text-primary)" }}>Trusted Hospitals</h1>
          <p style={{ margin: "0 0 16px", fontSize: "15px", color: "var(--color-text-secondary)" }}>Search by Name , Location</p>
          <div style={{ position: "relative", maxWidth: "480px" }}>
            <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-secondary)", display: "flex", alignItems: "center" }}>
              <SearchIcon />
            </span>
            <input
              type="text"
              placeholder="Search hospitals..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: "100%", padding: "10px 14px 10px 40px", fontSize: "14px", borderRadius: "var(--border-radius-md)", border: "1px solid var(--color-border-secondary)", background: "var(--color-background-secondary)", color: "var(--color-text-primary)", outline: "none", boxSizing: "border-box" }}
              onFocus={e => e.target.style.borderColor = "var(--color-border-primary)"}
              onBlur={e => e.target.style.borderColor = "var(--color-border-secondary)"}
            />
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "24px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--color-text-secondary)", fontSize: "15px" }}>Loading hospitals...</div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "red", fontSize: "15px" }}>{error}</div>
        ) : (
          <>
            <p style={{ margin: "0 0 16px", fontSize: "13px", color: "var(--color-text-secondary)" }}>
              {filtered.length} hospital{filtered.length !== 1 ? "s" : ""} found{search && ` for "${search}"`}
            </p>
            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--color-text-secondary)", fontSize: "15px" }}>No hospitals found. Try a different search.</div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
                {filtered.map(h => <HospitalCard key={h._id} hospital={h} />)}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
