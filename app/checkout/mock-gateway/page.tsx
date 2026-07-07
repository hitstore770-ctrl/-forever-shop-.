import type { Metadata } from "next";
import { Suspense } from "react";
import MockGatewayScreen from "@/components/checkout/MockGatewayScreen";

export const metadata: Metadata = {
  title: "מסוף סליקה",
};

export default function MockGatewayPage() {
  return (
    <Suspense>
      <MockGatewayScreen />
    </Suspense>
  );
}
