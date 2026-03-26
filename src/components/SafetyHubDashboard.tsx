"use client";

import { useState } from "react";
import {
  Button,
  Card,
  H2,
  Flex,
  Pagination,
  Panel,
  Spinner,
  TextInput,
  Tooltip,
} from "@procore/core-react";
import {
  CopilotBranded,
  EllipsisVertical,
  Fullscreen,
  Info,
} from "@procore/core-icons";

const cardTitleStyle = {
  margin: 0,
  fontSize: "1rem",
  fontWeight: 600,
  color: "#1a1a1a",
};
const cardHeaderStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 16,
  flexWrap: "wrap" as const,
  gap: 8,
};
const legendStyle = {
  display: "flex",
  gap: 16,
  marginBottom: 12,
  fontSize: "0.75rem",
  color: "#666",
};
const legendItemStyle = { display: "flex", alignItems: "center", gap: 6 };
const cardSubtitleStyle = {
  fontSize: "0.8125rem",
  color: "#888",
  marginTop: 4,
  marginBottom: 0,
  fontWeight: 400 as const,
};
const quickFilterSelectStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 36px 10px 12px",
  fontSize: "0.875rem",
  border: "1px solid #ccc",
  borderRadius: 8,
  backgroundColor: "#fff",
  color: "#333",
  marginBottom: 8,
  appearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 8L2 4h8z'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px center",
  cursor: "pointer",
};

const toolboxTalkListContainerStyle = {
  border: "1px solid #e0e0e0",
  borderRadius: 8,
  overflow: "hidden" as const,
};

const TOOLBOX_TALKS = [
  { title: "Fall Protection Basics", attended: 12, total: 15 },
  { title: "Electrical Safety on Site", attended: 8, total: 10 },
  { title: "Crane & Rigging Awareness", attended: 14, total: 14 },
  { title: "Heat Stress Prevention", attended: 9, total: 12 },
  { title: "Confined Space Entry", attended: 6, total: 11 },
];

const ORIENTATION_WEEKS = [
  { title: "Week of Mar 1–7", attended: 18, total: 20 },
  { title: "Week of Mar 8–14", attended: 15, total: 18 },
  { title: "Week of Mar 15–21", attended: 22, total: 24 },
  { title: "Week of Mar 22–28", attended: 11, total: 16 },
  { title: "Week of Mar 29–31", attended: 7, total: 9 },
];

/** Demo series for stacked column chart (days). */
const TIME_LOST_BY_MONTH = [
  { month: "Jan", projected: 18, actual: 14 },
  { month: "Feb", projected: 28, actual: 22 },
  { month: "Mar", projected: 42, actual: 10 },
  { month: "Apr", projected: 52, actual: 6 },
] as const;

const TIME_LOST_CHART = {
  projected: "#1e6bd9",
  actual: "#5c3d9e",
  plotHeight: 176,
  yMax: 80,
} as const;

/** Contractors: bottom → top stack (blue, purple, teal, brown). */
const MANPOWER_CONTRACTORS = [
  { key: "acme", label: "Acme Builders", color: "#1e6bd9" },
  { key: "ridge", label: "Ridge Co.", color: "#5c3d9e" },
  { key: "harbor", label: "Harbor Electric", color: "#2a9d8f" },
  { key: "summit", label: "Summit Steel", color: "#8b6914" },
] as const;

/** Demo: incidents per contractor per day (9 days). */
const INCIDENTS_PER_MANPOWER_BY_DAY = [
  { day: "3/18", acme: 2, ridge: 1, harbor: 1, summit: 0 },
  { day: "3/19", acme: 1, ridge: 2, harbor: 0, summit: 1 },
  { day: "3/20", acme: 3, ridge: 0, harbor: 2, summit: 1 },
  { day: "3/21", acme: 0, ridge: 1, harbor: 1, summit: 2 },
  { day: "3/22", acme: 2, ridge: 2, harbor: 1, summit: 0 },
  { day: "3/23", acme: 1, ridge: 0, harbor: 0, summit: 1 },
  { day: "3/24", acme: 0, ridge: 1, harbor: 1, summit: 0 },
  { day: "3/25", acme: 2, ridge: 1, harbor: 2, summit: 1 },
  { day: "3/26", acme: 1, ridge: 3, harbor: 0, summit: 1 },
] as const;

const MANPOWER_LOG_CHART = {
  plotHeight: 176,
  yMax: 12,
  lineColor: "#1e6bd9",
} as const;

