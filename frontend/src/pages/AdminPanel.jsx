import { useState, useEffect } from "react";
import {
  Trash2, PlusCircle, UserCheck, X, ChevronDown,
  Building2, Stethoscope, LogOut, LayoutDashboard, Menu
} from "lucide-react";
import Navbar from "./Navbar";



// Constants 
const SPECIALTIES = [
  "Cardiologist","Neurologist","Orthopedic","Dermatologist","Pediatrician",
  "Gynecologist","Dentist","Psychiatrist","Ophthalmologist","ENT Specialist",
  "General Physician","Urologist","Surgeon"
];

const emptyDoctor = { name:"",spec:"",hospital:"",location:"",exp:"",fees:"",rating:"4.5",phone:"",img:"",desc:"" };
const emptyHospital = { name:"",email:"",password:"",phone:"",address:"",city:"",speciality:"",openingTime:"",closingTime:"",image:"",rating:"" };

// Shared Field Component 
const Field = ({ label, value, onChange, placeholder, type="text", error, colSpan="" }) => (
  <div className={colSpan}>
    <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#94a3b8", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.07em" }}>{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={{
        width:"100%", padding:"10px 14px", borderRadius:10,
        border: error ? "1.5px solid #f87171" : "1.5px solid #e2e8f0",
        background: error ? "#fff5f5" : "#f8fafc",
        fontSize:13, color:"#334155", outline:"none",
        transition:"border 0.2s", boxSizing:"border-box"
      }}
      onFocus={e => e.target.style.border="1.5px solid #38bdf8"}
      onBlur={e => e.target.style.border=error?"1.5px solid #f87171":"1.5px solid #e2e8f0"}
    />
    {error && <p style={{ fontSize:11, color:"#ef4444", marginTop:4 }}>{error}</p>}
  </div>
);

