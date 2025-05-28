'use client'

import type React from 'react'

import { useState } from 'react'
import { format } from 'date-fns'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface CreateActivityDialogProps {
  isOpen: boolean
  onClose: () => void
  selectedDate: Date
}

export function CreateActivityDialog({
  isOpen,
  onClose,
  selectedDate,
}: CreateActivityDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startTime: '09:00',
    endTime: '10:00',
    genre: '',
    tags: [] as string[],
  })

  const availableTags = [
    'Work',
    'Deadline',
    'Education',
    'Design',
    'Sports',
    'Health',
    'Social',
    'Food',
    'Meeting',
    'Personal',
  ]

  const availableGenres = [
    'Hombre',
    'Mujer',
    'Evento',
    
  ]

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleGenreChange = (value: string) => {
    setFormData((prev) => ({ ...prev, genre: value }))
  }

  const toggleTag = (tag: string) => {
    setFormData((prev) => {
      const newTags = prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag]
      return { ...prev, tags: newTags }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically save the new activity
    console.log({
      ...formData,
      date: format(selectedDate, 'yyyy-MM-dd'),
    })

    // Reset form and close dialog
    setFormData({
      name: '',
      description: '',
      startTime: '09:00',
      endTime: '10:00',
      genre: '',
      tags: [],
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white w-5/6 sm:max-w-[500px] rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Crear evento</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-4 top-4 h-8 w-8 rounded-full"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white">
          <div className="space-y-2">
            <Label htmlFor="date">Fecha</Label>
            <Input
              id="date"
              value={format(selectedDate, 'EEEE, MMMM d, yyyy')}
              disabled
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Título</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Agrega un título a este evento"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Agrega una descripción a este evento"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Inicio</Label>
              <Input
                id="startTime"
                name="startTime"
                type="time"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">Final</Label>
              <Input
                id="endTime"
                name="endTime"
                type="time"
                value={formData.endTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className=" space-y-2">
            <Label htmlFor="genre">Género</Label>
            <Select value={formData.genre} onValueChange={handleGenreChange}>
              <SelectTrigger id="genre">
                <SelectValue placeholder="Selecciona un género" />
              </SelectTrigger>
              <SelectContent>
                {availableGenres.map((genre) => (
                  <SelectItem key={genre} value={genre}>
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                    formData.tags.includes(tag)
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Crear Evento</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
