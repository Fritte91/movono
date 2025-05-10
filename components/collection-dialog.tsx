"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import type { Collection } from "@/lib/collections-data"
import { useToast } from "@/components/ui/use-toast"

interface CollectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  collection?: Collection
  onSave: (collection: Partial<Collection>) => void
}

export function CollectionDialog({ open, onOpenChange, collection, onSave }: CollectionDialogProps) {
  const isEditing = !!collection
  const { toast } = useToast()

  const [name, setName] = useState(collection?.name || "")
  const [description, setDescription] = useState(collection?.description || "")
  const [isPublic, setIsPublic] = useState(collection?.isPublic || false)

  const handleSave = () => {
    if (!name.trim()) {
      toast({
        title: "Collection name required",
        description: "Please enter a name for your collection.",
        variant: "destructive",
      })
      return
    }

    onSave({
      id: collection?.id,
      name,
      description,
      isPublic,
    })

    // Reset form
    if (!isEditing) {
      setName("")
      setDescription("")
      setIsPublic(false)
    }

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Collection" : "Create New Collection"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update your collection details below."
              : "Create a new collection to organize your favorite movies."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Collection Name</Label>
            <Input
              id="name"
              placeholder="e.g., Halloween Marathon"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your collection..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="public">Make Public</Label>
              <p className="text-sm text-muted-foreground">Allow others to view this collection</p>
            </div>
            <Switch id="public" checked={isPublic} onCheckedChange={setIsPublic} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>{isEditing ? "Save Changes" : "Create Collection"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
