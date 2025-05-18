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
  const [gradientColor1, setGradientColor1] = useState(collection?.gradientColor1 || "#1e3a8a") // Default deep blue
  const [gradientColor2, setGradientColor2] = useState(collection?.gradientColor2 || "#065f46") // Default dark green
  const [gradientAngle, setGradientAngle] = useState(collection?.gradientAngle || 180) // Default bottom

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
      gradientColor1,
      gradientColor2,
      gradientAngle,
    })

    // Reset form
    if (!isEditing) {
      setName("")
      setDescription("")
      setIsPublic(false)
      setGradientColor1("#1e3a8a")
      setGradientColor2("#065f46")
      setGradientAngle(180)
    }

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] overflow-y-auto max-h-[80vh]">
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

          <div className="space-y-2">
            <Label htmlFor="gradient-colors">Gradient Colors</Label>
            <div className="flex gap-4">
              <div className="flex flex-col space-y-1">
                <Label htmlFor="color1" className="text-xs">Color 1</Label>
                <Input
                  id="color1"
                  type="color"
                  value={gradientColor1}
                  onChange={(e) => setGradientColor1(e.target.value)}
                  className="w-16 h-10 p-1"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <Label htmlFor="color2" className="text-xs">Color 2</Label>
                <Input
                  id="color2"
                  type="color"
                  value={gradientColor2}
                  onChange={(e) => setGradientColor2(e.target.value)}
                  className="w-16 h-10 p-1"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="gradient-angle">Gradient Angle</Label>
            <Input
              id="gradient-angle"
              type="number"
              placeholder="e.g., 180"
              value={gradientAngle}
              onChange={(e) => setGradientAngle(parseInt(e.target.value))}
              min={0}
              max={360}
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
