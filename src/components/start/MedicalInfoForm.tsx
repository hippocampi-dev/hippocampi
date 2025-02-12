import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

export default function MedicalInfoForm() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Medical Information</h2>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Current Medications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="medication_name">Medication Name</Label>
            <Input id="medication_name" placeholder="Enter medication name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dosage">Dosage</Label>
            <Input id="dosage" placeholder="Enter dosage" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="frequency">Frequency</Label>
            <Select>
              <SelectTrigger id="frequency">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="as_needed">As Needed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="start_date">Start Date</Label>
            <Input id="start_date" type="date" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Allergies</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="allergen">Allergen</Label>
            <Input id="allergen" placeholder="Enter allergen" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reaction">Reaction</Label>
            <Textarea id="reaction" placeholder="Describe the reaction" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="severity">Severity</Label>
            <Select>
              <SelectTrigger id="severity">
                <SelectValue placeholder="Select severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mild">Mild</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="severe">Severe</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Diagnoses</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="condition">Condition</Label>
            <Input id="condition" placeholder="Enter condition name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="diagnosis_date">Diagnosis Date</Label>
            <Input id="diagnosis_date" type="date" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="in_remission">In Remission</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Cognitive Symptoms</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="symptom_type">Symptom Type</Label>
            <Input id="symptom_type" placeholder="Enter symptom type" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="onset_date">Onset Date</Label>
            <Input id="onset_date" type="date" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="severity_level">Severity Level (1-10)</Label>
            <Input id="severity_level" type="number" min="1" max="10" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" placeholder="Additional notes" />
          </div>
        </div>
      </div>
    </div>
  )
}

