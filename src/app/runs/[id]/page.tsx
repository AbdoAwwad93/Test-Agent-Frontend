import RunDetail from "./RunDetail";

export default function RunDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <RunDetail params={params} />;
}
