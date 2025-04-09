"use client";

import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type PersonalInfoFormProps = {
  data: {
    firstName: string;
    lastName: string;
    middle_initial: string;
    condition: string;
    dateOfBirth: string;
    gender: "male" | "female" | "other" | "prefer_not_to_say";
    primaryLanguage: string;
    phoneNumber: string;
    email: string;
    streetAddress?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    termsOfService: boolean;
    hipaaCompliance: boolean;
  };
  onChange: (data: PersonalInfoFormProps["data"]) => void;
};

export default function PersonalInfoForm({ data, onChange }: PersonalInfoFormProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            placeholder="Enter your first name"
            value={data.firstName}
            onChange={(e) => onChange({ ...data, firstName: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            placeholder="Enter your last name"
            value={data.lastName}
            onChange={(e) => onChange({ ...data, lastName: e.target.value })}
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
          <Label htmlFor="condition">Condition</Label>
          <Input
            id="condition"
            placeholder="Enter your condition"
            value={data.condition}
            onChange={(e) => onChange({ ...data, condition: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={data.dateOfBirth}
            onChange={(e) => onChange({ ...data, dateOfBirth: e.target.value })}
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
          <Label htmlFor="primaryLanguage">Primary Language</Label>
          <Input
            id="primaryLanguage"
            placeholder="Enter your primary language"
            value={data.primaryLanguage}
            onChange={(e) => onChange({ ...data, primaryLanguage: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            placeholder="Enter your phone number"
            value={data.phoneNumber}
            onChange={(e) => onChange({ ...data, phoneNumber: e.target.value })}
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
        <Label htmlFor="streetAddress">Street Address</Label>
        <Input
          id="streetAddress"
          placeholder="Enter your street address"
          value={data.streetAddress || ""}
          onChange={(e) => onChange({ ...data, streetAddress: e.target.value })}
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
          <Label htmlFor="zipCode">ZIP Code</Label>
          <Input
            id="zipCode"
            placeholder="Enter your ZIP code"
            value={data.zipCode || ""}
            onChange={(e) => onChange({ ...data, zipCode: e.target.value })}
            required
          />
        </div>
      </div>

      {/* New Section for Terms of Service & HIPAA Compliance */}
      <div className="mt-6 space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="termsOfService"
            checked={data.termsOfService}
            onChange={(e) => onChange({ ...data, termsOfService: e.target.checked })}
            className="mr-2"
          />
          <Label htmlFor="termsOfService">
            I agree to the <a href="/legal/terms-of-use" className="text-blue-500 underline text-sm" target="_blank" rel="noopener noreferrer">Terms of Service</a>
          </Label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="hipaaCompliance"
            checked={data.hipaaCompliance}
            onChange={(e) => onChange({ ...data, hipaaCompliance: e.target.checked })}
            className="mr-2"
          />
          <Label htmlFor="hipaaCompliance">
            I confirm that I have read and agree to the HIPAA compliance policy.
          </Label>
        </div>
      </div>
    </div>
  );
}