// Hospital Panel 
const HospitalPanel = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [hospitals, setHospitals] = useState([]);
  const [form, setForm] = useState(emptyHospital);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) setIsLoggedIn(true);
  }, []);

  const fetchHospitals = async () => {
    try {
      const res = await fetch("https://healthtech-backend-m2dv.onrender.com/api/hospitals");
      const data = await res.json();
      setHospitals(data);
    } catch {
      setErrorMsg("Hospitals fetch karne mein error aaya!");
    }
  };

  useEffect(() => {
    if (isLoggedIn) fetchHospitals();
  }, [isLoggedIn]);

  const handleLogin = async () => {
    setPasswordError("");
    try {
      const res = await fetch("https://healthtech-backend-m2dv.onrender.com/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwordInput }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem("adminToken", data.token);
        setIsLoggedIn(true);
        setPasswordInput("");
      } else {
        setPasswordError(data.message || "Wrong password! Try again.");
      }
    } catch {
      setPasswordError("Server se connect nahi ho pa raha!");
    }
  };

  const handleLogout = () => { localStorage.removeItem("adminToken"); setIsLoggedIn(false); };

  const handleAddHospital = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg(""); setErrorMsg("");
    const token = localStorage.getItem("adminToken");
    try {
      const res = await fetch("https://healthtech-backend-m2dv.onrender.com/api/admin/hospitals", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ ...form }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMsg("Hospital successfully add ho gaya!");
        setForm(emptyHospital);
        setShowForm(false);
        fetchHospitals();
        setTimeout(() => setSuccessMsg(""), 3000);
      } else if (res.status === 401 || res.status === 403) {
        handleLogout();
        setPasswordError("Session expire ho gaya. Dobara login karein.");
      } else {
        setErrorMsg(data.message || "Kuch error aaya!");
      }
    } catch {
      setErrorMsg("Server se connect nahi ho pa raha!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Sure ho? Yeh hospital delete ho jaayega!")) return;
    const token = localStorage.getItem("adminToken");
    try {
      const res = await fetch(`https://healthtech-backend-m2dv.onrender.com/api/admin/hospitals/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      });
      if (res.ok) {
        setSuccessMsg("Hospital delete ho gaya!");
        fetchHospitals();
        setTimeout(() => setSuccessMsg(""), 3000);
      } else if (res.status === 401 || res.status === 403) {
        handleLogout();
        setPasswordError("Session expire ho gaya. Dobara login karein.");
      }
    } catch {
      setErrorMsg("Delete karne mein error aaya!");
    }
  };

  if (!isLoggedIn) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"60vh" }}>
      <div style={{ background:"white", borderRadius:20, padding:"40px 32px", width:"100%", maxWidth:380, boxShadow:"0 8px 32px rgba(14,165,233,0.10)" }}>
        <div style={{ textAlign:"center", marginBottom:24 }}>
          <div style={{ width:52, height:52, borderRadius:14, background:"linear-gradient(135deg,#38bdf8,#0ea5e9)", display:"inline-flex", alignItems:"center", justifyContent:"center", marginBottom:12 }}>
            <Building2 size={24} color="white" />
          </div>
          <h2 style={{ fontSize:20, fontWeight:800, color:"#0f172a", margin:0 }}>Admin Login</h2>
          <p style={{ fontSize:13, color:"#94a3b8", marginTop:4 }}>Hospital management ke liye login karein</p>
        </div>
        <input
          type="password" placeholder="Admin password"
          value={passwordInput}
          onChange={e => setPasswordInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleLogin()}
          style={{ width:"100%", padding:"12px 14px", borderRadius:10, border:"1.5px solid #e2e8f0", fontSize:14, marginBottom:8, boxSizing:"border-box", outline:"none" }}
        />
        {passwordError && <p style={{ color:"#ef4444", fontSize:12, marginBottom:8 }}>{passwordError}</p>}
        <button onClick={handleLogin}
          style={{ width:"100%", padding:"12px", borderRadius:10, background:"linear-gradient(135deg,#38bdf8,#0ea5e9)", color:"white", fontWeight:700, fontSize:14, border:"none", cursor:"pointer" }}>
          Login
        </button>
      </div>
    </div>
  );

  return (

    <div>
      <Navbar/>
      {/* Top bar */}
      <div style={{ display:"flex",paddingTop:50, justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <div>
          <p style={{ fontSize:11, fontWeight:800, color:"#38bdf8", textTransform:"uppercase", letterSpacing:"0.1em", margin:0 }}>Hospital Management</p>
          <h2 style={{ fontSize:22, fontWeight:800, color:"#0f172a", margin:"4px 0 0" }}>{hospitals.length} Hospitals Registered</h2>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={() => setShowForm(p=>!p)}
            style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 18px", borderRadius:10, background: showForm?"#f1f5f9":"linear-gradient(135deg,#38bdf8,#0ea5e9)", color: showForm?"#64748b":"white", fontWeight:700, fontSize:13, border: showForm?"1.5px solid #e2e8f0":"none", cursor:"pointer" }}>
            {showForm ? <X size={15}/> : <PlusCircle size={15}/>}
            {showForm ? "Cancel" : "Add Hospital"}
          </button>
          <button onClick={handleLogout}
            style={{ display:"flex", alignItems:"center", gap:6, padding:"10px 14px", borderRadius:10, background:"#fff1f2", color:"#f43f5e", fontWeight:700, fontSize:13, border:"none", cursor:"pointer" }}>
            <LogOut size={14}/> Logout
          </button>
        </div>
      </div>

      {successMsg && <div style={{ background:"#f0fdf4", border:"1.5px solid #bbf7d0", color:"#16a34a", borderRadius:10, padding:"12px 16px", marginBottom:16, fontSize:13, fontWeight:600 }}>✓ {successMsg}</div>}
      {errorMsg && <div style={{ background:"#fff1f2", border:"1.5px solid #fecdd3", color:"#f43f5e", borderRadius:10, padding:"12px 16px", marginBottom:16, fontSize:13, fontWeight:600 }}>⚠ {errorMsg}</div>}

      {/* Add Form */}
      {showForm && (
        <div style={{ background:"white", borderRadius:18, padding:28, marginBottom:24, boxShadow:"0 4px 24px rgba(14,165,233,0.08)", border:"1px solid #e2e8f0" }}>
          <h3 style={{ fontSize:16, fontWeight:800, color:"#0f172a", marginBottom:20 }}>➕ Naya Hospital Add Karein</h3>
          <form onSubmit={handleAddHospital}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
              <Field label="Hospital Name *" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="Apollo Hospital" />
              <Field label="Email *" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} placeholder="hospital@gmail.com" type="email" />
              <Field label="Password *" value={form.password} onChange={e=>setForm(p=>({...p,password:e.target.value}))} placeholder="Login password" type="password" />
              <Field label="Phone *" value={form.phone} onChange={e=>setForm(p=>({...p,phone:e.target.value}))} placeholder="+91 98765 43210" />
              <Field label="City *" value={form.city} onChange={e=>setForm(p=>({...p,city:e.target.value}))} placeholder="Lucknow" />
              <Field label="Speciality *" value={form.speciality} onChange={e=>setForm(p=>({...p,speciality:e.target.value}))} placeholder="Cardiology & Surgery" />
              <Field label="Opening Time" value={form.openingTime} onChange={e=>setForm(p=>({...p,openingTime:e.target.value}))} placeholder="08:00 AM" />
              <Field label="Closing Time" value={form.closingTime} onChange={e=>setForm(p=>({...p,closingTime:e.target.value}))} placeholder="10:00 PM" />
              <Field label="Rating (1-5)" value={form.rating} onChange={e=>setForm(p=>({...p,rating:e.target.value}))} placeholder="4.5" type="number" />
              <div style={{ gridColumn:"1/-1" }}>
                <Field label="Address *" value={form.address} onChange={e=>setForm(p=>({...p,address:e.target.value}))} placeholder="Full address" />
              </div>
              <div style={{ gridColumn:"1/-1" }}>
                <Field label="Image URL" value={form.image} onChange={e=>setForm(p=>({...p,image:e.target.value}))} placeholder="https://images.unsplash.com/..." />
              </div>
            </div>
            <div style={{ marginTop:20, display:"flex", justifyContent:"flex-end" }}>
              <button type="submit" disabled={loading}
                style={{ padding:"11px 28px", borderRadius:10, background:"linear-gradient(135deg,#38bdf8,#0ea5e9)", color:"white", fontWeight:700, fontSize:13, border:"none", cursor:"pointer", opacity:loading?0.7:1 }}>
                {loading ? "Adding..." : "Add Hospital"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div style={{ background:"white", borderRadius:18, overflow:"hidden", boxShadow:"0 4px 24px rgba(14,165,233,0.06)", border:"1px solid #e2e8f0" }}>
        <div style={{ padding:"16px 24px", borderBottom:"1px solid #f1f5f9" }}>
          <h3 style={{ fontSize:14, fontWeight:700, color:"#475569", margin:0 }}>All Hospitals</h3>
        </div>
        {hospitals.length === 0 ? (
          <div style={{ padding:60, textAlign:"center", color:"#94a3b8" }}>
            <Building2 size={36} style={{ opacity:0.2, display:"block", margin:"0 auto 10px" }} />
            Koi hospital nahi mila.
          </div>
        ) : (
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
            <thead>
              <tr style={{ background:"#f8fafc" }}>
                {["Name","Email","City","Speciality","Action"].map(h => (
                  <th key={h} style={{ padding:"12px 16px", textAlign:"left", fontSize:11, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.06em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hospitals.map(h => (
                <tr key={h._id} style={{ borderTop:"1px solid #f1f5f9" }}
                  onMouseEnter={e=>e.currentTarget.style.background="#f8fafc"}
                  onMouseLeave={e=>e.currentTarget.style.background="white"}>
                  <td style={{ padding:"13px 16px", fontWeight:600, color:"#0f172a" }}>{h.name}</td>
                  <td style={{ padding:"13px 16px", color:"#64748b" }}>{h.email}</td>
                  <td style={{ padding:"13px 16px", color:"#64748b" }}>{h.city}</td>
                  <td style={{ padding:"13px 16px", color:"#64748b" }}>{h.speciality || "—"}</td>
                  <td style={{ padding:"13px 16px" }}>
                    <button onClick={()=>handleDelete(h._id)}
                      style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"6px 12px", borderRadius:8, border:"1.5px solid #fecdd3", color:"#f43f5e", background:"#fff1f2", fontSize:12, fontWeight:600, cursor:"pointer" }}>
                      <Trash2 size={12}/> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

// Doctor Panel 
const DoctorPanel = () => {
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState(emptyDoctor);
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchDoctors = async () => {
    try {
      const res = await fetch("https://healthtech-backend-m2dv.onrender.com/api/doctors");
      const data = await res.json();
      setDoctors(data);
    } catch {
      setErrorMsg("Doctors fetch karne mein error aaya!");
    }
  };

  useEffect(() => { fetchDoctors(); }, []);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name required";
    if (!form.spec) errs.spec = "Specialty required";
    if (!form.hospital.trim()) errs.hospital = "Hospital required";
    if (!form.location.trim()) errs.location = "Location required";
    if (!form.fees.trim()) errs.fees = "Fees required";
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true); setErrorMsg("");
    const token = localStorage.getItem("adminToken");
    try {
      const res = await fetch("https://healthtech-backend-m2dv.onrender.com/api/admin/doctors", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({
          name: form.name,
          specialty: form.spec,
          hospital: form.hospital,
          location: form.location,
          experience: form.exp,
          fees: form.fees,
          rating: parseFloat(form.rating) || 4.5,
          phone: form.phone,
          image: form.img || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80",
          desc: form.desc,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setForm(emptyDoctor); setErrors({}); setShowForm(false);
        setSuccessMsg("Doctor successfully add ho gaya!");
        fetchDoctors();
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        setErrorMsg(data.message || "Kuch error aaya!");
      }
    } catch {
      setErrorMsg("Server se connect nahi ho pa raha!");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDoctor = async (id) => {
    if (!window.confirm("Sure ho? Yeh doctor delete ho jaayega!")) return;
    const token = localStorage.getItem("adminToken");
    try {
      const res = await fetch(`https://healthtech-backend-m2dv.onrender.com/api/admin/doctors/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      });
      if (res.ok) {
        setSuccessMsg("Doctor delete ho gaya!");
        fetchDoctors();
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        setErrorMsg("Delete karne mein error aaya!");
      }
    } catch {
      setErrorMsg("Server se connect nahi ho pa raha!");
    }
  };

  return (
    <div>
      <Navbar/>
      <div style={{ display:"flex",paddingTop:50, justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <div>
          <p style={{ fontSize:11, fontWeight:800, color:"#818cf8", textTransform:"uppercase", letterSpacing:"0.1em", margin:0 }}>Doctor Management</p>
          <h2 style={{ fontSize:22, fontWeight:800, color:"#0f172a", margin:"4px 0 0" }}>{doctors.length} Doctors Registered</h2>
        </div>
        <button onClick={()=>setShowForm(p=>!p)}
          style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 18px", borderRadius:10, background:showForm?"#f1f5f9":"linear-gradient(135deg,#818cf8,#6366f1)", color:showForm?"#64748b":"white", fontWeight:700, fontSize:13, border:showForm?"1.5px solid #e2e8f0":"none", cursor:"pointer" }}>
          {showForm ? <X size={15}/> : <PlusCircle size={15}/>}
          {showForm ? "Cancel" : "Add Doctor"}
        </button>
      </div>

      {successMsg && <div style={{ background:"#f0fdf4", border:"1.5px solid #bbf7d0", color:"#16a34a", borderRadius:10, padding:"12px 16px", marginBottom:16, fontSize:13, fontWeight:600 }}>✓ {successMsg}</div>}

      {showForm && (
        <div style={{ background:"white", borderRadius:18, padding:28, marginBottom:24, boxShadow:"0 4px 24px rgba(99,102,241,0.08)", border:"1px solid #e2e8f0" }}>
          <h3 style={{ fontSize:16, fontWeight:800, color:"#0f172a", marginBottom:20 }}>➕ Naya Doctor Add Karein</h3>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            <Field label="Full Name *" value={form.name} onChange={e=>{setForm(p=>({...p,name:e.target.value}));setErrors(p=>({...p,name:""}))}} placeholder="Dr. Ravi Sharma" error={errors.name} />

            {/* Specialty dropdown */}
            <div>
              <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#94a3b8", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.07em" }}>Specialty *</label>
              <div style={{ position:"relative" }}>
                <select value={form.spec} onChange={e=>{setForm(p=>({...p,spec:e.target.value}));setErrors(p=>({...p,spec:""}))}}
                  style={{ width:"100%", padding:"10px 36px 10px 14px", borderRadius:10, border:errors.spec?"1.5px solid #f87171":"1.5px solid #e2e8f0", background:"#f8fafc", fontSize:13, color:"#334155", outline:"none", appearance:"none", boxSizing:"border-box" }}>
                  <option value="">Select specialty...</option>
                  {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <ChevronDown size={14} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", color:"#94a3b8", pointerEvents:"none" }} />
              </div>
              {errors.spec && <p style={{ fontSize:11, color:"#ef4444", marginTop:4 }}>{errors.spec}</p>}
            </div>

            <Field label="Hospital Name *" value={form.hospital} onChange={e=>{setForm(p=>({...p,hospital:e.target.value}));setErrors(p=>({...p,hospital:""}))}} placeholder="AIIMS Delhi" error={errors.hospital} />
            <Field label="Location *" value={form.location} onChange={e=>{setForm(p=>({...p,location:e.target.value}));setErrors(p=>({...p,location:""}))}} placeholder="New Delhi" error={errors.location} />
            <Field label="Experience" value={form.exp} onChange={e=>setForm(p=>({...p,exp:e.target.value}))} placeholder="10 years" />
            <Field label="Consultation Fees *" value={form.fees} onChange={e=>{setForm(p=>({...p,fees:e.target.value}));setErrors(p=>({...p,fees:""}))}} placeholder="₹1,000" error={errors.fees} />
            <Field label="Rating (0-5)" value={form.rating} onChange={e=>setForm(p=>({...p,rating:e.target.value}))} placeholder="4.5" type="number" />
            <Field label="Phone Number" value={form.phone} onChange={e=>setForm(p=>({...p,phone:e.target.value}))} placeholder="+91 98765 43210" />
            <Field label="Photo URL" value={form.img} onChange={e=>setForm(p=>({...p,img:e.target.value}))} placeholder="https://..." />
            <div style={{ gridColumn:"1/-1" }}>
              <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#94a3b8", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.07em" }}>Description</label>
              <textarea rows={3} placeholder="Doctor ke baare mein brief description..."
                value={form.desc} onChange={e=>setForm(p=>({...p,desc:e.target.value}))}
                style={{ width:"100%", padding:"10px 14px", borderRadius:10, border:"1.5px solid #e2e8f0", background:"#f8fafc", fontSize:13, color:"#334155", outline:"none", resize:"none", boxSizing:"border-box" }} />
            </div>
          </div>
          <div style={{ marginTop:20, display:"flex", justifyContent:"flex-end", gap:10 }}>
            <button onClick={()=>{setForm(emptyDoctor);setErrors({});setShowForm(false)}}
              style={{ padding:"10px 20px", borderRadius:10, border:"1.5px solid #e2e8f0", color:"#64748b", background:"white", fontSize:13, fontWeight:600, cursor:"pointer" }}>Cancel</button>
            <button onClick={handleSubmit} disabled={loading}
              style={{ padding:"10px 24px", borderRadius:10, background:"linear-gradient(135deg,#818cf8,#6366f1)", color:"white", fontWeight:700, fontSize:13, border:"none", cursor:"pointer", opacity:loading?0.7:1 }}>{loading ? "Adding..." : "Add Doctor"}</button>
          </div>
        </div>
      )}

      {/* Doctors list */}
      <div style={{ background:"white", borderRadius:18, overflow:"hidden", boxShadow:"0 4px 24px rgba(99,102,241,0.06)", border:"1px solid #e2e8f0" }}>
        <div style={{ padding:"16px 24px", borderBottom:"1px solid #f1f5f9" }}>
          <h3 style={{ fontSize:14, fontWeight:700, color:"#475569", margin:0 }}>All Registered Doctors</h3>
        </div>
        {doctors.length === 0 ? (
          <div style={{ padding:60, textAlign:"center", color:"#94a3b8" }}>
            <UserCheck size={36} style={{ opacity:0.2, display:"block", margin:"0 auto 10px" }} />
            Koi doctor nahi mila.
          </div>
        ) : (
          <div>
            {doctors.map(doc => (
              <div key={doc._id || doc.id} style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 20px", borderTop:"1px solid #f1f5f9", transition:"background 0.15s" }}
                onMouseEnter={e=>e.currentTarget.style.background="#f8fafc"}
                onMouseLeave={e=>e.currentTarget.style.background="white"}>
                <img src={doc.image || doc.img || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80"} alt={doc.name} style={{ width:44, height:44, borderRadius:"50%", objectFit:"cover", border:"2px solid white", boxShadow:"0 2px 8px rgba(0,0,0,0.1)", flexShrink:0 }} />
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontWeight:700, color:"#0f172a", fontSize:13, margin:0, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{doc.name}</p>
                  <p style={{ fontSize:11, color:"#94a3b8", margin:"2px 0 0" }}>{doc.specialty || doc.spec} · {doc.hospital}</p>
                </div>
                <div style={{ fontSize:11, color:"#94a3b8", minWidth:100 }}>📍 {doc.location}</div>
                <div style={{ fontWeight:700, color:"#6366f1", fontSize:13, minWidth:70, textAlign:"right" }}>{doc.fees}</div>
                <button onClick={()=>handleDeleteDoctor(doc._id || doc.id)}
                  style={{ display:"flex", alignItems:"center", gap:5, padding:"6px 12px", borderRadius:8, border:"1.5px solid #fecdd3", color:"#f43f5e", background:"#fff1f2", fontSize:12, fontWeight:600, cursor:"pointer" }}>
                  <Trash2 size={12}/> Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Main Dashboard 
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("hospitals");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { id:"hospitals", label:"Hospitals", icon: Building2, color:"#38bdf8", activeColor:"linear-gradient(135deg,#38bdf8,#0ea5e9)" },
    { id:"doctors",   label:"Doctors",   icon: Stethoscope, color:"#818cf8", activeColor:"linear-gradient(135deg,#818cf8,#6366f1)" },
  ];

  return (
    <>
      <div style={{ display:"flex", minHeight:"100vh", background:"#f1f5f9", fontFamily:"'Segoe UI', sans-serif" }}>

        {/* Sidebar */}
        <aside style={{
          width: sidebarOpen ? 220 : 64,
          background:"#0f172a",
          transition:"width 0.25s cubic-bezier(.4,0,.2,1)",
          flexShrink:0,
          display:"flex",
          flexDirection:"column",
          overflow:"hidden",
        }}>
          {/* Logo */}
          <div style={{ padding:"20px 16px 16px", display:"flex", alignItems:"center", gap:12, borderBottom:"1px solid #1e293b" }}>
            <div style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg,#38bdf8,#6366f1)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <LayoutDashboard size={18} color="white" />
            </div>
            {sidebarOpen && <span style={{ fontWeight:800, fontSize:15, color:"white", whiteSpace:"nowrap" }}>MedAdmin</span>}
          </div>

          {/* Toggle */}
          <button onClick={()=>setSidebarOpen(p=>!p)}
            style={{ margin:"12px 12px 4px", padding:8, borderRadius:8, background:"#1e293b", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent: sidebarOpen?"flex-end":"center" }}>
            <Menu size={16} color="#94a3b8" />
          </button>

          {/* Nav */}
          <nav style={{ padding:"8px 10px", flex:1 }}>
            {navItems.map(item => {
              const active = activeTab === item.id;
              return (
                <button key={item.id} onClick={()=>setActiveTab(item.id)}
                  style={{
                    width:"100%", display:"flex", alignItems:"center", gap:12,
                    padding:"11px 12px", borderRadius:10, marginBottom:4,
                    background: active ? item.activeColor : "transparent",
                    border:"none", cursor:"pointer",
                    transition:"background 0.2s",
                    justifyContent: sidebarOpen ? "flex-start" : "center",
                  }}
                  onMouseEnter={e=>{ if(!active) e.currentTarget.style.background="#1e293b" }}
                  onMouseLeave={e=>{ if(!active) e.currentTarget.style.background="transparent" }}>
                  <item.icon size={18} color={active?"white":item.color} style={{ flexShrink:0 }} />
                  {sidebarOpen && (
                    <span style={{ fontSize:13, fontWeight:600, color: active?"white":"#94a3b8", whiteSpace:"nowrap" }}>
                      {item.label}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Bottom */}
          {sidebarOpen && (
            <div style={{ padding:"12px 16px", borderTop:"1px solid #1e293b" }}>
              <p style={{ fontSize:10, color:"#475569", margin:0, textAlign:"center" }}>MedAdmin v1.0</p>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main style={{ flex:1, padding:"32px 28px", overflowY:"auto", minWidth:0 }}>
          {activeTab === "hospitals" && <HospitalPanel />}
          {activeTab === "doctors"   && <DoctorPanel />}
        </main>
      </div>
    </>
  );
}
