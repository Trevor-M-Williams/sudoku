"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { addUser } from "@/actions/users";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSudoku } from "@/context/sudoku-context";

export function UsernameModal() {
  const { user } = useSudoku();
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    if (user.username) return;
    setIsOpen(true);
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!user) return;
      if (user.username) return;

      await addUser(user.id, username);
      setIsOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent hideCloseButton>
        <DialogHeader>
          <DialogTitle>Choose your username</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !username.trim()}>
            {isLoading ? "Setting username..." : "Set Username"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
