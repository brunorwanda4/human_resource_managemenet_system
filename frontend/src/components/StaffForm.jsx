import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

export default function StaffForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    postId: "",
    depId: "",
    firstName: "",
    lastName: "",
    gender: "Male",
    DOB: "",
    email: "",
    phone: "",
    address: "",
  });
  const [departments, setDepartments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDepartments();
    fetchPosts();
    if (id) {
      fetchStaff();
    }
  }, [id]);

  const fetchDepartments = async () => {
    try {
      const response = await api.get("/department");
      setDepartments(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await api.get("/post");
      setPosts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchStaff = async () => {
    try {
      const response = await api.get(`/staff/${id}`);
      setFormData({
        postId: response.data.postId,
        depId: response.data.depId,
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        gender: response.data.gender,
        DOB: response.data.DOB.split("T")[0],
        email: response.data.email,
        phone: response.data.phone,
        address: response.data.address,
      });
    } catch (error) {
      setError("Failed to fetch staff");
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (id) {
        await api.put(`/staff/${id}`, formData);
      } else {
        await api.post("/staff", formData);
      }
      navigate("/staff");
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card bg-base-100 shadow">
      <div className="card-body">
        <h2 className="card-title">{id ? "Edit" : "Add"} Staff</h2>

        {error && (
          <div className="alert alert-error">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control flex flex-col space-y-2">
              <label className="label">
                <span className="label-text">First Name</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-control flex flex-col space-y-2">
              <label className="label">
                <span className="label-text">Last Name</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control flex flex-col space-y-2">
              <label className="label">
                <span className="label-text">Gender</span>
              </label>
              <select
                className="select select-bordered"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div className="form-control flex flex-col space-y-2">
              <label className="label">
                <span className="label-text">Date of Birth</span>
              </label>
              <input
                type="date"
                className="input input-bordered"
                name="DOB"
                value={formData.DOB}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control flex flex-col space-y-2">
              <label className="label">
                <span className="label-text">Department</span>
              </label>
              <select
                className="select select-bordered"
                name="depId"
                value={formData.depId}
                onChange={handleChange}
                required
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.depId} value={dept.depId}>
                    {dept.depName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control flex flex-col space-y-2">
              <label className="label">
                <span className="label-text">Position</span>
              </label>
              <select
                className="select select-bordered"
                name="postId"
                value={formData.postId}
                onChange={handleChange}
                required
              >
                <option value="">Select Position</option>
                {posts.map((post) => (
                  <option key={post.postId} value={post.postId}>
                    {post.postTitle}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-control flex flex-col space-y-2">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              className="input input-bordered"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-control flex flex-col space-y-2">
            <label className="label">
              <span className="label-text">Phone</span>
            </label>
            <input
              type="tel"
              className="input input-bordered"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-control flex flex-col space-y-2">
            <label className="label">
              <span className="label-text">Address</span>
            </label>
            <textarea
              className="textarea textarea-bordered"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="card-actions justify-end mt-4">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => navigate("/staff")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner"></span>
              ) : id ? (
                "Update"
              ) : (
                "Save"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
