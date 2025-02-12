import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

export default function PersonalInfoForm() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first_name">First Name</Label>
          <Input id="first_name" placeholder="Enter your first name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last_name">Last Name</Label>
          <Input id="last_name" placeholder="Enter your last name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="middle_initial">Middle Initial</Label>
          <Input id="middle_initial" placeholder="M" maxLength={1} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="date_of_birth">Date of Birth</Label>
          <Input id="date_of_birth" type="date" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select>
            <SelectTrigger id="gender">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="primary_language">Primary Language</Label>
          <Input id="primary_language" placeholder="Enter your primary language" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone_number">Phone Number</Label>
          <Input id="phone_number" placeholder="Enter your phone number" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="Enter your email" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="street_address">Street Address</Label>
        <Input id="street_address" placeholder="Enter your street address" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input id="city" placeholder="Enter your city" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Input id="state" placeholder="Enter your state" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="zip_code">ZIP Code</Label>
          <Input id="zip_code" placeholder="Enter your ZIP code" />
        </div>
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Emergency Contact</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="emergency_name">Name</Label>
            <Input id="emergency_name" placeholder="Enter emergency contact name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="emergency_relationship">Relationship</Label>
            <Select>
              <SelectTrigger id="emergency_relationship">
                <SelectValue placeholder="Select relationship" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="spouse">Spouse</SelectItem>
                <SelectItem value="parent">Parent</SelectItem>
                <SelectItem value="child">Child</SelectItem>
                <SelectItem value="sibling">Sibling</SelectItem>
                <SelectItem value="friend">Friend</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="emergency_phone">Phone Number</Label>
            <Input id="emergency_phone" placeholder="Enter emergency contact phone" />
          </div>
        </div>
      </div>
    </div>
  )
}