/** Arc segments left → right: Open, In Progress, Complete (matches reference layout). */
const HAZARD_GAUGE_ARC_SEGMENTS = [
  { pct: 17, color: "#1976d2" },
  { pct: 31, color: "#7b1fa2" },
  { pct: 52, color: "#26a69a" },
] as const;

/** Legend row: Complete, In Progress, Open. */
const HAZARD_GAUGE_LEGEND = [
  { pct: 52, color: "#26a69a", label: "Complete" },
  { pct: 31, color: "#7b1fa2", label: "In Progress" },
  { pct: 17, color: "#1976d2", label: "Open" },
] as const;

function hazardGaugePolar(
  cx: number,
  cy: number,
  r: number,
  angle: number
) {
  return {
    x: cx + r * Math.cos(angle),
    y: cy - r * Math.sin(angle),
  };
}

function DailyHazardSemiGauge({ projectTotal }: { projectTotal: number }) {
  const cx = 120;
  const cy = 112;
  const r = 86;
  const strokeWidth = 26;
  const gap = 0.09;
  const usable = Math.PI - 2 * gap;

  let theta = Math.PI;
  const arcPaths = HAZARD_GAUGE_ARC_SEGMENTS.map((seg, i) => {
    const sweepAngle = (seg.pct / 100) * usable;
    const start = theta;
    const end = theta - sweepAngle;
    const s = hazardGaugePolar(cx, cy, r, start);
    const e = hazardGaugePolar(cx, cy, r, end);
    theta = end - (i < HAZARD_GAUGE_ARC_SEGMENTS.length - 1 ? gap : 0);
    const d = `M ${s.x} ${s.y} A ${r} ${r} 0 0 1 ${e.x} ${e.y}`;
    return (
      <path
        key={`${seg.pct}-${seg.color}`}
        d={d}
        stroke={seg.color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill="none"
      />
    );
  });

  return (
    <div
      role="img"
      aria-label={`Daily hazard assessments: ${projectTotal} project total. Complete ${HAZARD_GAUGE_LEGEND[0].pct} percent, In Progress ${HAZARD_GAUGE_LEGEND[1].pct} percent, Open ${HAZARD_GAUGE_LEGEND[2].pct} percent.`}
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 288,
        margin: "0 auto",
        paddingTop: 8,
      }}
    >
      <svg
        viewBox="0 0 240 128"
        width="100%"
        height={128}
        style={{ display: "block" }}
        aria-hidden
      >
        {arcPaths}
      </svg>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "62%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            fontSize: "2rem",
            fontWeight: 700,
            color: "#1a1a1a",
            lineHeight: 1.05,
          }}
        >
          {projectTotal}
        </div>
        <div
          style={{
            fontSize: "0.8125rem",
            color: "#888",
            marginTop: 6,
            fontWeight: 400,
          }}
        >
          Project Total
        </div>
      </div>
    </div>
  );
}

function HubCardListItem({
  label,
  attended,
  total,
  isLast,
}: {
  label: string;
  attended: number;
  total: number;
  isLast?: boolean;
}) {
  return (
    <li
      style={{
        padding: "12px 16px",
        borderBottom: isLast ? "none" : "1px solid #eee",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap" as const,
        gap: 8,
      }}
    >
      <div>
        <div
          style={{
            fontSize: "0.875rem",
            fontWeight: 600,
            color: "#1a1a1a",
            marginBottom: 4,
          }}
        >
          {label}
        </div>
        <div style={{ fontSize: "0.8125rem", color: "#666", lineHeight: 1.4 }}>
          {attended} / {total} people attended
        </div>
      </div>
      <Button variant="secondary" size="sm">
        Action
      </Button>
    </li>
  );
}

