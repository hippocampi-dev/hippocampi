// components/start/PersonalInfoForm.tsx
"use client";

import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

type PersonalInfoFormProps = {
  data: {
    first_name: string;
    last_name: string;
    middle_initial: string;
    date_of_birth: string;
    gender: "male" | "female" | "other" | "prefer_not_to_say";
    primary_language: string;
    phone_number: string;
    email: string;
    street_address?: string;
    city?: string;
    state?: string;
    zip_code?: string;
  };
  onChange: (data: PersonalInfoFormProps["data"]) => void;
};

export default function PersonalInfoForm({ data, onChange }: PersonalInfoFormProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first_name">First Name</Label>
          <Input
            id="first_name"
            placeholder="Enter your first name"
            value={data.first_name}
            onChange={(e) => onChange({ ...data, first_name: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last_name">Last Name</Label>
          <Input
            id="last_name"
            placeholder="Enter your last name"
            value={data.last_name}
            onChange={(e) => onChange({ ...data, last_name: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="middle_initial">Middle Initial</Label>
          <Input
            id="middle_initial"
            placeholder="M"
            maxLength={1}
            value={data.middle_initial}
            onChange={(e) => onChange({ ...data, middle_initial: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="date_of_birth">Date of Birth</Label>
          <Input
            id="date_of_birth"
            type="date"
            value={data.date_of_birth}
            onChange={(e) => onChange({ ...data, date_of_birth: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select
            value={data.gender}
            onValueChange={(value) =>
              onChange({ ...data, gender: value as PersonalInfoFormProps["data"]["gender"] })
            }
          >
            <SelectTrigger id="gender">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
              <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="primary_language">Primary Language</Label>
          <Input
            id="primary_language"
            placeholder="Enter your primary language"
            value={data.primary_language}
            onChange={(e) => onChange({ ...data, primary_language: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone_number">Phone Number</Label>
          <Input
            id="phone_number"
            placeholder="Enter your phone number"
            value={data.phone_number}
            onChange={(e) => onChange({ ...data, phone_number: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={data.email}
            onChange={(e) => onChange({ ...data, email: e.target.value })}
            required
          />
        </div>
      </div>
      <div className="space-y-4 mt-4">
        <Label htmlFor="street_address">Street Address</Label>
        <Input
          id="street_address"
          placeholder="Enter your street address"
          value={data.street_address || ""}
          onChange={(e) => onChange({ ...data, street_address: e.target.value })}
          required
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            placeholder="Enter your city"
            value={data.city || ""}
            onChange={(e) => onChange({ ...data, city: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            placeholder="Enter your state"
            value={data.state || ""}
            onChange={(e) => onChange({ ...data, state: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="zip_code">ZIP Code</Label>
          <Input
            id="zip_code"
            placeholder="Enter your ZIP code"
            value={data.zip_code || ""}
            onChange={(e) => onChange({ ...data, zip_code: e.target.value })}
            required
          />
        </div>
      </div>
    </div>
  );
}
