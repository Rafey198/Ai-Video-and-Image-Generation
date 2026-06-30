import { StudioHub } from "@/components/digital-product/StudioHub";
import { DigitalProductTestGuide } from "@/components/digital-product/DigitalProductTestGuide";

export default function DigitalProductPage() {
  return (
    <div className="space-y-8">
      <DigitalProductTestGuide />
      <StudioHub />
    </div>
  );
}
