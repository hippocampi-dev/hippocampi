import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const BYPASS_CODE = "000000"

export function BypassMFA(code: string, router: AppRouterInstance) {
  if (code === BYPASS_CODE) {
    router.push("/middle");
  }
}