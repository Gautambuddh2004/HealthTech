import { Link } from "react-router-dom";

const routeMap = {
  Hospitals: "/hospitals",
  "Booking/Appointment": "/booking",
  Doctors: "/doctors",
  "Notifications": "/notification",
};

const iconMap = {
  Hospitals: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 22V12h6v10M12 6v6M9 9h6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  "Booking/Appointment": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="16" y1="2" x2="16" y2="6" strokeLinecap="round"/>
      <line x1="8" y1="2" x2="8" y2="6" strokeLinecap="round"/>
      <line x1="3" y1="10" x2="21" y2="10" strokeLinecap="round"/>
      <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" strokeLinecap="round" strokeWidth="2.5"/>
    </svg>
  ),
  Doctors: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 11s1 1 1 3-1 3-1 3M17 14h2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Notifications: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

const subtitleMap = {
  Hospitals: "Find nearby & top-rated",
  "Booking/Appointment": "Schedule your visit",
  Doctors: "Browse specialists",
  Notifications: "Stay up to date",
};

const accentMap = {
  Hospitals: { bg: "#EFF6FF", accent: "#2563EB", light: "#DBEAFE" },
  "Booking/Appointment": { bg: "#F0FDF4", accent: "#16A34A", light: "#DCFCE7" },
  Doctors: { bg: "#FFF7ED", accent: "#EA580C", light: "#FFEDD5" },
  Notifications: { bg: "#FAF5FF", accent: "#9333EA", light: "#F3E8FF" },
};

export default function Card() {
  const categories = Object.keys(routeMap);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Sora:wght@600;700&display=swap');

        .nav-card-wrapper {
          font-family: 'DM Sans', sans-serif;
          padding: 2.5rem 1.5rem;
          display: flex;
          justify-content: center;
        }

        .nav-cards-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          max-width: 700px;
          width: 100%;
        }

        @media (min-width: 768px) {
          .nav-cards-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 1.25rem;
          }
        }

        .nav-card-link {
          text-decoration: none;
          display: block;
          border-radius: 20px;
          padding: 1.5rem 1rem 1.25rem;
          background: #ffffff;
          border: 1.5px solid #f0f0f0;
          box-shadow: 0 2px 12px rgba(0,0,0,0.05);
          transition: all 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
          cursor: pointer;
        }

        .nav-card-link::before {
          content: '';
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 0.28s ease;
          border-radius: 20px;
        }

        .nav-card-link:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 12px 32px rgba(0,0,0,0.12);
          border-color: transparent;
        }

        .nav-card-link:hover::before {
          opacity: 1;
        }

        .card-icon-wrap {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
          transition: transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .nav-card-link:hover .card-icon-wrap {
          transform: scale(1.12) rotate(-4deg);
        }

        .card-title {
          font-family: 'Sora', sans-serif;
          font-size: 0.875rem;
          font-weight: 700;
          color: #111827;
          margin: 0 0 0.2rem;
          line-height: 1.3;
          transition: color 0.2s;
        }

        .card-subtitle {
          font-size: 0.72rem;
          color: #9CA3AF;
          margin: 0;
          font-weight: 500;
          letter-spacing: 0.01em;
          transition: color 0.2s;
        }

        .nav-card-link:hover .card-title,
        .nav-card-link:hover .card-subtitle {
          color: inherit;
        }

        .card-arrow {
          position: absolute;
          right: 14px;
          bottom: 14px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transform: translate(-4px, 4px);
          transition: all 0.25s ease;
        }

        .nav-card-link:hover .card-arrow {
          opacity: 1;
          transform: translate(0, 0);
        }
      `}</style>

      <div className="nav-card-wrapper">
        <div className="nav-cards-grid">
          {categories.map((cat) => {
            const colors = accentMap[cat];
            return (
              <Link
                key={cat}
                to={routeMap[cat]}
                className="nav-card-link"
                style={{
                  "--hover-bg": colors.bg,
                  "--hover-accent": colors.accent,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = colors.bg;
                  e.currentTarget.style.borderColor = colors.light;
                  e.currentTarget.querySelector(".card-title").style.color = colors.accent;
                  e.currentTarget.querySelector(".card-subtitle").style.color = colors.accent + "99";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#ffffff";
                  e.currentTarget.style.borderColor = "#f0f0f0";
                  e.currentTarget.querySelector(".card-title").style.color = "#111827";
                  e.currentTarget.querySelector(".card-subtitle").style.color = "#9CA3AF";
                }}
              >
                {/* Icon */}
                <div
                  className="card-icon-wrap"
                  style={{ background: colors.light, color: colors.accent }}
                >
                  {iconMap[cat]}
                </div>

                {/* Text */}
                <p className="card-title">{cat}</p>
                <p className="card-subtitle">{subtitleMap[cat]}</p>

                {/* Arrow */}
                <div
                  className="card-arrow"
                  style={{ background: colors.accent, color: "#fff" }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 9.5l7-7M9.5 9.5V2.5H2.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