function IncidentsPerManpowerLogChart() {
  const { plotHeight, yMax, lineColor } = MANPOWER_LOG_CHART;
  const yTicks = [12, 9, 6, 3, 0];

  const totals = INCIDENTS_PER_MANPOWER_BY_DAY.map(
    (row) => row.acme + row.ridge + row.harbor + row.summit
  );

  return (
    <div
      role="img"
      aria-label="Stacked column chart with total trend line: incidents per manpower log by day and contractor"
      style={{ marginTop: 4 }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          gap: 8,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 20,
            flexShrink: 0,
            paddingBottom: 28,
          }}
        >
          <span
            style={{
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
              fontSize: "0.6875rem",
              color: "#888",
              fontWeight: 600,
              letterSpacing: "0.04em",
            }}
          >
            number of Incidents
          </span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              position: "relative",
              height: plotHeight,
              marginBottom: 4,
            }}
          >
            {yTicks.map((t) => (
              <div
                key={`mp-grid-${t}`}
                style={{
                  position: "absolute",
                  left: 36,
                  right: 0,
                  top: `${((yMax - t) / yMax) * 100}%`,
                  borderTop:
                    t === 0 ? "1px solid #ccc" : "1px dashed #e0e0e0",
                  pointerEvents: "none",
                }}
              />
            ))}
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: 32,
                pointerEvents: "none",
              }}
            >
              {yTicks.map((t) => (
                <span
                  key={`mp-yl-${t}`}
                  style={{
                    position: "absolute",
                    right: 4,
                    top: `${((yMax - t) / yMax) * 100}%`,
                    transform: "translateY(-50%)",
                    fontSize: "0.6875rem",
                    color: "#999",
                    lineHeight: 1,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
            <div
              style={{
                position: "absolute",
                left: 36,
                right: 0,
                bottom: 0,
                top: 0,
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-end",
                justifyContent: "space-between",
                gap: 6,
                paddingLeft: 2,
                paddingRight: 2,
              }}
            >
              {INCIDENTS_PER_MANPOWER_BY_DAY.map((row, dayIndex) => {
                const total = totals[dayIndex];
                const barH = (total / yMax) * plotHeight;
                return (
                  <div
                    key={`${row.day}-${dayIndex}`}
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      minWidth: 0,
                      height: `${plotHeight}px`,
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        maxWidth: 44,
                        height: barH,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-end",
                        overflow: "hidden",
                        borderRadius: "0 0 4px 4px",
                      }}
                    >
                      {MANPOWER_CONTRACTORS.map((c, ci) => {
                        const v = row[c.key];
                        return (
                          <div
                            key={c.key}
                            style={{
                              flex: Math.max(v, 0.001),
                              minHeight: 0,
                              background: c.color,
                              borderRadius:
                                ci === MANPOWER_CONTRACTORS.length - 1
                                  ? "6px 6px 0 0"
                                  : 0,
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            <svg
              aria-hidden
              style={{
                position: "absolute",
                left: 36,
                right: 0,
                top: 0,
                height: plotHeight,
                width: "calc(100% - 36px)",
                overflow: "visible",
                pointerEvents: "none",
              }}
              preserveAspectRatio="none"
              viewBox="0 0 100 100"
            >
              <polyline
                fill="none"
                stroke={lineColor}
                strokeWidth={1.25}
                vectorEffect="non-scaling-stroke"
                points={totals
                  .map((tot, i) => {
                    const n = totals.length;
                    const xPct = ((i + 0.5) / n) * 100;
                    const yPct = 100 - (tot / yMax) * 100;
                    return `${xPct},${yPct}`;
                  })
                  .join(" ")}
              />
            </svg>
            <div
              aria-hidden
              style={{
                position: "absolute",
                left: 36,
                right: 0,
                top: 0,
                height: plotHeight,
                pointerEvents: "none",
              }}
            >
              {totals.map((tot, i) => {
                const n = totals.length;
                return (
                  <div
                    key={`mp-marker-${i}`}
                    style={{
                      position: "absolute",
                      left: `${((i + 0.5) / n) * 100}%`,
                      bottom: `${(tot / yMax) * 100}%`,
                      width: 8,
                      height: 8,
                      marginLeft: -4,
                      marginBottom: -4,
                      borderRadius: "50%",
                      background: "#fff",
                      border: `2px solid ${lineColor}`,
                      boxSizing: "border-box",
                    }}
                  />
                );
              })}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 6,
              paddingLeft: 40,
              paddingRight: 2,
              paddingTop: 8,
            }}
          >
            {INCIDENTS_PER_MANPOWER_BY_DAY.map((row, i) => (
              <div
                key={`x-mp-${i}`}
                style={{
                  flex: 1,
                  textAlign: "center",
                  fontSize: "0.6875rem",
                  color: "#666",
                  minWidth: 0,
                }}
              >
                {row.day}
              </div>
            ))}
          </div>
          <div
            style={{
              textAlign: "center",
              fontSize: "0.6875rem",
              color: "#999",
              marginTop: 12,
              paddingLeft: 28,
            }}
          >
            days
          </div>
        </div>
      </div>
    </div>
  );
}

function TimeLostToInjuryChart() {
  const { plotHeight, yMax, projected: projColor, actual: actColor } =
    TIME_LOST_CHART;
  const yTicks = [80, 60, 40, 20, 0];

  return (
    <div
      role="img"
      aria-label="Stacked column chart: time lost to injury by month, projected work and actual work, in days"
      style={{ marginTop: 4 }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          gap: 8,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 20,
            flexShrink: 0,
            paddingBottom: 28,
          }}
        >
          <span
            style={{
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
              fontSize: "0.6875rem",
              color: "#888",
              fontWeight: 600,
              letterSpacing: "0.04em",
            }}
          >
            Days
          </span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              position: "relative",
              height: plotHeight,
              marginBottom: 4,
            }}
          >
            {yTicks.map((t) => (
              <div
                key={`grid-${t}`}
                style={{
                  position: "absolute",
                  left: 36,
                  right: 0,
                  top: `${((yMax - t) / yMax) * 100}%`,
                  borderTop:
                    t === 0 ? "1px solid #ccc" : "1px dashed #e0e0e0",
                  pointerEvents: "none",
                }}
              />
            ))}
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: 32,
                pointerEvents: "none",
              }}
            >
              {yTicks.map((t) => (
                <span
                  key={`yl-${t}`}
                  style={{
                    position: "absolute",
                    right: 4,
                    top: `${((yMax - t) / yMax) * 100}%`,
                    transform: "translateY(-50%)",
                    fontSize: "0.6875rem",
                    color: "#999",
                    lineHeight: 1,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
            <div
              style={{
                position: "absolute",
                left: 36,
                right: 0,
                bottom: 0,
                top: 0,
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-end",
                justifyContent: "space-between",
                gap: 12,
                paddingLeft: 4,
                paddingRight: 4,
              }}
            >
              {TIME_LOST_BY_MONTH.map((row) => {
                const total = row.projected + row.actual;
                const barH = (total / yMax) * plotHeight;
                return (
                  <div
                    key={row.month}
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      minWidth: 0,
                      height: `${plotHeight}px`,
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        maxWidth: 56,
                        height: barH,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-end",
                        overflow: "hidden",
                        borderRadius: "0 0 4px 4px",
                      }}
                    >
                      <div
                        style={{
                          flex: row.projected,
                          minHeight: 0,
                          background: projColor,
                          borderRadius: 0,
                        }}
                      />
                      <div
                        style={{
                          flex: row.actual,
                          minHeight: 0,
                          background: actColor,
                          borderRadius: "6px 6px 0 0",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 12,
              paddingLeft: 40,
              paddingRight: 4,
              paddingTop: 8,
            }}
          >
            {TIME_LOST_BY_MONTH.map((row) => (
              <div
                key={`x-${row.month}`}
                style={{
                  flex: 1,
                  textAlign: "center",
                  fontSize: "0.6875rem",
                  color: "#666",
                  minWidth: 0,
                }}
              >
                {row.month}
              </div>
            ))}
          </div>
          <div
            style={{
              textAlign: "center",
              fontSize: "0.6875rem",
              color: "#999",
              marginTop: 12,
              paddingLeft: 28,
            }}
          >
            Month
          </div>
        </div>
      </div>
    </div>
  );
}

const INITIAL_DOCS = [
  { name: "Standard Operating... company_sop.pdf", date: "Jul 17, 2025" },
  { name: "Safety Plan 2025.pdf", date: "Jul 10, 2025" },
];
const REFRESHED_DOCS = [
  { name: "Company SOP v2 (updated).pdf", date: "Jul 20, 2025" },
  { name: "Safety Plan 2025.pdf", date: "Jul 10, 2025" },
  { name: "Incident Report Summary.pdf", date: "Jul 18, 2025" },
];

const INITIAL_PERSONNEL = [
  { role: "Project Manager", name: "Jim Taylor (Vertigo Construction)" },
  { role: "Safety Manager", name: "Sarah Chen (Vertigo Construction)" },
];
const REFRESHED_PERSONNEL = [
  { role: "Project Manager", name: "Jim Taylor (Vertigo Construction)" },
  { role: "Safety Manager", name: "Maria Santos (Vertigo Construction)" },
  { role: "Site Superintendent", name: "David Kim (Vertigo Construction)" },
];

export default function SafetyHubDashboard() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cardsLoading, setCardsLoading] = useState(false);
  const [dataRefreshed, setDataRefreshed] = useState(false);

  const handleSubmitQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setPanelOpen(false);
    setQuery("");
    setCardsLoading(true);
    setTimeout(() => {
      setCardsLoading(false);
      setDataRefreshed(true);
    }, 5000);
  };

  const docs = dataRefreshed ? REFRESHED_DOCS : INITIAL_DOCS;
  const personnel = dataRefreshed ? REFRESHED_PERSONNEL : INITIAL_PERSONNEL;
  const claimedKpi = dataRefreshed
    ? { value: "$892M", trend: "↓ 0.2%" }
    : { value: "$924M", trend: "↓ 0.0%" };
  const hazardProjectTotal = dataRefreshed ? 48 : 45;
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        display: "flex",
        flexDirection: "row",
      }}
    >
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
      {/* Top header bar */}
      <header
        style={{
          background: "#fff",
          borderBottom: "1px solid #e0e0e0",
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <Flex alignItems="center" gap="16px">
          <span style={{ color: "#999", cursor: "pointer" }} aria-hidden>☰</span>
          <span style={{ fontWeight: 700, fontSize: "1rem", color: "#1a1a1a" }}>
            PROCORE
          </span>
          <span
            style={{
              fontSize: "0.875rem",
              color: "#444",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            001SW - Monarch Apartments
            <span style={{ fontSize: "0.7em" }}>▼</span>
          </span>
        </Flex>
        <div
          style={{
            flex: "1 1 280px",
            maxWidth: 400,
            background: "#f5f5f5",
            borderRadius: 8,
            padding: "8px 12px",
            fontSize: "0.875rem",
            color: "#999",
          }}
        >
          Q Ask anything — Ctrl K
        </div>
        <Flex alignItems="center" gap="12px">
          <span style={{ color: "#666", cursor: "pointer" }} aria-hidden>?</span>
          <span style={{ color: "#666", cursor: "pointer" }} aria-hidden>🔔</span>
          <span style={{ color: "#666", cursor: "pointer" }} aria-hidden>💬</span>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "#ddd",
            }}
          />
          <span style={{ fontSize: "0.75rem", color: "#666" }}>
            MILLER DESIGN
          </span>
        </Flex>
      </header>

      {/* Secondary nav */}
      <nav
        style={{
          background: "#fff",
          borderBottom: "1px solid #e0e0e0",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <Flex alignItems="center" gap="0">
          {["Filter", "Overview", "Safety Hub", "Resource Management", "+ Create"].map(
            (tab, i) => (
              <a
                key={tab}
                href="#"
                style={{
                  padding: "14px 16px",
                  fontSize: "0.875rem",
                  color: tab === "Safety Hub" ? "#0066cc" : "#444",
                  textDecoration: "none",
                  borderBottom:
                    tab === "Safety Hub"
                      ? "2px solid #0066cc"
                      : "2px solid transparent",
                  fontWeight: tab === "Safety Hub" ? 600 : 400,
                }}
                onClick={(e) => e.preventDefault()}
              >
                {tab}
              </a>
            )
          )}
        </Flex>
        <Flex alignItems="center" gap="8px">
          <Button variant="primary" size="md">
            + Quick Create ▼
          </Button>
          <Button variant="secondary" size="md">
            Feedback
          </Button>
        </Flex>
      </nav>

      {/* Main content grid */}
      <main style={{ padding: 24, maxWidth: 1400, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
          }}
        >
          {/* Card 1: Project Safety Documentation */}
          <div style={{ position: "relative" }}>
            {cardsLoading && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(255,255,255,0.85)",
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,
                }}
              >
                <Spinner size="lg" />
              </div>
            )}
          <Card shadowStrength={1} style={{ padding: 20 }}>
            <div style={cardHeaderStyle}>
              <Flex alignItems="center" gap="8px">
                <H2 as="h3" style={cardTitleStyle}>
                  Project Safety Documentation
                </H2>
                <Tooltip overlay="Documentation info">
                  <button
                    type="button"
                    aria-label="Info"
                    style={{
                      background: "none",
                      border: "none",
                      padding: 4,
                      cursor: "pointer",
                      fontSize: "0.875rem",
                      color: "#666",
                      lineHeight: 1,
                    }}
                  >
                    ℹ️
                  </button>
                </Tooltip>
              </Flex>
              <Button variant="secondary" size="sm">
                Upload
              </Button>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {docs.map((doc) => (
                <li
                  key={doc.name}
                  style={{
                    padding: "12px 0",
                    borderBottom: "1px solid #eee",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 8,
                  }}
                >
                  <div>
                    <div style={{ fontSize: "0.875rem", color: "#1a1a1a" }}>
                      {doc.name}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#666" }}>
                      Date Uploaded: {doc.date}
                    </div>
                  </div>
                  <Button variant="secondary" size="sm">
                    View
                  </Button>
                </li>
              ))}
            </ul>
            <Flex alignItems="center" justifyContent="space-between" style={{ marginTop: 16 }}>
              <Button variant="secondary" size="sm">
                Sort by ▼
              </Button>
              <Pagination
                items={50}
                perPage={10}
                activePage={1}
                onSelectPage={() => {}}
              />
            </Flex>
          </Card>
          </div>

          {/* Card 2: Key Safety Personnel */}
          <div style={{ position: "relative" }}>
            {cardsLoading && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(255,255,255,0.85)",
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,
                }}
              >
                <Spinner size="lg" />
              </div>
            )}
          <Card shadowStrength={1} style={{ padding: 20 }}>
            <div style={cardHeaderStyle}>
              <Flex alignItems="center" gap="8px">
                <H2 as="h3" style={cardTitleStyle}>
                  Key Safety Personnel
                </H2>
                <Tooltip overlay="Personnel info">
                  <button
                    type="button"
                    aria-label="Info"
                    style={{
                      background: "none",
                      border: "none",
                      padding: 4,
                      cursor: "pointer",
                      fontSize: "0.875rem",
                      color: "#666",
                      lineHeight: 1,
                    }}
                  >
                    ℹ️
                  </button>
                </Tooltip>
              </Flex>
              <Button variant="secondary" size="sm">
                View All
              </Button>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {personnel.map((p) => (
                <li
                  key={p.name}
                  style={{
                    padding: "12px 0",
                    borderBottom: "1px solid #eee",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 8,
                  }}
                >
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "#666" }}>
                      {p.role}
                    </div>
                    <div style={{ fontSize: "0.875rem", color: "#1a1a1a" }}>
                      {p.name}
                    </div>
                  </div>
                  <Button variant="secondary" size="sm">
                    See Details
                  </Button>
                </li>
              ))}
            </ul>
          </Card>
          </div>

          {/* Card 3: Claimed to Date (KPI) */}
          <div style={{ position: "relative" }}>
            {cardsLoading && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(255,255,255,0.85)",
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,
                }}
              >
                <Spinner size="lg" />
              </div>
            )}
          <Card shadowStrength={1} style={{ padding: 20 }}>
            <div style={cardHeaderStyle}>
              <H2 as="h3" style={cardTitleStyle}>
                Claimed to Date
              </H2>
              <Flex alignItems="center" gap="8px" wrap="wrap">
                <Button variant="secondary" size="sm">
                  Action
                </Button>
                <Button
                  variant="tertiary"
                  size="sm"
                  icon={<EllipsisVertical />}
                  aria-label="More options"
                />
              </Flex>
            </div>
            <select
              id="claimed-quick-filter"
              style={quickFilterSelectStyle}
              defaultValue="qf1"
              aria-label="Quick Filter 1"
            >
              <option value="qf1">Quick Filter 1</option>
              <option value="qf2">Quick Filter 2</option>
            </select>
            <div
              style={{
                padding: "28px 8px 20px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 400,
                  color: "#555",
                  marginBottom: 12,
                }}
              >
                Claimed to Date
              </div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "baseline",
                  justifyContent: "center",
                  flexWrap: "wrap" as const,
                  gap: "10px 14px",
                }}
              >
                <span
                  style={{
                    fontSize: "2.125rem",
                    fontWeight: 700,
                    color: "#1a1a1a",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.1,
                  }}
                >
                  {claimedKpi.value}
                </span>
                <span
                  style={{
                    fontSize: "1rem",
                    fontWeight: 600,
                    color: "#c62828",
                    lineHeight: 1.1,
                  }}
                >
                  {claimedKpi.trend}
                </span>
              </div>
            </div>
          </Card>
          </div>

          {/* Card 4: Orientation Attendance */}
          <div style={{ position: "relative" }}>
            {cardsLoading && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(255,255,255,0.85)",
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,
                }}
              >
                <Spinner size="lg" />
              </div>
            )}
          <Card shadowStrength={1} style={{ padding: 20 }}>
            <div style={cardHeaderStyle}>
              <Flex alignItems="center" gap="8px" wrap="wrap">
                <H2 as="h3" style={cardTitleStyle}>
                  Orientation Attendance
                </H2>
                <Tooltip overlay="Attendance is tracked per weekly orientation window.">
                  <button
                    type="button"
                    aria-label="Info"
                    style={{
                      background: "none",
                      border: "none",
                      padding: 4,
                      cursor: "pointer",
                      fontSize: "0.875rem",
                      color: "#666",
                      lineHeight: 1,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Info />
                  </button>
                </Tooltip>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "#0d7a3e",
                    background: "#e6f4ea",
                    padding: "4px 10px",
                    borderRadius: 999,
                  }}
                >
                  {ORIENTATION_WEEKS.length} weeks
                </span>
              </Flex>
              <Flex alignItems="center" gap="4px" wrap="wrap">
                <Button variant="secondary" size="sm">
                  Action
                </Button>
                <Button
                  variant="tertiary"
                  size="sm"
                  icon={<Fullscreen />}
                  aria-label="Expand card"
                />
                <Button
                  variant="tertiary"
                  size="sm"
                  icon={<EllipsisVertical />}
                  aria-label="More options"
                />
              </Flex>
            </div>
            <div style={toolboxTalkListContainerStyle}>
              <ul
                role="list"
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                }}
              >
                {ORIENTATION_WEEKS.map((week, index) => (
                  <HubCardListItem
                    key={week.title}
                    label={week.title}
                    attended={week.attended}
                    total={week.total}
                    isLast={index === ORIENTATION_WEEKS.length - 1}
                  />
                ))}
              </ul>
            </div>
          </Card>
          </div>

          {/* Card 5: Time Lost to Injury */}
          <div style={{ position: "relative" }}>
            {cardsLoading && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(255,255,255,0.85)",
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,
                }}
              >
                <Spinner size="lg" />
              </div>
            )}
          <Card shadowStrength={1} style={{ padding: 20 }}>
            <div style={cardHeaderStyle}>
              <div>
                <H2 as="h3" style={cardTitleStyle}>
                  Time Lost to Injury
                </H2>
                <p style={cardSubtitleStyle}>
                  Projected vs. actual work capacity by month
                </p>
              </div>
              <Flex alignItems="center" gap="4px" wrap="wrap">
                <Button variant="secondary" size="sm">
                  Action
                </Button>
                <Button
                  variant="tertiary"
                  size="sm"
                  icon={<Fullscreen />}
                  aria-label="Expand card"
                />
                <Button
                  variant="tertiary"
                  size="sm"
                  icon={<EllipsisVertical />}
                  aria-label="More options"
                />
              </Flex>
            </div>
            <div style={legendStyle}>
              <span style={legendItemStyle}>
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: TIME_LOST_CHART.projected,
                  }}
                />
                Projected Work
              </span>
              <span style={legendItemStyle}>
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: TIME_LOST_CHART.actual,
                  }}
                />
                Actual Work
              </span>
            </div>
            <TimeLostToInjuryChart />
          </Card>
          </div>

          {/* Card 6: Toolbox Talk Attendance */}
          <div style={{ position: "relative" }}>
            {cardsLoading && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(255,255,255,0.85)",
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,
                }}
              >
                <Spinner size="lg" />
              </div>
            )}
          <Card shadowStrength={1} style={{ padding: 20 }}>
            <div style={cardHeaderStyle}>
              <Flex alignItems="center" gap="8px" wrap="wrap">
                <H2 as="h3" style={cardTitleStyle}>
                  Toolbox Talk Attendance
                </H2>
                <Tooltip overlay="Attendance is tracked per scheduled toolbox talk.">
                  <button
                    type="button"
                    aria-label="Info"
                    style={{
                      background: "none",
                      border: "none",
                      padding: 4,
                      cursor: "pointer",
                      fontSize: "0.875rem",
                      color: "#666",
                      lineHeight: 1,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Info />
                  </button>
                </Tooltip>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "#0d7a3e",
                    background: "#e6f4ea",
                    padding: "4px 10px",
                    borderRadius: 999,
                  }}
                >
                  {TOOLBOX_TALKS.length} talks
                </span>
              </Flex>
              <Flex alignItems="center" gap="4px" wrap="wrap">
                <Button variant="secondary" size="sm">
                  Action
                </Button>
                <Button
                  variant="tertiary"
                  size="sm"
                  icon={<Fullscreen />}
                  aria-label="Expand card"
                />
                <Button
                  variant="tertiary"
                  size="sm"
                  icon={<EllipsisVertical />}
                  aria-label="More options"
                />
              </Flex>
            </div>
            <div style={toolboxTalkListContainerStyle}>
              <ul
                role="list"
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                }}
              >
                {TOOLBOX_TALKS.map((talk, index) => (
                  <HubCardListItem
                    key={talk.title}
                    label={talk.title}
                    attended={talk.attended}
                    total={talk.total}
                    isLast={index === TOOLBOX_TALKS.length - 1}
                  />
                ))}
              </ul>
            </div>
          </Card>
          </div>

          {/* Card 7: Daily Hazard Assessments */}
          <div style={{ position: "relative" }}>
            {cardsLoading && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(255,255,255,0.85)",
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,
                }}
              >
                <Spinner size="lg" />
              </div>
            )}
          <Card shadowStrength={1} style={{ padding: 20 }}>
            <div style={cardHeaderStyle}>
              <H2 as="h3" style={cardTitleStyle}>
                Daily Hazard Assessments
              </H2>
              <Flex alignItems="center" gap="8px" wrap="wrap">
                <Button variant="secondary" size="sm">
                  Action
                </Button>
                <Button
                  variant="tertiary"
                  size="sm"
                  icon={<EllipsisVertical />}
                  aria-label="More options"
                />
              </Flex>
            </div>
            <DailyHazardSemiGauge projectTotal={hazardProjectTotal} />
            <div
              style={{
                ...legendStyle,
                justifyContent: "center",
                flexWrap: "wrap" as const,
                marginTop: 4,
                marginBottom: 0,
                gap: "12px 20px",
              }}
            >
              {HAZARD_GAUGE_LEGEND.map((item) => (
                <span key={item.label} style={legendItemStyle}>
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: item.color,
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ color: "#555", fontSize: "0.8125rem" }}>
                    {item.pct}% {item.label}
                  </span>
                </span>
              ))}
            </div>
          </Card>
          </div>

          {/* Card 8: Incidents per Manpower Log */}
          <div style={{ position: "relative" }}>
            {cardsLoading && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(255,255,255,0.85)",
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,
                }}
              >
                <Spinner size="lg" />
              </div>
            )}
          <Card shadowStrength={1} style={{ padding: 20 }}>
            <div style={cardHeaderStyle}>
              <div>
                <H2 as="h3" style={cardTitleStyle}>
                  Incidents per Manpower Log
                </H2>
                <p style={cardSubtitleStyle}>
                  Incidents by contractor over the last nine days
                </p>
              </div>
              <Flex alignItems="center" gap="4px" wrap="wrap">
                <Button variant="secondary" size="sm">
                  Action
                </Button>
                <Button
                  variant="tertiary"
                  size="sm"
                  icon={<Fullscreen />}
                  aria-label="Expand card"
                />
                <Button
                  variant="tertiary"
                  size="sm"
                  icon={<EllipsisVertical />}
                  aria-label="More options"
                />
              </Flex>
            </div>
            <div
              style={{
                ...legendStyle,
                flexWrap: "wrap" as const,
                gap: "8px 16px",
              }}
            >
              {MANPOWER_CONTRACTORS.map((c) => (
                <span key={c.key} style={legendItemStyle}>
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: c.color,
                      flexShrink: 0,
                    }}
                  />
                  {c.label}
                </span>
              ))}
              <span style={legendItemStyle}>
                <span
                  style={{
                    width: 14,
                    height: 2,
                    background: MANPOWER_LOG_CHART.lineColor,
                    flexShrink: 0,
                  }}
                />
                Total incidents
              </span>
            </div>
            <IncidentsPerManpowerLogChart />
          </Card>
          </div>
        </div>
      </main>
      </div>

      {/* Right sidebar - Procore Ask */}
      <aside
        style={{
          width: 56,
          flexShrink: 0,
          background: "#fff",
          borderLeft: "1px solid #e0e0e0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 24,
        }}
      >
        <Tooltip overlay="Procore Ask" trigger={["hover", "focus"]}>
          <Button
            variant="secondary"
            size="md"
            icon={<CopilotBranded />}
            aria-label="Procore Ask"
            onClick={() => setPanelOpen(true)}
          />
        </Tooltip>
      </aside>

      {/* Procore Ask Panel - slide-out from right */}
      {panelOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            bottom: 0,
            width: 420,
            maxWidth: "100%",
            zIndex: 1000,
            boxShadow: "-4px 0 24px rgba(0,0,0,0.12)",
            display: "flex",
            flexDirection: "column",
            background: "#fff",
          }}
        >
          <Panel style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
            <Panel.Header onClose={() => setPanelOpen(false)}>
              <Panel.Title>Procore Ask</Panel.Title>
            </Panel.Header>
            <Panel.Body style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  flex: 1,
                  padding: 24,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#666",
                  fontSize: "0.875rem",
                }}
              >
                Ask anything about your project. Type your question below.
              </div>
            </Panel.Body>
            <Panel.Footer
              style={{
                borderTop: "1px solid #e0e0e0",
                padding: 16,
              }}
            >
              <form onSubmit={handleSubmitQuery} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <TextInput
                  placeholder="Ask a question…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  style={{ flex: 1, minWidth: 0 }}
                />
                <Button type="submit" variant="primary" size="md" disabled={!query.trim()}>
                  Send
                </Button>
              </form>
            </Panel.Footer>
          </Panel>
        </div>
      )}
    </div>
  );
}
