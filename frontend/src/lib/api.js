// api.js - Central place for all backend API calls
// Using this means if our backend URL ever changes,
// we only update it in one place

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Generic fetch helper with error handling
async function apiFetch(endpoint, options = {}) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

// ── NGO API calls ──
export const ngoAPI = {
  // Get all NGOs with optional filters
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/ngos${query ? `?${query}` : ""}`);
  },

  // Get single NGO by ID
  getById: (id) => apiFetch(`/ngos/${id}`),
};

// ── Emergency Contact API calls ──
export const emergencyAPI = {
  // Get all contacts for a user
  getContacts: (userId) => apiFetch(`/emergency-contacts/${userId}`),

  // Add a new contact
  addContact: (data) =>
    apiFetch("/emergency-contacts", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Delete a contact
  deleteContact: (id) =>
    apiFetch(`/emergency-contacts/${id}`, {
      method: "DELETE",
    }),
};
// ── Mentor API ──
export const mentorAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return apiFetch(`/mentors${query ? `?${query}` : ""}`)
  },
  getById: (id) => apiFetch(`/mentors/${id}`),
}

// ── Chat API ──
export const chatAPI = {
  // Send message history, get AI response back
  sendMessage: (messages) =>
    apiFetch("/chat", {
      method: "POST",
      body: JSON.stringify({ messages }),
    }),
};
// ── Evidence API ──
export const evidenceAPI = {
  getAll: (userId) => apiFetch(`/evidence/${userId}`),

  getFile: (id) => apiFetch(`/evidence/file/${id}`),

  upload: (data) => apiFetch("/evidence", {
    method: "POST",
    body: JSON.stringify(data),
  }),

  delete: (id) => apiFetch(`/evidence/${id}`, {
    method: "DELETE",
  }),
}
// ── Posts API ──
export const postAPI = {
  getAll:     (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return apiFetch(`/posts${query ? `?${query}` : ""}`)
  },
  create:     (data)       => apiFetch("/posts", { method: "POST", body: JSON.stringify(data) }),
  like:       (id, userId) => apiFetch(`/posts/${id}/like`, { method: "POST", body: JSON.stringify({ userId }) }),
  comment:    (id, data)   => apiFetch(`/posts/${id}/comments`, { method: "POST", body: JSON.stringify(data) }),
  deletePost: (id, userId) => apiFetch(`/posts/${id}`, { method: "DELETE", body: JSON.stringify({ userId }) }),
}

// ── Legal Aid API ──
export const legalAidAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return apiFetch(`/legal-aid${query ? `?${query}` : ""}`)
  },
}

// ── Child Safety API ──
export const childSafetyAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return apiFetch(`/child-safety${query ? `?${query}` : ""}`)
  },
}

// ── Police Directory API ──
export const policeAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return apiFetch(`/police${query ? `?${query}` : ""}`)
  },
}

// ── User Profile API ──
export const profileAPI = {
  get:    (uid)  => apiFetch(`/profile/${uid}`),
  upsert: (data) => apiFetch("/profile", { method: "POST", body: JSON.stringify(data) }),
}
// ── Mentor Requests API ──
export const mentorRequestAPI = {
  create:          (data) => apiFetch("/mentor-requests", { method: "POST", body: JSON.stringify(data) }),
  getUserRequests: (userId) => apiFetch(`/mentor-requests/user/${userId}`),
  updateStatus:    (id, data) => apiFetch(`/mentor-requests/${id}/status`, { method: "PATCH", body: JSON.stringify(data) }),
}
// ── Mentor Applications API ──
export const mentorApplicationAPI = {
  apply:        (data)  => apiFetch("/mentor-applications", { method: "POST", body: JSON.stringify(data) }),
  checkStatus:  (email) => apiFetch(`/mentor-applications/check/${email}`),
  getAll:       (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return apiFetch(`/mentor-applications${query ? `?${query}` : ""}`)
  },
  review:       (id, data) => apiFetch(`/mentor-applications/${id}/review`, { method: "PATCH", body: JSON.stringify(data) }),
}