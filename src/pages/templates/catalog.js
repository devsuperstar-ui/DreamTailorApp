import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import LoadingSpinner from "@/components/LoadingSpinner";
import { profileColors as colors } from "@/lib/theme-colors";

const th = {
  textAlign: "left",
  padding: "8px 10px",
  fontSize: 11,
  color: colors.textMuted,
  borderBottom: `1px solid ${colors.cardBorder}`,
};
const td = { padding: "8px 10px", fontSize: 12, borderBottom: `1px solid ${colors.cardBorder}` };

export default function TemplateCatalogTablesPage() {
  const [catalog, setCatalog] = useState(null);

  useEffect(() => {
    fetch("/api/templates/catalog")
      .then((r) => r.json())
      .then(setCatalog)
      .catch(console.error);
  }, []);

  if (!catalog) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: colors.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Template catalog tables</title>
      </Head>
      <div style={{ minHeight: "100vh", background: colors.bg, color: colors.text, padding: 16 }}>
        <Link href="/templates/show" style={{ color: colors.linkColor, fontSize: 13 }}>
          ← Explore one by one
        </Link>
        <h1 style={{ fontSize: 18 }}>All styles & templates (tables)</h1>

        <h2 style={{ fontSize: 15, marginTop: 24 }}>resumeStyle presets</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={th}>resumeStyle</th>
              <th style={th}>template</th>
              <th style={th}>headerLayout</th>
            </tr>
          </thead>
          <tbody>
            {catalog.resumeStyles.map((r) => (
              <tr key={r.id}>
                <td style={td}>
                  <Link
                    href={`/templates/show?resumeStyle=${encodeURIComponent(r.id)}`}
                    style={{ color: colors.linkColor }}
                  >
                    {r.id}
                  </Link>
                </td>
                <td style={td}>{r.template}</td>
                <td style={td}>{r.headerLayout}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 style={{ fontSize: 15, marginTop: 24 }}>Resumes</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={th}>Name</th>
              <th style={th}>resumeStyle</th>
              <th style={th}>template</th>
              <th style={th}>headerLayout</th>
            </tr>
          </thead>
          <tbody>
            {catalog.resumes.map((r) => (
              <tr key={r.name}>
                <td style={td}>{r.name}</td>
                <td style={td}>{r.resumeStyle}</td>
                <td style={td}>{r.template}</td>
                <td style={td}>{r.headerLayout}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
