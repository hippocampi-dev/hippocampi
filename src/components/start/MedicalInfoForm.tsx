// components/start/MedicalInfoForm.tsx
"use client";

import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";

export type Medication = {
  medicationName: string;
  dosage: string;
  frequency: "daily" | "weekly" | "monthly" | "as_needed";
  start_date: string;
  end_date?: string;
};

export type Allergy = {
  allergen: string;
  reaction: string;
  severity: "mild" | "moderate" | "severe";
};

export type Diagnosis = {
  conditionName: string;
  diagnosisDate: string;
  selfReported: boolean;
  notes?: string;
};

export type CognitiveSymptom = {
  symptomType: string;
  onsetDate: string;
  severityLevel?: "mild" | "moderate" | "severe";
  notes?: string;
};

export type MedicalInfo = {
  medications: Medication[];
  allergies: Allergy[];
  diagnosis?: Diagnosis;
  cognitiveSymptoms?: CognitiveSymptom;
};

type MedicalInfoFormProps = {
  data: MedicalInfo;
  onChange: (data: MedicalInfo) => void;
};

export default function MedicalInfoForm({ data, onChange }: MedicalInfoFormProps) {
  // Handlers for medications
  const handleAddMedication = () => {
    onChange({
      ...data,
      medications: [
        ...data.medications,
        { medicationName: "", dosage: "", frequency: "daily", start_date: "", end_date: "" },
      ],
    });
  };

  const handleRemoveMedication = (index: number) => {
    const meds = [...data.medications];
    meds.splice(index, 1);
    onChange({ ...data, medications: meds });
  };

  // Handlers for allergies
  const handleAddAllergy = () => {
    onChange({
      ...data,
      allergies: [
        ...data.allergies,
        { allergen: "", reaction: "", severity: "mild" },
      ],
    });
  };

  const handleRemoveAllergy = (index: number) => {
    const allys = [...data.allergies];
    allys.splice(index, 1);
    onChange({ ...data, allergies: allys });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Medical Information</h2>
      
      {/* Medications Section */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Current Medications</h3>
        {data.medications.map((med, i) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor={`medicationName_${i}`}>Medication Name</Label>
              <Input
                id={`medicationName_${i}`}
                placeholder="Enter medication name"
                value={med.medicationName}
                onChange={(e) => {
                  const meds = [...data.medications];
                  meds[i].medicationName = e.target.value;
                  onChange({ ...data, medications: meds });
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`dosage_${i}`}>Dosage</Label>
              <Input
                id={`dosage_${i}`}
                placeholder="Enter dosage"
                value={med.dosage}
                onChange={(e) => {
                  const meds = [...data.medications];
                  meds[i].dosage = e.target.value;
                  onChange({ ...data, medications: meds });
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`frequency_${i}`}>Frequency</Label>
              <Select
                value={med.frequency}
                onValueChange={(value) => {
                  const meds = [...data.medications];
                  meds[i].frequency = value as Medication["frequency"];
                  onChange({ ...data, medications: meds });
                }}
              >   
                <SelectTrigger id={`frequency_${i}`}>
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
              <Label htmlFor={`start_date_${i}`}>Start Date</Label>
              <Input
                id={`start_date_${i}`}
                type="date"
                value={med.start_date}
                onChange={(e) => {
                  const meds = [...data.medications];
                  meds[i].start_date = e.target.value;
                  onChange({ ...data, medications: meds });
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`end_date_${i}`}>End Date</Label>
              <Input
                id={`end_date_${i}`}
                type="date"
                value={med.end_date}
                onChange={(e) => {
                  const meds = [...data.medications];
                  meds[i].end_date = e.target.value;
                  onChange({ ...data, medications: meds });
                }}
              />
            </div>
            <div className="flex items-center">
              <Button variant="outline" onClick={() => handleRemoveMedication(i)}>
                Remove Medication
              </Button>
            </div>
          </div>
        ))}
        <Button onClick={handleAddMedication}>Add Medication</Button>
      </div>

      {/* Allergies Section */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Allergies</h3>
        {data.allergies.map((allergy, i) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor={`allergen_${i}`}>Allergen</Label>
              <Input
                id={`allergen_${i}`}
                placeholder="Enter allergen"
                value={allergy.allergen}
                onChange={(e) => {
                  const allers = [...data.allergies];
                  allers[i].allergen = e.target.value;
                  onChange({ ...data, allergies: allers });
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`reaction_${i}`}>Reaction</Label>
              <Textarea
                id={`reaction_${i}`}
                placeholder="Describe the reaction"
                value={allergy.reaction}
                onChange={(e) => {
                  const allers = [...data.allergies];
                  allers[i].reaction = e.target.value;
                  onChange({ ...data, allergies: allers });
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`severity_${i}`}>Severity</Label>
              <Select
                value={allergy.severity}
                onValueChange={(value) => {
                  const allers = [...data.allergies];
                  allers[i].severity = value as Allergy["severity"];
                  onChange({ ...data, allergies: allers });
                }}
              >
                <SelectTrigger id={`severity_${i}`}>
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mild">Mild</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="severe">Severe</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center">
              <Button variant="outline" onClick={() => handleRemoveAllergy(i)}>
                Remove Allergy
              </Button>
            </div>
          </div>
        ))}
        <Button onClick={handleAddAllergy}>Add Allergy</Button>
      </div>

      {/* Diagnoses Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Diagnosis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="conditionName">Condition Name</Label>
            <Input
              id="conditionName"
              placeholder="Enter condition name"
              value={data.diagnosis?.conditionName || ""}
              onChange={(e) =>
                onChange({
                  ...data,
                  diagnosis: { 
                    ...data.diagnosis, 
                    conditionName: e.target.value 
                  },
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="diagnosisDate">Diagnosis Date</Label>
            <Input
              id="diagnosisDate"
              type="date"
              value={data.diagnosis?.diagnosisDate || ""}
              onChange={(e) =>
                onChange({
                  ...data,
                  diagnosis: { 
                    ...data.diagnosis, 
                    diagnosisDate: e.target.value 
                  },
                })
              }
            />
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="selfReported">Self Reported?</Label>
            <input
              id="selfReported"
              type="checkbox"
              checked={data.diagnosis?.selfReported || false}
              onChange={(e) =>
                onChange({
                  ...data,
                  diagnosis: { 
                    ...data.diagnosis, 
                    selfReported: e.target.checked 
                  },
                })
              }
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="diagnosisNotes">Diagnosis Notes</Label>
            <Textarea
              id="diagnosisNotes"
              placeholder="Additional notes about your diagnosis"
              value={data.diagnosis?.notes || ""}
              onChange={(e) =>
                onChange({
                  ...data,
                  diagnosis: { 
                    ...data.diagnosis, 
                    notes: e.target.value 
                  },
                })
              }
            />
          </div>
        </div>
      </div>

      {/* Cognitive Symptoms Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Cognitive Symptoms</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="symptomType">Symptom Type</Label>
            <Input
              id="symptomType"
              placeholder="Enter symptom type"
              value={data.cognitiveSymptoms?.symptomType || ""}
              onChange={(e) =>
                onChange({
                  ...data,
                  cognitiveSymptoms: {
                    ...data.cognitiveSymptoms,
                    symptomType: e.target.value,
                  },
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="onsetDate">Onset Date</Label>
            <Input
              id="onsetDate"
              type="date"
              value={data.cognitiveSymptoms?.onsetDate || ""}
              onChange={(e) =>
                onChange({
                  ...data,
                  cognitiveSymptoms: {
                    ...data.cognitiveSymptoms,
                    onsetDate: e.target.value,
                  },
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="severityLevel">Severity Level</Label>
            <Select
              value={data.cognitiveSymptoms?.severityLevel || ""}
              onValueChange={(value) =>
                onChange({
                  ...data,
                  cognitiveSymptoms: {
                    ...data.cognitiveSymptoms,
                    severityLevel: value as "mild" | "moderate" | "severe",
                  },
                })
              }
            >
              <SelectTrigger id="severityLevel">
                <SelectValue placeholder="Select severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mild">Mild</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="severe">Severe</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="cognitiveNotes">Additional Notes</Label>
            <Textarea
              id="cognitiveNotes"
              placeholder="Enter additional details about your cognitive symptoms"
              value={data.cognitiveSymptoms?.notes || ""}
              onChange={(e) =>
                onChange({
                  ...data,
                  cognitiveSymptoms: {
                    ...data.cognitiveSymptoms,
                    notes: e.target.value,
                  },
                })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
