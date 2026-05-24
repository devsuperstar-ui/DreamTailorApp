import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import LoadingSpinner from "@/components/LoadingSpinner";
import { profileColors as colors } from "@/lib/theme-colors";

export default function AllTemplatesPreviewPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState("Resume");
  const [pdfKey, setPdfKey] = useState(0);

  useEffect(() => {
    fetch("/api/templates")
      .then((r) => r.json())
      .then((data) => {
        const list = data.templates || data;
        if (Array.isArray(list)) setTemplates(list);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!router.isReady) return;
    const t = typeof router.query.template === "string" ? router.query.template : "Resume";
    setSelectedTemplate(t);
  }, [router.isReady, router.query.template]);

  const pdfSrc = useMemo(() => {
    if (!selectedTemplate) return "";
    return `/api/preview?template=${encodeURIComponent(selectedTemplate)}`;
  }, [selectedTemplate, pdfKey]);

  const onSelect = (id) => {
    setSelectedTemplate(id);
    setPdfKey((k) => k + 1);
    router.replace({ pathname: "/templates/show", query: { template: id } }, undefined, {
      shallow: true,
    });
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: colors.bg,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <LoadingSpinner label="Loading templates..." />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>All resume templates — preview</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div
        style={{
          minHeight: "100vh",
          background: colors.bg,
          color: colors.text,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <header
          style={{
            padding: "12px 16px",
            borderBottom: `1px solid ${colors.cardBorder}`,
            background: colors.cardBg,
          }}
        >
          <h1 style={{ margin: 0, fontSize: 18 }}>All resume templates</h1>
          <p style={{ margin: "6px 0 0", fontSize: 13, color: colors.textMuted }}>
            Generic sample data · no AI · pick a template below
          </p>
          <Link href="/" style={{ fontSize: 12, color: colors.linkColor }}>
            ← Home
          </Link>
        </header>

        <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
          <aside
            style={{
              width: 260,
              flexShrink: 0,
              borderRight: `1px solid ${colors.cardBorder}`,
              overflowY: "auto",
              padding: 8,
            }}
          >
            {templates.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => onSelect(t.id)}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "10px 12px",
                  marginBottom: 4,
                  borderRadius: 6,
                  border: "none",
                  cursor: "pointer",
                  fontSize: 13,
                  background: selectedTemplate === t.id ? colors.buttonBg : "transparent",
                  color: selectedTemplate === t.id ? colors.buttonText : colors.textSecondary,
                }}
              >
                {t.name}
              </button>
            ))}
          </aside>

          <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
            <div style={{ padding: "8px 12px", borderBottom: `1px solid ${colors.cardBorder}` }}>
              <a
                href={pdfSrc}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: 12, color: colors.linkColor }}
              >
                Open PDF in new tab
              </a>
            </div>
            {pdfSrc ? (
              <iframe
                key={pdfKey}
                title="Template preview"
                src={pdfSrc}
                style={{
                  flex: 1,
                  width: "100%",
                  minHeight: "calc(100vh - 100px)",
                  border: "none",
                  background: "#fff",
                }}
              />
            ) : null}
          </main>
        </div>
      </div>
    </>
  );
}
