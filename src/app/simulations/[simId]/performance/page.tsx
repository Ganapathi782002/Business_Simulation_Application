import { PerformancePage } from "@/components/performance/performance-page";

export default function ViewPerformancePage({ params }: { params: { simId: string } }) {
  return <PerformancePage simulationId={params.simId} />;
}