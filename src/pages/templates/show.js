import { useCallback, useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import LoadingSpinner from "@/components/LoadingSpinner";
import { profileColors as colors } from "@/lib/theme-colors";

function buildPreviewUrl({ template, headerLayout, profileSlug }) {
  const qs = new URLSearchParams();
  if (profileSlug) qs.set("profile", profileSlug);
  if (template) qs.set("template", template);
  if (headerLayout) qs.set("headerLayout", headerLayout);
  return `/api/preview?${qs.toString()}`;
}

function cycleIndex(length, current, delta) {
  if (!length) return 0;
  return (current + delta + length) % length;
}

const selectStyle = {
  flex: 1,
  minWidth: 0,
  padding: "10px 12px",
  borderRadius: 6,
  border: `1px solid ${colors.inputBorder}`,
  background: colors.inputBg,
  color: colors.text,
  fontSize: 13,
};

const btnStyle = {
  padding: "8px 12px",
  borderRadius: 6,
  border: `1px solid ${colors.inputBorder}`,
  background: colors.cardBg,
  color: colors.text,
  cursor: "pointer",
  fontSize: 13,
  whiteSpace: "nowrap",
};

function OptionRow({
  label,
  hint,
  value,
  options,
  index,
  onChange,
  onPrev,
  onNext,
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        padding: "12px 0",
        borderBottom: `1px solid ${colors.cardBorder}`,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontSize: 14, fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: 12, color: colors.textMuted }}>
          {options.length ? `${index + 1} / ${options.length}` : "—"}
        </span>
      </div>
      {hint ? (
        <span style={{ fontSize: 12, color: colors.textMuted }}>{hint}</span>
      ) : null}
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button type="button" onClick={onPrev} style={btnStyle} aria-label={`Previous ${label}`}>
          ← Prev
        </button>
        <select value={value} onChange={(e) => onChange(e.target.value)} style={selectStyle}>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <button type="button" onClick={onNext} style={btnStyle} aria-label={`Next ${label}`}>
          Next →
        </button>
      </div>
    </div>
  );
}

