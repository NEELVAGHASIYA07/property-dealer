import Link from "next/link";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 20px",
        background: "#faf9f5",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "520px",
          width: "100%",
          textAlign: "center",
          background: "#ffffff",
          padding: "48px 36px",
          borderRadius: "20px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)",
          border: "1px solid #ebe9e0",
        }}
      >
        <div
          style={{
            fontSize: "88px",
            fontWeight: "900",
            lineHeight: "1",
            color: "#ee705b",
            letterSpacing: "-0.04em",
            marginBottom: "12px",
          }}
        >
          404
        </div>

        <h1
          style={{
            fontSize: "24px",
            fontWeight: "800",
            color: "#1d1e1a",
            margin: "0 0 10px",
          }}
        >
          Page Not Found
        </h1>

        <p
          style={{
            fontSize: "15px",
            color: "#77766f",
            lineHeight: "1.6",
            margin: "0 0 32px",
          }}
        >
          The page you are looking for doesn&apos;t exist, has been removed, or is temporarily unavailable.
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "#ee705b",
              color: "#ffffff",
              textDecoration: "none",
              padding: "12px 24px",
              borderRadius: "10px",
              fontSize: "14px",
              fontWeight: "700",
              boxShadow: "0 4px 12px rgba(238, 112, 91, 0.25)",
              transition: "transform 0.15s ease",
            }}
          >
            <Home size={16} />
            <span>Back to Home</span>
          </Link>

          <Link
            href="/buy"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "#f7f5f0",
              color: "#1d1e1a",
              textDecoration: "none",
              padding: "12px 24px",
              borderRadius: "10px",
              fontSize: "14px",
              fontWeight: "600",
              border: "1px solid #e5e3dc",
            }}
          >
            <Search size={16} />
            <span>Browse Properties</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
