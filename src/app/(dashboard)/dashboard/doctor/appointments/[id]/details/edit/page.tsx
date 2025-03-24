"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { jsPDF } from 'jspdf';

// Shadcn UI components
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Separator } from "~/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";
import { useToast } from "~/app/contexts/ToastContext"

// Icons
import { MoreHorizontal, Trash2, Plus, Save, FileText, ArrowLeft } from "lucide-react";
import { fetchDoctorDetails, getAppointmentDetails } from '~/app/_actions/schedule/actions';
import { getPatientDetails, getPatientMedicalHistory } from '~/app/_actions/users/actions';
import { uploadAppointmentNotesFile } from '~/app/_actions/blob/actions';

import { 
  saveConsultationDraft, 
  fetchConsultationNotes, 
  finalizeSaveConsultation,
  Section as ConsultationSection,
  MedicationRow as ConsultationMedicationRow
} from "~/app/_actions/schedule/actions";
import { AppointmentsInterface } from '~/server/db/type';

interface Section {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'table';
  required?: boolean;
}

interface MedicationRow {
  name: string;
  dosage: string;
  frequency: string;
  purpose: string;
}

export default function ConsultationTemplateEdit() {
  const params = useParams<{ id: string}>()
  const router = useRouter();
  const templateRef = useRef<HTMLDivElement>(null);
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const { toast } = useToast();
  
  const initialSections: Section[] = [
    { id: 'patientInfo', title: 'Patient Information', content: '', type: 'text', required: true },
    { id: 'reasonForConsultation', title: 'Reason for Consultation', content: '', type: 'text', required: true },
    { id: 'symptomSeverity', title: 'Symptom Severity', content: '', type: 'text' },
    { id: 'medicalHistory', title: 'Relevant Medical History', content: '', type: 'text' },
    // { id: 'medications', title: 'Current Medications', content: '', type: 'table' },
    { id: 'assessmentResults', title: 'Neuropsychological and Cognitive Assessment Results', content: '', type: 'text' },
    { id: 'patientReportedOutcomes', title: 'Patient-Reported Outcomes', content: '', type: 'text' },
    { id: 'clinicalObservations', title: 'Clinical Observations', content: '', type: 'text' },
    { id: 'interventions', title: 'Recommended Interventions', content: '', type: 'text' },
    { id: 'followUp', title: 'Next Steps & Follow-Up Plan', content: '', type: 'text' },
    { id: 'additionalNotes', title: 'Additional Notes & Recommendations', content: '', type: 'text' },
    { id: 'signature', title: 'Consulting Specialist Signature', content: '', type: 'text', required: true }
  ];
  
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [patientName, setPatientName] = useState('');
  const [dob, setDob] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [consultingSpecialist, setConsultingSpecialist] = useState('');
  
  const [appointment, setAppointment] = useState<AppointmentsInterface | null>(null);
  // const [medicationRows, setMedicationRows] = useState<MedicationRow[]>([
  //   { name: 'B Complex Vitamins (VITAMIN B COMPLEX) capsule', dosage: '', frequency: 'Take 1 capsule by mouth daily', purpose: '' }
  // ]);

  useEffect(() => {
    const getAppointmentDetailsFunction = async () => {
      try {
        const appointmentDetails = await getAppointmentDetails(params.id);
        const patient = await getPatientDetails(appointmentDetails.patientId);
        const medicalHistory = await getPatientMedicalHistory(appointmentDetails.patientId);
        const doctor = await fetchDoctorDetails(appointmentDetails.doctorId as "string");

        // Set initial values
        setAppointment(appointmentDetails);
        setAppointmentDate(appointmentDetails.scheduledAt?.toISOString().split('T')[0] ?? '');
        setPatientName(patient?.firstName + " " + patient?.lastName);
        setDob(patient?.dateOfBirth?.toISOString().split('T')[0] || '');
        setConsultingSpecialist("Dr. " + doctor?.firstName + " " + doctor?.lastName);
        if (medicalHistory) {
          const mH = `Existing conditions: ${medicalHistory?.existingDiagnoses}\nFamily History of Neurological Disorders: ${medicalHistory?.familyHistoryOfNeurologicalDisorders}\nHistory of chemotherapy or radiation therapy: ${medicalHistory?.historyOfChemotherapyOrRadiationTherapy}`
          setSections(
            sections.map(section => ({
              ...section,
              content: section.id === 'medicalHistory' ? mH : section.content
            }))
          );
        }

        setSections(
          sections.map(section => ({
            ...section,
            content: section.id === 'reasonForConsultation' ? appointmentDetails.reason! : section.content
          }))
        );
        
        // Fetch existing consultation notes if any
        const notesResponse = await fetchConsultationNotes(params.id);
        if (notesResponse.success && notesResponse.data) {
          const savedNotes = notesResponse.data;
          
          // Restore saved data
          if (savedNotes.patientName) setPatientName(savedNotes.patientName);
          if (savedNotes.patientDob) setDob(savedNotes.patientDob);
          if (savedNotes.appointmentDate) setAppointmentDate(savedNotes.appointmentDate);
          if (savedNotes.consultingSpecialist) setConsultingSpecialist(savedNotes.consultingSpecialist);
          
          // Restore sections
          if (savedNotes.sections && Object.keys(savedNotes.sections).length !== 0 && savedNotes.sections.constructor == Object) {
            setSections(savedNotes.sections as Section[]);
          }
          
          // Restore medications
          // if (savedNotes.medications) setMedicationRows(savedNotes.medications as MedicationRow[]);
          
          // Update draft status
          setIsDraftSaved(!savedNotes.isDraft);
        }
      } catch (error) {
        console.error("Failed to fetch appointment details:", error);
        toast({
          title: "Error",
          description: "Failed to load appointment details. Please try again.",
          variant: "destructive"
        });
      }
    };
    
    getAppointmentDetailsFunction();
  }, [params.id, toast]);
  
  const deleteSection = (id: string) => {
    const sectionToDelete = sections.find(s => s.id === id);
    if (sectionToDelete?.required) {
      toast({
        title: "Cannot Delete Section",
        description: "This section is required and cannot be deleted.",
        variant: "destructive"
      });
      return;
    }
    setSections(sections.filter(section => section.id !== id));
  };

  const addSectionBelow = (currentId: string) => {
    const currentIndex = sections.findIndex(s => s.id === currentId);
    const newSection: Section = {
      id: `section-${Date.now()}`,
      title: 'New Section',
      content: '',
      type: 'text'
    };
    
    const newSections = [...sections];
    newSections.splice(currentIndex + 1, 0, newSection);
    setSections(newSections);
  };

  const updateSectionTitle = (id: string, newTitle: string) => {
    setSections(prevSections => 
      prevSections.map(section => 
        section.id === id ? { ...section, title: newTitle } : section
      )
    );
  };

  // const updateMedicationRow = (index: number, field: keyof MedicationRow, value: string) => {
  //   const updatedRows = [...medicationRows];
  //   updatedRows[index] = {
  //     name: updatedRows[index]?.name ?? '',
  //     dosage: updatedRows[index]?.dosage ?? '',
  //     frequency: updatedRows[index]?.frequency ?? '',
  //     purpose: updatedRows[index]?.purpose ?? '',
  //     [field]: value,
  //   };
  //   setMedicationRows(updatedRows);
  // };

  // const addMedicationRow = () => {
  //   setMedicationRows([...medicationRows, { name: '', dosage: '', frequency: '', purpose: '' }]);
  // };

  const saveDraft = async () => {
    try {
      const response = await saveConsultationDraft({
        appointmentId: params.id,
        patientName,
        patientDob: dob,
        appointmentDate,
        consultingSpecialist,
        sections,
        // medications: medicationRows
      });
      
      if (response.success) {
        setIsDraftSaved(true);
        toast({
          title: "Draft Saved",
          description: "Your consultation draft has been saved successfully."
        });
      } else {
        throw new Error(response.error || "Failed to save draft");
      }
    } catch (error) {
      console.error("Error saving draft:", error);
      toast({
        title: "Error",
        description: "Failed to save your draft. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Function to format the date in a readable format
  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  };

  // Generate PDF as text
  const generatePDF = async () => {
    try {
      // First save the consultation as finalized (not a draft)
      const saveResponse = await finalizeSaveConsultation({
        appointmentId: params.id,
        patientName,
        patientDob: dob,
        appointmentDate,
        consultingSpecialist,
        sections,
        // medications: medicationRows
      });
      
      if (!saveResponse.success) {
        throw new Error("Failed to save consultation before generating PDF");
      }

      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Set font
      doc.setFont('helvetica');
      doc.setFontSize(12);
      
      // Header
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(`${consultingSpecialist} at ${formatDate(appointmentDate)}`, 20, 20);
      doc.text("WELL-CHILD CARE - ADOLESCENT", 20, 30);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`PATIENT: ${patientName}`, 20, 40);
      doc.text(`MRN: 3723840`, 20, 46); // Example MRN
      doc.text(`DOB: ${formatDate(dob)}`, 20, 52);
      doc.text(`DATE OF SERVICE: ${formatDate(appointmentDate)}`, 20, 58);
      
      let yPosition = 70;

      // Add each section to the PDF as text
      for (const section of sections) {
        // Check if we need to add a new page
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }

        // Section title
        doc.setFont('helvetica', 'bold');
        doc.text(section.title + ":", 20, yPosition);
        yPosition += 8;
        doc.setFont('helvetica', 'normal');

        // Section content
        if (section.type === 'text') {
          // Handle text content with line wrapping
          const textLines = doc.splitTextToSize(section.content || 'No data recorded', 170);
          doc.text(textLines, 20, yPosition);
          yPosition += 6 * textLines.length + 10;
        } 
        // else if (section.type === 'table' && section.id === 'medications') {
        //   // Handle medications table
        //   doc.text("Medication | Dosage | Frequency | Purpose", 20, yPosition);
        //   yPosition += 8;

        //   for (const med of medicationRows) {
        //     const medText = `${med.name} | ${med.dosage} | ${med.frequency} | ${med.purpose}`;
        //     const medLines = doc.splitTextToSize(medText, 170);
        //     doc.text(medLines, 20, yPosition);
        //     yPosition += 6 * medLines.length + 4;
        //   }
        //   yPosition += 6;
        // }
      }

      // Add signature at the end
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFont('helvetica', 'bold');
      doc.text(`${consultingSpecialist}`, 20, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.text(formatDate(appointmentDate), 120, yPosition);
      // Save PDF

      doc.save(`consultation_${params.id}.pdf`);
      setIsDraftSaved(true);
      toast({
        title: "PDF Generated",
        description: "Your consultation has been saved as a text-based PDF."
      });

      
      // Placeholder for database action
      console.log("Uploading PDF to database...");
      // In a real app: await savePdfToDatabase({ appointmentId: params.id, pdfData: doc.output('blob') });
      if (appointment) {
        const pdfBlob = doc.output('blob');
        const pdfFile = new File([pdfBlob], `consultation_${params.id}.pdf`, { type: 'application/pdf' });
        const uploadResult = await uploadAppointmentNotesFile(
          appointment.doctorId, 
          appointment.patientId, 
          appointment.id!, 
          pdfFile
        );
        
        setIsDraftSaved(true);
        toast({
          title: "PDF Generated",
          description: "Your consultation has been saved as a text-based PDF."
        });
        
        // After successful generation, direct the user back to details
        router.push(`/dashboard/doctor/appointments/${params.id}/details`);
      }
      
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (id: string, value: string) => {
    setSections(prevSections => 
      prevSections.map(section => 
        section.id === id ? { ...section, content: value } : section
      )
    );
  };

  return (
    <div className="relative overflow-visible" style={{ contain: 'paint' }}>
      <div className="max-w-4xl mx-auto pb-20">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl font-bold">Consultation Note Template</CardTitle>
            <div className="flex space-x-2">
              <Button 
                variant="outline"
                onClick={() => router.push(`/dashboard/doctor/appointments/${params.id}/details`)}
                disabled={!isDraftSaved}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Go to Details
              </Button>
              <Button
                variant="secondary"
                onClick={saveDraft}
              >
                <Save className="mr-2 h-4 w-4" /> Save Draft
              </Button>
              <Button
                onClick={generatePDF}
              >
                <FileText className="mr-2 h-4 w-4" /> Generate PDF
              </Button>
            </div>
          </CardHeader>
          
          <CardContent>
            <div ref={templateRef} className="overflow-visible">
              {/* Patient info section */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="patientName">Patient Name</Label>
                  <Input
                    id="patientName"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Enter patient name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={dob}
                    onChange={(e) => {setDob(e.target.value)}}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="appointmentDate">Appointment Date</Label>
                  <Input
                    id="appointmentDate"
                    type="date"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="consultingSpecialist">Consulting Specialist</Label>
                  <Input
                    id="consultingSpecialist"
                    value={consultingSpecialist}
                    onChange={(e) => setConsultingSpecialist(e.target.value)}
                    placeholder="Enter specialist name"
                  />
                </div>
              </div>

              <Separator className="mb-6" />

              {/* Dynamic sections */}
              {sections.map((section, index) => (
                <div key={section.id} className="group mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {section.required ? (
                        <h3 className="text-lg font-medium">{section.title}<span className="text-red-500">*</span></h3>
                      ) : (
                        <Input
                          value={section.title}
                          onChange={(e) => updateSectionTitle(section.id, e.target.value)}
                          className="font-medium text-lg h-8 w-auto min-w-[400px]"
                        />
                      )}
                    </div>

                    <TooltipProvider>
                      <DropdownMenu>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Section options</p>
                          </TooltipContent>
                        </Tooltip>
                        <DropdownMenuContent align="end">
                          {!section.required && (
                            <DropdownMenuItem onClick={() => deleteSection(section.id)}>
                              <Trash2 className="mr-2 h-4 w-4" /> Delete Section
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => addSectionBelow(section.id)}>
                            <Plus className="mr-2 h-4 w-4" /> Add Section Below
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TooltipProvider>
                  </div>

                  {section.type === 'text' && (
                    <Textarea
                      value={section.content}
                      onChange={(e) => handleInputChange(section.id, e.target.value)}
                      placeholder={`Enter ${section.title.toLowerCase()} here...`}
                      className="min-h-[100px] w-full resize-y"
                    />
                  )}

                  {/* {section.type === 'table' && section.id === 'medications' && (
                    <div className="border rounded-md">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Medication Name</TableHead>
                              <TableHead>Dosage</TableHead>
                              <TableHead>Frequency</TableHead>
                              <TableHead>Purpose</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {medicationRows.map((row, rowIndex) => (
                              <TableRow key={rowIndex}>
                                <TableCell>
                                  <Input 
                                    className="w-full focus-visible:ring-offset-0" 
                                    placeholder="Medication name"
                                    value={row.name}
                                    onChange={(e) => updateMedicationRow(rowIndex, 'name', e.target.value)} 
                                  />
                                </TableCell>
                                <TableCell>
                                  <Input 
                                    className="w-full focus-visible:ring-offset-0" 
                                    placeholder="Dosage"
                                    value={row.dosage}
                                    onChange={(e) => updateMedicationRow(rowIndex, 'dosage', e.target.value)}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Input 
                                    className="w-full focus-visible:ring-offset-0" 
                                    placeholder="Frequency"
                                    value={row.frequency}
                                    onChange={(e) => updateMedicationRow(rowIndex, 'frequency', e.target.value)}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Input 
                                    className="w-full focus-visible:ring-offset-0" 
                                    placeholder="Purpose"
                                    value={row.purpose}
                                    onChange={(e) => updateMedicationRow(rowIndex, 'purpose', e.target.value)}
                                  />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                      <div className="p-2">
                        <Button variant="outline" size="sm" onClick={addMedicationRow}>
                          <Plus className="h-4 w-4 mr-2" /> Add Medication
                        </Button>
                      </div>
                    </div>
                  )} */}

                  {index < sections.length - 1 && <Separator className="my-6" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

