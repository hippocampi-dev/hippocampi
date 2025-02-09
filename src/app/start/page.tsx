"use client";

import { useState } from "react";
import RoleForm from "~/components/signup/page";

export default function RoleSelect() {
  const [selectedRole, setSelectedRole] = useState<string | undefined>();

  return (
    <main>
      <RoleForm />
    </main>
  );
}
