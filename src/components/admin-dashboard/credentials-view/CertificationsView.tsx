import Image from "next/image"
import { Button } from "~/components/ui/button"
import { Card, CardContent } from "~/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog"
import { Label } from "~/components/ui/label"
import { FileText } from "lucide-react"
import { CertificationsForm } from "~/components/doctor-onboarding/CertificationsForm"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/components/ui/accordian"
import FileViewer from "./FileViewer"

interface CertificationsCredentialViewProps {
  data: CertificationsForm
}

export function CertificationsCredentialView({ data }: CertificationsCredentialViewProps) {
  return (
    <div className="space-y-6">
      <Accordion type="single" collapsible className="w-full">
        {data.certifications.map((cert) => (
          <AccordionItem key={cert.id} value={cert.id}>
            <AccordionTrigger className="hover:bg-muted/50 px-4">
              <div className="flex items-center gap-2">
                <span className="font-medium">{cert.name}</span>
                <span className="text-sm text-muted-foreground">({cert.organization})</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Certification Information</h3>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm text-muted-foreground">Name</Label>
                        <p className="font-medium">{cert.name}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Organization</Label>
                        <p className="font-medium">{cert.organization}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Date Received</Label>
                        <p className="font-medium">{cert.dateReceived}</p>
                      </div>
                      {cert.expirationDate && (
                        <div>
                          <Label className="text-sm text-muted-foreground">Expiration Date</Label>
                          <p className="font-medium">{cert.expirationDate}</p>
                        </div>
                      )}
                      <div>
                        <Label className="text-sm text-muted-foreground">Document</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span>{typeof cert.file === 'string' ? cert.file : ''}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Document Preview</h3>
                    <Dialog>
                      <DialogTrigger asChild>
                        <div className="border rounded-md cursor-pointer overflow-hidden hover:border-primary transition-colors">
                          <div className="bg-muted p-4 flex flex-col items-center justify-center gap-2 h-40">
                            <FileText className="h-10 w-10 text-muted-foreground" />
                            <div className="text-center">
                              <p className="font-medium text-sm">{typeof cert.file === 'string' ? cert.file : ''}</p>
                              <Button variant="secondary" size="sm" className="mt-2">
                                View Document
                              </Button>
                            </div>
                          </div>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="max-w-[90vw]">
                        <DialogHeader>
                          <DialogTitle>Certification Document</DialogTitle>
                        </DialogHeader>
                        <div className="relative h-[70vh] w-full bg-muted rounded-md overflow-hidden">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <FileViewer fileUrl={cert.fileUrl!} />
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}