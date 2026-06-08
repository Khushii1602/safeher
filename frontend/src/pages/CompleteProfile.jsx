import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function CompleteProfile() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    age: "",
    occupation: "",
    gender: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    await updateDoc(
      doc(db, "users", auth.currentUser.uid),
      {
        ...form,
        profileCompleted: true,
      }
    );

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-pink-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6">
          Complete Your Profile
        </h1>

        <input
          placeholder="Full Name"
          className="w-full border p-3 mb-4 rounded"
          onChange={(e) =>
            setForm({ ...form, fullName: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Age"
          className="w-full border p-3 mb-4 rounded"
          onChange={(e) =>
            setForm({ ...form, age: e.target.value })
          }
        />

        <input
          placeholder="Occupation"
          className="w-full border p-3 mb-4 rounded"
          onChange={(e) =>
            setForm({ ...form, occupation: e.target.value })
          }
        />

        <select
          className="w-full border p-3 mb-4 rounded"
          onChange={(e) =>
            setForm({ ...form, gender: e.target.value })
          }
        >
          <option value="">Select Gender</option>
          <option>Female</option>
          <option>Male</option>
          <option>Other</option>
          <option>Prefer not to say</option>
        </select>

        <button
          type="submit"
          className="w-full bg-pink-600 text-white p-3 rounded"
        >
          Continue
        </button>
      </form>
    </div>
  );
}