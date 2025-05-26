import { Dialog, DialogContent } from "../../../../components/ui/dialog";

export function ViewWhatsApp({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                    ver whatsapp
            </DialogContent>
        </Dialog>
    )
}