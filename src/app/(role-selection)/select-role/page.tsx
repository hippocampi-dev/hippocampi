import SelectRolePage from "~/components/start/SelectRolePage";
import { SessionProvider } from "next-auth/react";

export default function SelectRole() {
  return (
    <SessionProvider>
      <SelectRolePage />
    </SessionProvider>
  );
}
