
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ResponseForm } from "./responses/ResponseForm";

export function LeadDetail({ lead }: { lead: any }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="text-blue-500">View Details</button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{lead.property_type || 'Property'} in {lead.location || 'N/A'}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
          <div>
            <h3 className="font-semibold text-lg mb-4">Lead Details</h3>
            <div className="space-y-2">
              <p><strong>Status:</strong> {lead.status}</p>
              {/* Add more lead details here */}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Respond to Lead</h3>
            <ResponseForm leadId={lead.id} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
