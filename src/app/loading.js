import { UILoader } from "@/components/ui-loader";

export default function Loading() {
  return (
    <div className="flex flex-1 min-h-[60vh] items-center justify-center">
      <UILoader
        message="Loading WedPlan Experience"
        subtext="Curating exquisite wedding venues, artisans, and arrangements..."
      />
    </div>
  );
}
