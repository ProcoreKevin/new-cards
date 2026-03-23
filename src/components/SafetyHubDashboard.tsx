"use client";

import { useState } from "react";
import {
  Button,
  Card,
  H2,
  Flex,
  Link,
  Pagination,
  Panel,
  Spinner,
  TextInput,
  Tooltip,
} from "@procore/core-react";
import { CopilotBranded } from "@procore/core-icons";

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
const sectionLabelStyle = {
  fontSize: "0.75rem",
  fontWeight: 600,
  color: "#666",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
  marginBottom: 8,
};
const insightStyle = {
  fontSize: "0.875rem",
  color: "#444",
  lineHeight: 1.5,
  marginBottom: 16,
};
const chartPlaceholderStyle = {
  height: 180,
  background: "linear-gradient(180deg, #f0f4ff 0%, #e8ecf8 100%)",
  borderRadius: 8,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#666",
  fontSize: "0.875rem",
};
const legendStyle = {
  display: "flex",
  gap: 16,
  marginBottom: 12,
  fontSize: "0.75rem",
  color: "#666",
};
const legendItemStyle = { display: "flex", alignItems: "center", gap: 6 };

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
  const timeToComplete = dataRefreshed
    ? { project: "2.8", lastMonth: "3.8", industry: "1.7" }
    : { project: "3.0", lastMonth: "4.0", industry: "1.9" };
  const passRate = dataRefreshed
    ? { project: "58%", company: "96%" }
    : { project: "55%", company: "97%" };
  const daysWithoutIncident = dataRefreshed
    ? { recordable: "195", anyIncident: "38" }
    : { recordable: "200", anyIncident: "40" };
  const insightTime = dataRefreshed
    ? "February"
    : "March";
  const deficientItems = dataRefreshed
    ? "Inspection item #2 and Inspection item #4"
    : "Inspection item #1 and Inspection item #2";
  const incidentMessage = dataRefreshed
    ? "Trending in the right direction. Keep reinforcing safety protocols."
    : "Another day incident-free! Let's maintain this outstanding record!";

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

          {/* Card 3: Incidents Over Time */}
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
                Incidents Over Time
              </H2>
              <Button variant="secondary" size="sm">
                View
              </Button>
            </div>
            <div style={chartPlaceholderStyle}>
              Line chart: No. of Incidents (Nov – Apr)
            </div>
          </Card>
          </div>

          {/* Card 4: Inspections by Assignee */}
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
                Inspections by Assignee
              </H2>
              <Button variant="secondary" size="sm">
                View All
              </Button>
            </div>
            <div style={legendStyle}>
              <span style={legendItemStyle}>
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "#0066cc",
                  }}
                />
                Open
              </span>
              <span style={legendItemStyle}>
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "#cc3333",
                  }}
                />
                Closed
              </span>
            </div>
            <div style={chartPlaceholderStyle}>
              Stacked bar chart: Inspections by assignee
            </div>
          </Card>
          </div>

          {/* Card 5: Observations by Type */}
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
                Observations by Type
              </H2>
              <Flex gap="8px">
                <Button variant="secondary" size="sm">
                  Quick Filter ▼
                </Button>
                <Button variant="secondary" size="sm">
                  View All
                </Button>
              </Flex>
            </div>
            <div style={legendStyle}>
              <span style={legendItemStyle}>
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "#0066cc",
                  }}
                />
                Due in &gt;7 Days
              </span>
              <span style={legendItemStyle}>
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "#ff9800",
                  }}
                />
                Due in 7 Days
              </span>
              <span style={legendItemStyle}>
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "#cc3333",
                  }}
                />
                Overdue
              </span>
            </div>
            <div style={chartPlaceholderStyle}>
              Stacked bar chart: Observations by type
            </div>
          </Card>
          </div>

          {/* Card 6: Time to Complete Observations */}
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
                Time to Complete Observations
              </H2>
              <span style={{ color: "#666", cursor: "pointer" }}>⋯</span>
            </div>
            <div style={sectionLabelStyle}>Quick Insight</div>
            <p style={insightStyle}>
              ⚡ Your project&apos;s average time to complete Observations in{" "}
              <strong>{insightTime}</strong> is <strong>{timeToComplete.project} days</strong> which is lower
              than last month&apos;s <strong>{timeToComplete.lastMonth} days</strong>. The industry
              average for projects of a similar value is <strong>{timeToComplete.industry} days</strong>
              .
            </p>
            <div style={sectionLabelStyle}>
              Average days to complete Observations
            </div>
            <div
              style={{
                display: "flex",
                gap: 24,
                marginBottom: 16,
                fontSize: "0.875rem",
              }}
            >
              <span>
                Project <strong>{timeToComplete.project} days</strong>
              </span>
              <span>
                Company <strong>2.5 days</strong>
              </span>
              <span>
                Industry <strong>{timeToComplete.industry} days</strong>
              </span>
            </div>
            <div style={chartPlaceholderStyle}>
              Line chart: Days to complete (Jan–Jun)
            </div>
          </Card>
          </div>

          {/* Card 7: Inspection Item Pass Rate */}
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
                Inspection Item Pass Rate - Past 6 Months
              </H2>
              <span style={{ color: "#666", cursor: "pointer" }}>⋯</span>
            </div>
            <div style={sectionLabelStyle}>Quick Insight</div>
            <p style={insightStyle}>
              ⚡ The most common deficient Inspection items on this project are{" "}
              <strong>{deficientItems}</strong>.
            </p>
            <div style={sectionLabelStyle}>Inspection item pass rate</div>
            <div
              style={{
                display: "flex",
                gap: 24,
                marginBottom: 16,
                fontSize: "0.875rem",
              }}
            >
              <span>
                Project average <strong>{passRate.project}</strong>
              </span>
              <span>
                Company average <strong>{passRate.company}</strong>
              </span>
            </div>
            <div style={chartPlaceholderStyle}>
              Line chart: Project avg vs Company avg (Feb–Jun)
            </div>
          </Card>
          </div>

          {/* Card 8: Days Without an Incident */}
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
                Days Without an Incident
              </H2>
              <span style={{ color: "#666", cursor: "pointer" }}>⋯</span>
            </div>
            <div style={sectionLabelStyle}>Best Practice</div>
            <p style={insightStyle}>
              ⚡ Improve future outcomes by treating near-misses and minor
              incidents as learning opportunities.
            </p>
            <div style={sectionLabelStyle}>Days without Incidents</div>
            <div
              style={{
                display: "flex",
                gap: 24,
                marginBottom: 12,
                fontSize: "0.875rem",
              }}
            >
              <span>
                Recordable <strong>{daysWithoutIncident.recordable}</strong>
              </span>
              <span>
                Any incident <strong>{daysWithoutIncident.anyIncident}</strong>
              </span>
            </div>
            <p style={{ ...insightStyle, marginBottom: 16 }}>
              {incidentMessage}
            </p>
            <div style={{ textAlign: "right" }}>
              <Link href="#">Go To Report</Link>
            </div>
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
