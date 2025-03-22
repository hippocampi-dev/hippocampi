import Image from "next/image"
import { Button } from "~/components/ui/button"
import { Card, CardContent } from "~/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog"
import { Label } from "~/components/ui/label"
import { FileText } from "lucide-react"
import { MalpracticeForm } from "~/components/doctor-onboarding/MalpracticeForm"
import FileViewer from "./FileViewer"

interface MalpracticeCredentialViewProps {
  data: MalpracticeForm
}

export function MalpracticeCredentialView({ data }: MalpracticeCredentialViewProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Malpractice Insurance Information</h3>
            <div className="space-y-4">
              <div>
                <Label className="text-sm text-muted-foreground">Policy Number</Label>
                <p className="font-medium">{data.policyNumber}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Insurer Name</Label>
                <p className="font-medium">{data.insurerName}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Start Date</Label>
                <p className="font-medium">{data.startDate}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Expiration Date</Label>
                <p className="font-medium">{data.expirationDate}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Coverage Amount</Label>
                <p className="font-medium">{data.coverageAmount}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Document</Label>
                <div className="flex items-center gap-2 mt-1">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>{typeof data.file === 'string' ? data.file : ''}</span>
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
                      <p className="font-medium text-sm">{typeof data.file === 'string' ? data.file : ''}</p>
                      <Button variant="secondary" size="sm" className="mt-2">
                        View Document
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-[90vw]">
                <DialogHeader>
                  <DialogTitle>Malpractice Insurance Document</DialogTitle>
                </DialogHeader>
                <div className="relative h-[70vh] w-full bg-muted rounded-md overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FileViewer fileUrl={data.fileUrl!} />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}