export default function TemplateExplorerPage() {
  const router = useRouter();
  const [catalog, setCatalog] = useState(null);
  const [loading, setLoading] = useState(true);

  const [resumeStyle, setResumeStyle] = useState("");
  const [template, setTemplate] = useState("Resume");
  const [headerLayout, setHeaderLayout] = useState("center");
  const [profileSlug, setProfileSlug] = useState("");
  const [pdfKey, setPdfKey] = useState(0);

  useEffect(() => {
    fetch("/api/templates/catalog")
      .then((r) => r.json())
      .then(setCatalog)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const styleOptions = useMemo(
    () =>
      (catalog?.resumeStyles || []).map((s) => ({
        value: s.id,
        label: `${s.id} → ${s.template} / ${s.headerLayout}`,
        preset: s,
      })),
    [catalog]
  );

  const templateOptions = useMemo(
    () =>
      (catalog?.templates || []).map((t) => ({
        value: t.id,
        label: `${t.name} (${t.id})`,
      })),
    [catalog]
  );

  const headerOptions = useMemo(
    () =>
      (catalog?.headerLayouts || ["center", "split", "left"]).map((h) => ({
        value: h,
        label: h,
      })),
    [catalog]
  );

  const profileOptions = useMemo(() => {
    const base = [{ value: "", label: "Sample data (John Smith)" }];
    const fromResumes = (catalog?.resumes || [])
      .filter((r) => r.profileSlugs?.length)
      .map((r) => ({
        value: r.profileSlugs[0],
        label: `${r.name} (${r.profileSlugs[0]})`,
      }));
    return [...base, ...fromResumes];
  }, [catalog]);

  const styleIndex = styleOptions.findIndex((o) => o.value === resumeStyle);
  const templateIndex = templateOptions.findIndex((o) => o.value === template);
  const headerIndex = headerOptions.findIndex((o) => o.value === headerLayout);

  const applyResumeStyle = useCallback(
    (styleId) => {
      setResumeStyle(styleId);
      const preset = styleOptions.find((o) => o.value === styleId)?.preset;
      if (preset) {
        setTemplate(preset.template);
        setHeaderLayout(preset.headerLayout);
      }
      setPdfKey((k) => k + 1);
    },
    [styleOptions]
  );

  const bumpPdf = () => setPdfKey((k) => k + 1);

  useEffect(() => {
    if (!catalog || resumeStyle) return;
    const first = catalog.resumeStyles[0];
    if (first) applyResumeStyle(first.id);
  }, [catalog, resumeStyle, applyResumeStyle]);

  useEffect(() => {
    if (!router.isReady || !catalog) return;
    const q = router.query;
    if (typeof q.resumeStyle === "string" && q.resumeStyle) applyResumeStyle(q.resumeStyle);
    else {
      if (typeof q.template === "string") setTemplate(q.template);
      if (typeof q.headerLayout === "string") setHeaderLayout(q.headerLayout);
    }
    if (typeof q.profile === "string") setProfileSlug(q.profile);
  }, [router.isReady, catalog]); // eslint-disable-line react-hooks/exhaustive-deps -- hydrate once

  const pdfSrc = useMemo(
    () =>
      buildPreviewUrl({
        template,
        headerLayout,
        profileSlug: profileSlug || undefined,
      }),
    [template, headerLayout, profileSlug, pdfKey]
  );

  const syncUrl = useCallback(
    (patch) => {
      const query = {
        resumeStyle: patch.resumeStyle ?? resumeStyle,
        template: patch.template ?? template,
        headerLayout: patch.headerLayout ?? headerLayout,
        ...(patch.profileSlug !== undefined
          ? patch.profileSlug
            ? { profile: patch.profileSlug }
            : {}
          : profileSlug
            ? { profile: profileSlug }
            : {}),
      };
      router.replace({ pathname: "/templates/show", query }, undefined, { shallow: true });
    },
    [router, resumeStyle, template, headerLayout, profileSlug]
  );

  if (loading || !catalog) {
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
        <LoadingSpinner label="Loading options..." />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Explore templates & styles</title>
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
          <h1 style={{ margin: 0, fontSize: 18 }}>Explore styles one by one</h1>
          <p style={{ margin: "6px 0 0", fontSize: 13, color: colors.textMuted }}>
            Use each dropdown or Prev / Next to step through every option. PDF updates on every
            change.
          </p>
          <div style={{ marginTop: 8, display: "flex", gap: 16, fontSize: 12 }}>
            <Link href="/" style={{ color: colors.linkColor }}>
              ← Home
            </Link>
            <Link href="/templates/catalog" style={{ color: colors.linkColor }}>
              Full tables
            </Link>
          </div>
        </header>

        <div
          style={{
            display: "flex",
            flex: 1,
            minHeight: 0,
            flexDirection: "row",
          }}
        >
          <aside
            style={{
              width: 400,
              maxWidth: "42vw",
              flexShrink: 0,
              padding: "0 16px 16px",
              overflowY: "auto",
              borderRight: `1px solid ${colors.cardBorder}`,
            }}
          >
            <OptionRow
              label="1. resumeStyle"
              hint="Choosing a style sets template + header below (you can still change them after)."
              value={resumeStyle}
              options={styleOptions}
              index={styleIndex >= 0 ? styleIndex : 0}
              onChange={(v) => {
                applyResumeStyle(v);
                syncUrl({ resumeStyle: v });
              }}
              onPrev={() => {
                const i = cycleIndex(styleOptions.length, styleIndex >= 0 ? styleIndex : 0, -1);
                const v = styleOptions[i].value;
                applyResumeStyle(v);
                syncUrl({ resumeStyle: v });
              }}
              onNext={() => {
                const i = cycleIndex(styleOptions.length, styleIndex >= 0 ? styleIndex : 0, 1);
                const v = styleOptions[i].value;
                applyResumeStyle(v);
                syncUrl({ resumeStyle: v });
              }}
            />

            <OptionRow
              label="2. template"
              hint="PDF layout theme (10 templates)."
              value={template}
              options={templateOptions}
              index={templateIndex >= 0 ? templateIndex : 0}
              onChange={(v) => {
                setTemplate(v);
                bumpPdf();
                syncUrl({ template: v });
              }}
              onPrev={() => {
                const i = cycleIndex(
                  templateOptions.length,
                  templateIndex >= 0 ? templateIndex : 0,
                  -1
                );
                const v = templateOptions[i].value;
                setTemplate(v);
                bumpPdf();
                syncUrl({ template: v });
              }}
              onNext={() => {
                const i = cycleIndex(
                  templateOptions.length,
                  templateIndex >= 0 ? templateIndex : 0,
                  1
                );
                const v = templateOptions[i].value;
                setTemplate(v);
                bumpPdf();
                syncUrl({ template: v });
              }}
            />

            <OptionRow
              label="3. headerLayout"
              hint="Header / contact alignment: center, split, or left."
              value={headerLayout}
              options={headerOptions}
              index={headerIndex >= 0 ? headerIndex : 0}
              onChange={(v) => {
                setHeaderLayout(v);
                bumpPdf();
                syncUrl({ headerLayout: v });
              }}
              onPrev={() => {
                const i = cycleIndex(headerOptions.length, headerIndex >= 0 ? headerIndex : 0, -1);
                const v = headerOptions[i].value;
                setHeaderLayout(v);
                bumpPdf();
                syncUrl({ headerLayout: v });
              }}
              onNext={() => {
                const i = cycleIndex(headerOptions.length, headerIndex >= 0 ? headerIndex : 0, 1);
                const v = headerOptions[i].value;
                setHeaderLayout(v);
                bumpPdf();
                syncUrl({ headerLayout: v });
              }}
            />

            <OptionRow
              label="4. Preview as (optional)"
              hint="Sample person or a real profile from your resumes."
              value={profileSlug}
              options={profileOptions}
              index={Math.max(
                0,
                profileOptions.findIndex((o) => o.value === profileSlug)
              )}
              onChange={(v) => {
                setProfileSlug(v);
                bumpPdf();
                syncUrl({ profileSlug: v });
              }}
              onPrev={() => {
                const idx = profileOptions.findIndex((o) => o.value === profileSlug);
                const i = cycleIndex(profileOptions.length, idx >= 0 ? idx : 0, -1);
                const v = profileOptions[i].value;
                setProfileSlug(v);
                bumpPdf();
                syncUrl({ profileSlug: v });
              }}
              onNext={() => {
                const idx = profileOptions.findIndex((o) => o.value === profileSlug);
                const i = cycleIndex(profileOptions.length, idx >= 0 ? idx : 0, 1);
                const v = profileOptions[i].value;
                setProfileSlug(v);
                bumpPdf();
                syncUrl({ profileSlug: v });
              }}
            />

            <div
              style={{
                marginTop: 12,
                padding: 12,
                borderRadius: 8,
                background: "rgba(59,130,246,0.1)",
                fontSize: 12,
                lineHeight: 1.5,
              }}
            >
              <strong>Current preview</strong>
              <br />
              template: <code>{template}</code>
              <br />
              headerLayout: <code>{headerLayout}</code>
              <br />
              resumeStyle: <code>{resumeStyle || "—"}</code>
              {profileSlug ? (
                <>
                  <br />
                  profile: <code>{profileSlug}</code>
                </>
              ) : null}
            </div>

            <a
              href={pdfSrc}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                marginTop: 12,
                fontSize: 13,
                color: colors.linkColor,
              }}
            >
              Open PDF in new tab
            </a>
          </aside>

          <main style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
            <iframe
              key={pdfKey}
              title="Style preview"
              src={pdfSrc}
              style={{
                flex: 1,
                width: "100%",
                minHeight: "calc(100vh - 80px)",
                border: "none",
                background: "#fff",
              }}
            />
          </main>
        </div>
      </div>
    </>
  );
}
