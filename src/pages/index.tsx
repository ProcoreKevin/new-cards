import dynamic from "next/dynamic";

const SafetyHubDashboard = dynamic(
  () => import("@/components/SafetyHubDashboard"),
  {
    ssr: false,
    loading: () => <p style={{ padding: 40 }}>Loading…</p>,
  }
);

export default function Home() {
  return <SafetyHubDashboard />;
}
