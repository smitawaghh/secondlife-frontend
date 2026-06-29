const KEY = "slf_user_v1";

// Demo accounts (frontend-only)
const USERS = [
  { email: "admin@slf.com", password: "Admin@123", role: "ADMIN", name: "Admin" },
  { email: "donor@slf.com", password: "Donor@123", role: "DONOR", name: "GreenMart Donor" },
  { email: "partner@slf.com", password: "Partner@123", role: "PARTNER", name: "FastCourier Partner" },
  { email: "receiver@slf.com", password: "Receiver@123", role: "RECEIVER", name: "Hope Shelter Receiver" },
];

export function getUser() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setUser(user) {
  localStorage.setItem(KEY, JSON.stringify(user));
}

export function logout() {
  localStorage.removeItem(KEY);
}

export function authenticate({ email, password, role }) {
  const u = USERS.find(
    (x) =>
      x.email.toLowerCase() === String(email || "").toLowerCase().trim() &&
      x.password === String(password || "") &&
      x.role === role
  );

  if (!u) {
    throw new Error("Invalid credentials for selected role.");
  }

  setUser({ name: u.name, email: u.email, role: u.role });
  return { name: u.name, email: u.email, role: u.role };
}

export function getDemoAccounts() {
  return USERS.map(({ email, password, role, name }) => ({ email, password, role, name }));
}

