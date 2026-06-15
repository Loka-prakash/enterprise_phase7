import {
  useEffect,
  useState
} from "react"

import axios from "axios"

import Navbar from "../components/Navbar"


export default function ApprovalsPage() {

  const [approvals,
    setApprovals] =
    useState([])

  const [title,
    setTitle] =
    useState("")

  const [description,
    setDescription] =
    useState("")

  const [loading,
    setLoading] =
    useState(false)

  const token =
    localStorage.getItem("token")

  const [user,
    setUser] =
    useState(
      JSON.parse(
        localStorage.getItem("user")
      )
    )


  const fetchApprovals =
    async () => {

      try {

        const response =
          await axios.get(
            "http://127.0.0.1:8000/approvals/",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          )

        setApprovals(
          response.data.items ||
          response.data
        )

      } catch (error) {

        console.error(error)
      }
    }


  useEffect(() => {

    fetchCurrentUser()

    fetchApprovals()

  }, [])


  const fetchCurrentUser =
    async () => {

      try {

        const response =
          await axios.get(
            "http://127.0.0.1:8000/auth/me",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          )

        localStorage.setItem(
          "user",
          JSON.stringify(response.data)
        )

        setUser(response.data)

      } catch (error) {

        console.error(error)
      }
    }


  const handleCreateApproval =
    async (e) => {

      e.preventDefault()

      if (!title.trim()) {

        alert("Approval title is required")

        return
      }

      try {

        setLoading(true)

        await axios.post(
          "http://127.0.0.1:8000/approvals/",
          {
            title,
            description,
            task_id: null
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        )

        setTitle("")

        setDescription("")

        fetchApprovals()

      } catch (error) {

        console.error(error)

        alert(
          error.response?.data?.detail ||
          "Approval request failed"
        )

      } finally {

        setLoading(false)
      }
    }


  const canReviewApproval =
    (approval) => {

      if (approval.requested_by === user?.id) {

        return false
      }

      if (
        user?.role === "manager" &&
        approval.current_level === "manager"
      ) {

        return true
      }

      if (
        user?.role === "admin" &&
        approval.current_level === "admin"
      ) {

        return true
      }

      return false
    }


  const handleAction =
    async (
      approvalId,
      status
    ) => {

      try {

        let remarks =
          user?.role === "admin"
            ? "Approved by admin"
            : "Approved by manager"

        if (status === "rejected") {

          remarks =
            prompt(
              "Enter rejection remarks"
            )

          if (
            !remarks ||
            !remarks.trim()
          ) {

            alert(
              "Remarks are mandatory for rejection"
            )

            return
          }
        }

        if (status === "hold") {

          remarks =
            prompt(
              "Enter hold remarks"
            ) || "Approval placed on hold"
        }

        await axios.patch(
          `http://127.0.0.1:8000/approvals/${approvalId}/action`,
          {
            action:
              status === "approved"
                ? "approve"
                : status === "rejected"
                  ? "reject"
                  : "hold",
            comment: remarks
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        )

        fetchApprovals()

      } catch (error) {

        console.error(error)

        alert(
          error.response?.data?.detail ||
          `${status} failed`
        )
      }
    }


  const myApprovals = approvals.filter(
    (approval) =>
      approval.requested_by === user?.id
  )

  const approvalRecords = approvals.filter(
    (approval) =>
      approval.requested_by !== user?.id
  )


  const renderApprovalCard =
    (approval) => (

      <div
        key={approval.id}
        className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6"
      >

         <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-8">

  <div className="flex-1">

    <div className="flex flex-wrap items-center gap-3">

      <h3 className="text-2xl font-extrabold text-slate-800">

        {approval.title}

      </h3>

      <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-semibold shadow">

        #{approval.id}

      </span>

    </div>

    <p className="text-slate-600 mt-4 leading-relaxed">

      {approval.description ||
        "No description provided"}

    </p>

    <div className="mt-5 flex flex-wrap gap-3">

      <span className="bg-amber-50 text-amber-700 border border-amber-200 px-4 py-2 rounded-full text-sm font-medium">

        {approval.status}

      </span>

      <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-4 py-2 rounded-full text-sm font-medium">

        Level:
        {" "}
        {approval.current_level}

      </span>

      <span className="bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2 rounded-full text-sm font-medium">

        {approval.task_id
          ? `Task #${approval.task_id}`
          : "General Request"}

      </span>

      <span className="bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2 rounded-full text-sm font-medium">

        Requested By:
        {" "}
        #{approval.requested_by}

      </span>

    </div>

    {approval.remarks && (

      <div className="bg-gradient-to-r from-slate-50 to-indigo-50 border border-indigo-100 rounded-2xl p-4 mt-5 shadow-sm">

        <p className="text-xs uppercase tracking-wider font-bold text-indigo-600 mb-2">

          Remarks

        </p>

        <p className="text-sm text-slate-700 leading-relaxed">

          {approval.remarks}

        </p>

      </div>
    )}

  </div>

  {canReviewApproval(approval) && (

    <div className="flex gap-3 flex-wrap lg:flex-col">

      <button
        onClick={() =>
          handleAction(
            approval.id,
            "approved"
          )
        }
        className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg transition-all duration-300 hover:scale-105"
      >

        ✓ Approve

      </button>

      <button
        onClick={() =>
          handleAction(
            approval.id,
            "hold"
          )
        }
        className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg transition-all duration-300 hover:scale-105"
      >

        ⏸ Hold

      </button>

      <button
        onClick={() =>
          handleAction(
            approval.id,
            "rejected"
          )
        }
        className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg transition-all duration-300 hover:scale-105"
      >

        ✕ Reject

      </button>

    </div>
  )}

</div>

      </div>
    )


  return (

     <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">

  <Navbar
    user={user}
    handleLogout={() => {

      localStorage.clear()

      window.location.href = "/"
    }}
  />

  <div className="max-w-7xl mx-auto px-6 py-10">

    <div className="bg-white/90 backdrop-blur-md border border-indigo-100 rounded-3xl shadow-lg px-8 py-7 mb-8">

      <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">

        Approval Center

      </h1>

      <p className="text-slate-600 mt-2 text-base">

        Manage requests, approvals, reviews, and workflow decisions

      </p>

    </div>

    {user?.role !== "admin" && (

      <div className="bg-white border border-indigo-100 rounded-3xl shadow-lg p-8 mb-8">

        <h2 className="text-2xl font-bold text-indigo-700 mb-2">

          Create Approval Request

        </h2>

        <p className="text-sm text-slate-600 mb-6">

          Submit requests for leave approval, purchase approval,
          laptop access, software access, or any internal approval.

        </p>

        <form
          onSubmit={handleCreateApproval}
          className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_auto] gap-5 items-end"
        >

          <div>

            <label className="block text-sm font-semibold text-slate-700 mb-2">

              Title

            </label>

            <input
              type="text"
              value={title}
              onChange={(e) =>
                setTitle(
                  e.target.value
                )
              }
              placeholder="Laptop Request"
              className="w-full border border-slate-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
            />

          </div>

          <div>

            <label className="block text-sm font-semibold text-slate-700 mb-2">

              Description

            </label>

            <input
              type="text"
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              placeholder="Reason for request"
              className="w-full border border-slate-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
            />

          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600 disabled:opacity-60 text-white px-8 py-3 rounded-2xl font-semibold shadow-lg transition-all duration-300 hover:scale-105"
          >

            {loading
              ? "Submitting..."
              : "Submit Request"}

          </button>

        </form>

      </div>
    )}

    {user?.role !== "admin" && (

      <div className="mb-10">

        <div className="flex items-center justify-between mb-5">

          <h2 className="text-2xl font-bold text-slate-800">

            My Requests

          </h2>

          <span className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold">

            {myApprovals.length} Requests

          </span>

        </div>

        <div className="space-y-6">

          {myApprovals.length > 0 ? (

            myApprovals.map(
              renderApprovalCard
            )

          ) : (

            <div className="bg-white border border-indigo-100 rounded-3xl shadow-md p-10 text-center text-slate-500">

              No requests raised by you

            </div>
          )}

        </div>

      </div>
    )}

    <div>

      <div className="flex items-center justify-between mb-5">

        <h2 className="text-2xl font-bold text-slate-800">

          Approval Records

        </h2>

        <span className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold">

          {approvalRecords.length} Records

        </span>

      </div>

      <div className="space-y-6">

        {approvalRecords.length > 0 ? (

          approvalRecords.map(
            renderApprovalCard
          )

        ) : (

          <div className="bg-white border border-indigo-100 rounded-3xl shadow-md p-10 text-center text-slate-500">

            No approval records available

          </div>
        )}

      </div>

    </div>

  </div>

</div>
  )
}
