import { requireAuth, useAuth } from "@/auth";
import { useRuntimeConfig } from "@/runtimeConfig";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute('/secure')({
  component: RouteComponent,
})

function RouteComponent() {
  requireAuth()

  const { keycloak } = useAuth();
  const { gatewayUrl } = useRuntimeConfig();
  const { data } = useSuspenseQuery({
    queryKey: ["protected"],
    queryFn: async () => {
      const res = await fetch(`${gatewayUrl}/example/v1/protected`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${keycloak.token}`,
        },
      });
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      return res.json();
    },
  });

  return <div>Fetched you secure data: {JSON.stringify(data)}</div>
}
