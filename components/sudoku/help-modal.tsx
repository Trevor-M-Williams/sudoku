import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function HelpModal() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <HelpCircle className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md rounded">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span>Click empty cell</span>
                <span className="font-medium">Select cell</span>
              </li>
              <li className="flex justify-between">
                <span>Click filled cell</span>
                <span className="font-medium">Select number</span>
              </li>
              <li className="flex justify-between">
                <span>1-9</span>
                <span className="font-medium">Fill cell</span>
              </li>
              <li className="flex justify-between">
                <span>Backspace / Delete</span>
                <span className="font-medium">Clear cell</span>
              </li>

              <li className="flex justify-between">
                <span>⌘ + 1-9</span>
                <span className="font-medium">Select number</span>
              </li>
              <li className="flex justify-between">
                <span>⌘ + Click</span>
                <span className="font-medium">Fill selected number</span>
              </li>
              <li className="flex justify-between">
                <span>⌥ + Click</span>
                <span className="font-medium">Toggle note</span>
              </li>

              <li className="flex justify-between">
                <span>⌘ + Z</span>
                <span className="font-medium">Undo</span>
              </li>
              <li className="flex justify-between">
                <span>⌘ + Shift +Z</span>
                <span className="font-medium">Redo</span>
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
