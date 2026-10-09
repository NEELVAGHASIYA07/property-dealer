"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  MapPin,
  Clock,
  ShieldCheck,
  Search,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import "@/app/profile/profile.css";

export default function InquiriesPage() {
  const [inquiries] = useState([
    {
      id: "inq-1",
      propertyName: "The Juniper Villa",
      location: "Bodakdev, Ahmedabad",
      date: "October 10, 2026 · 11:30 AM",
      type: "Site Visit Scheduled",
      status: "confirmed",
      dealerName: "Hardik Shah (Gujarat Prime Realty)",
      propertyId: "1",
    },
    {
      id: "inq-2",
      propertyName: "Avadh Bella Vista Luxury Villa",
      location: "Vesu, Surat",
      date: "October 8, 2026 · 04:00 PM",
      type: "Price Sheet & Floor Plan Requested",
      status: "pending",
      dealerName: "Rahul Patel (Surat Elite Realty)",
      propertyId: "2",
    },
    {
      id: "inq-3",
      propertyName: "Iscon Platinum Penthouse",
      location: "Bopal, Ahmedabad",
      date: "October 4, 2026",
      type: "Virtual Consultation Completed",
      status: "confirmed",
      dealerName: "Ketan Mehta (Ahmedabad Realty)",
      propertyId: "3",
    },
  ]);

  return (
    <main className="profile-page-shell">
      <div className="profile-container">
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: "20px" }}>
          <Link
            href="/profile"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              color: "#77766f",
              textDecoration: "none",
              fontSize: "13.5px",
              fontWeight: "600",
            }}
          >
            <ArrowLeft size={15} />
            <span>Back to My Profile</span>
          </Link>
        </div>

        {/* Page Header */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid rgba(29, 30, 26, 0.08)",
            borderRadius: "18px",
            padding: "26px 30px",
            marginBottom: "28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "10px",
                  background: "#e0f2fe",
                  color: "#0284c7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CalendarDays size={22} />
              </div>
              <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#1d1e1a", margin: 0 }}>
                My Inquiries & Tours
              </h1>
              <span
                style={{
                  background: "#e0f2fe",
                  color: "#0284c7",
                  fontSize: "12px",
                  fontWeight: "700",
                  padding: "3px 10px",
                  borderRadius: "20px",
                }}
              >
                {inquiries.length} Active
              </span>
            </div>
            <p style={{ margin: "6px 0 0", color: "#77766f", fontSize: "14px" }}>
              Manage your site visit appointments, developer contacts, and property tour requests.
            </p>
          </div>

          <Link
            href="/buy"
            className="profile-dealer-btn"
            style={{ textDecoration: "none" }}
          >
            <Search size={15} />
            <span>Explore & Book Tours</span>
          </Link>
        </div>

        {/* Inquiries List */}
        <div className="inquiries-card">
          <h2 style={{ fontSize: "18px", fontWeight: "800", margin: "0 0 18px", color: "#1d1e1a" }}>
            Scheduled Visits & Active Inquiries
          </h2>

          {inquiries.map((inq) => (
            <div key={inq.id} className="inquiry-item">
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: "700", margin: "0 0 6px", color: "#1d1e1a" }}>
                  {inq.propertyName}
                </h3>
                <div style={{ fontSize: "13px", color: "#77766f", marginBottom: "6px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <MapPin size={14} color="#ee705b" />
                  <span>{inq.location}</span>
                  <span>&bull;</span>
                  <span style={{ fontWeight: "600", color: "#4b5563" }}>Dealer: {inq.dealerName}</span>
                </div>
                <div style={{ fontSize: "13px", color: "#1d1e1a", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Clock size={14} color="#0284c7" />
                  <span>{inq.date}</span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                <span className={`inquiry-status-badge ${inq.status}`}>
                  {inq.type} ({inq.status === "confirmed" ? "Confirmed ✓" : "Pending"})
                </span>
                <Link
                  href={`/property/${inq.propertyId}`}
                  style={{
                    fontSize: "12.5px",
                    fontWeight: "700",
                    color: "#ee705b",
                    textDecoration: "none",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    background: "rgba(238, 112, 91, 0.08)",
                  }}
                >
                  View Property ↗
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
