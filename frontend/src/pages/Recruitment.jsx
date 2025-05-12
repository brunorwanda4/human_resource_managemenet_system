import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import DataTable from "../components/DataTable";
import {
  DocumentCheckIcon,
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { Routes, Route } from "react-router-dom";
import RecruitmentForm from "../components/RecruitmentForm";

export default function Recruitment() {
  const [recruitment, setRecruitment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRecruitment();
  }, []);

  const fetchRecruitment = async () => {
    try {
      setLoading(true);
      const response = await api.get("/recruitment");
      setRecruitment(response.data);
      setError("");
    } catch (error) {
      setError("Failed to fetch recruitment records");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this recruitment record?"
      )
    )
      return;

    try {
      await api.delete(`/recruitment/${id}`);
      fetchRecruitment();
    } catch (error) {
      console.error(error);
      alert("Failed to delete recruitment record");
    }
  };

  const columns = [
    {
      Header: "ID",
      accessor: "recId",
    },
    {
      Header: "Employee",
      accessor: "firstName",
      Cell: ({ row }) => `${row.original.firstName} ${row.original.lastName}`,
    },
    {
      Header: "Salary",
      accessor: "salary",
      Cell: ({ value }) => `$${value.toLocaleString()}`,
    },
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ value }) => (
        <span
          className={`badge ${
            value === "active"
              ? "badge-success"
              : value === "pending"
              ? "badge-warning"
              : "badge-error"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      Header: "Hire Date",
      accessor: "hireDate",
      Cell: ({ value }) => new Date(value).toLocaleDateString(),
    },
    {
      Header: "Actions",
      accessor: "actions",
      Cell: ({ row }) => (
        <div className="flex space-x-2">
          <Link
            to={`/recruitment/edit/${row.original.recId}`}
            className="btn btn-sm btn-ghost"
          >
            <PencilSquareIcon className="h-4 w-4" />
          </Link>
          <button
            onClick={() => handleDelete(row.original.recId)}
            className="btn btn-sm btn-ghost text-error"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  if (loading)
    return <div className="loading loading-spinner loading-lg"></div>;
  if (error) return <div className="alert alert-error">{error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center">
          <DocumentCheckIcon className="h-6 w-6 mr-2" />
          Recruitment
        </h1>
        <Link to="/recruitment/new" className="btn btn-primary">
          <PlusIcon className="h-5 w-5 mr-1" />
          Add Record
        </Link>
      </div>

      <Routes>
        <Route
          path="/"
          element={
            <div className="card bg-base-100 shadow">
              <div className="card-body p-0">
                <DataTable
                  columns={columns}
                  data={recruitment}
                  className="w-full"
                />
              </div>
            </div>
          }
        />
        <Route path="/new" element={<RecruitmentForm />} />
        <Route path="/edit/:id" element={<RecruitmentForm />} />
      </Routes>
    </div>
  );
}
