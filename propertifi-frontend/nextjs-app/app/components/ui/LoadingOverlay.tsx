import { Spinner } from "./Spinner";

export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Spinner size="lg" />
    </div>
  );
}
