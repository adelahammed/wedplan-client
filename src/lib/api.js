import {
  MOCK_SERVICES,
  MOCK_CATEGORIES,
  MOCK_USERS,
  MOCK_BOOKINGS,
  MOCK_TRANSACTIONS,
  MOCK_TIPS
} from "./mock-data";

function getStorage(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setStorage(key, value) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

const sleep = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchServices(filters = {}) {
  await sleep(400);
  let list = getStorage("wedplan_services", MOCK_SERVICES);

  if (filters.category && filters.category !== "All") {
    list = list.filter((s) => s.category.toLowerCase() === filters.category.toLowerCase());
  }

  if (filters.search) {
    const query = filters.search.toLowerCase().trim();
    list = list.filter(
      (s) =>
        s.name.toLowerCase().includes(query) ||
        s.location.toLowerCase().includes(query) ||
        s.category.toLowerCase().includes(query)
    );
  }

  if (filters.location && filters.location !== "All") {
    list = list.filter((s) => s.location.toLowerCase().includes(filters.location.toLowerCase()));
  }

  if (filters.status) {
    list = list.filter((s) => s.status.toLowerCase() === filters.status.toLowerCase());
  }

  return list;
}

export async function fetchServiceById(id) {
  await sleep(350);
  const list = getStorage("wedplan_services", MOCK_SERVICES);
  return list.find((s) => String(s.id) === String(id)) || null;
}

export async function createService(serviceData) {
  await sleep(600);
  const list = getStorage("wedplan_services", MOCK_SERVICES);
  const newService = {
    ...serviceData,
    id: `srv-${Date.now()}`,
    price: serviceData.price.startsWith("$") ? serviceData.price : `$${serviceData.price}`,
    priceNum: Number(String(serviceData.price).replace(/[^0-9]/g, "")) || 1000,
    rating: 5.0,
    reviewsCount: 1,
    features: serviceData.features || ["Dedicated wedding support", "Professional coordination"],
    status: "Pending",
    isActive: true,
    createdDate: new Date().toISOString().split("T")[0]
  };
  const updated = [newService, ...list];
  setStorage("wedplan_services", updated);
  return newService;
}

export async function updateService(id, updates) {
  await sleep(400);
  const list = getStorage("wedplan_services", MOCK_SERVICES);
  const updated = list.map((s) => (String(s.id) === String(id) ? { ...s, ...updates } : s));
  setStorage("wedplan_services", updated);
  return updated.find((s) => String(s.id) === String(id));
}

export async function deleteService(id) {
  await sleep(400);
  const list = getStorage("wedplan_services", MOCK_SERVICES);
  const updated = list.filter((s) => String(s.id) !== String(id));
  setStorage("wedplan_services", updated);
  return true;
}

export async function fetchUsers() {
  await sleep(350);
  return getStorage("wedplan_users", MOCK_USERS);
}

export async function fetchUserById(id) {
  await sleep(300);
  const list = getStorage("wedplan_users", MOCK_USERS);
  return list.find((u) => String(u.id) === String(id)) || null;
}

export async function updateUserStatus(id, status) {
  await sleep(300);
  const list = getStorage("wedplan_users", MOCK_USERS);
  const updated = list.map((u) => (String(u.id) === String(id) ? { ...u, status } : u));
  setStorage("wedplan_users", updated);
  return updated.find((u) => String(u.id) === String(id));
}

export async function deleteUser(id) {
  await sleep(350);
  const list = getStorage("wedplan_users", MOCK_USERS);
  const updated = list.filter((u) => String(u.id) !== String(id));
  setStorage("wedplan_users", updated);
  return true;
}

export async function fetchBookings(role = "Customer", userIdentifier = "") {
  await sleep(350);
  let list = getStorage("wedplan_bookings", MOCK_BOOKINGS);
  if (role === "Customer" && userIdentifier) {
    list = list.filter((b) => b.customerEmail === userIdentifier || b.customerName === userIdentifier);
  }
  return list;
}

export async function createBooking(bookingData) {
  await sleep(650);
  const list = getStorage("wedplan_bookings", MOCK_BOOKINGS);
  const newBooking = {
    ...bookingData,
    id: `bk-${Date.now()}`,
    status: "Pending",
    requestDate: new Date().toISOString().split("T")[0]
  };
  const updated = [newBooking, ...list];
  setStorage("wedplan_bookings", updated);
  return newBooking;
}

export async function updateBookingStatus(id, status) {
  await sleep(400);
  const list = getStorage("wedplan_bookings", MOCK_BOOKINGS);
  const updated = list.map((b) => (String(b.id) === String(id) ? { ...b, status } : b));
  setStorage("wedplan_bookings", updated);
  return updated.find((b) => String(b.id) === String(id));
}

export async function fetchTransactions() {
  await sleep(300);
  return getStorage("wedplan_transactions", MOCK_TRANSACTIONS);
}

export async function processPayment(paymentInfo) {
  await sleep(800);
  const txns = getStorage("wedplan_transactions", MOCK_TRANSACTIONS);
  const newTxn = {
    id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
    vendorName: paymentInfo.vendorName || "Wedding Vendor Partner",
    vendorEmail: paymentInfo.email || "vendor@wedplan.com",
    subscriptionPlan: paymentInfo.plan || "Premium Plan",
    paymentAmount: paymentInfo.amount || "$49.00",
    paymentStatus: "Completed",
    transactionDate: new Date().toISOString().split("T")[0]
  };
  setStorage("wedplan_transactions", [newTxn, ...txns]);
  return newTxn;
}

export { MOCK_CATEGORIES, MOCK_TIPS };
