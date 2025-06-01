import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { AlertCircle, Calendar1Icon, CalendarDays, CheckCircle2, Clock, Palette, Tag, User } from 'lucide-react'
import type React from 'react'
import { useState } from 'react'
import { toast } from 'sonner'
import { DatePickerWithPresets } from '../../../components/ui/date-picker-with-presets'
import { useGetClients } from '../../clients/hooks/useGetClients'
import { useGetTags } from '../../settings/hooks/useGetTags'
import { useCreateAppointment } from '../hooks/use-appointments'
import { timeStringToMinutes } from '../types'

interface CreateActivityDialogProps {
  isOpen: boolean
  onClose: () => void
  selectedDate: Date
}

interface FormData {
  title: string
  notes: string
  startTime: string
  endTime: string
  clientId: string
  tags: string[]
  color: string
}

interface FormErrors {
  title?: string
  startTime?: string
  endTime?: string
  clientId?: string
  timeRange?: string
}

const colorOptions = [
  { value: 'bg-clara-sage', label: 'Verde Salvia', bgClass: 'bg-clara-sage' },
  { value: 'bg-clara-terracotta', label: 'Terracota', bgClass: 'bg-clara-terracotta' },
  { value: 'bg-clara-forest', label: 'Verde Bosque', bgClass: 'bg-clara-forest' },
  { value: 'bg-clara-beige', label: 'Beige', bgClass: 'bg-clara-beige' },
  { value: 'bg-clara-sage-300', label: 'Verde Claro', bgClass: 'bg-clara-sage-300' },
  { value: 'bg-clara-terracotta-300', label: 'Rosa Claro', bgClass: 'bg-clara-terracotta-300' },
  { value: 'bg-clara-warm-gray', label: 'Gris Cálido', bgClass: 'bg-clara-warm-gray' },
]

export function CreateActivityDialog({
  isOpen,
  onClose,
  selectedDate: defaultDate,
}: CreateActivityDialogProps) {

  const { data: availableTags } = useGetTags();
  const [formData, setFormData] = useState<FormData>({
    title: '',
    notes: '',
    startTime: '09:00',
    endTime: '10:00',
    clientId: '',
    tags: [],
    color: 'bg-clara-sage',
  })

  const [selectedDate, setSelectedDate] = useState(defaultDate)
  const [errors, setErrors] = useState<FormErrors>({})

  const createAppointment = useCreateAppointment()
  const { data: clients = [], isLoading: isLoadingClients } = useGetClients()

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido'
    }

    const startMinutes = timeStringToMinutes(formData.startTime)
    const endMinutes = timeStringToMinutes(formData.endTime)

    if (startMinutes >= endMinutes) {
      newErrors.timeRange = 'La hora de fin debe ser posterior a la hora de inicio'
    }

    if (endMinutes - startMinutes < 15) {
      newErrors.timeRange = 'El evento debe durar al menos 15 minutos'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear specific error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleClientChange = (value: string) => {
    setFormData((prev) => ({ ...prev, clientId: value }))
    if (errors.clientId) {
      setErrors(prev => ({ ...prev, clientId: undefined }))
    }
  }

  const handleColorChange = (value: string) => {
    setFormData((prev) => ({ ...prev, color: value }))
  }

  const toggleTag = (tag: string) => {
    setFormData((prev) => {
      const newTags = prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag]
      return { ...prev, tags: newTags }
    })
  }

  const resetForm = () => {
    setFormData({
      title: '',
      notes: '',
      startTime: '09:00',
      endTime: '10:00',
      clientId: '',
      tags: [],
      color: 'bg-clara-sage',
    })
    setErrors({})
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }


    try {
      const appointmentData = {
        date: format(selectedDate, 'yyyy-MM-dd'),
        clientId: formData.clientId,
        timeRange: {
          startAt: timeStringToMinutes(formData.startTime),
          endAt: timeStringToMinutes(formData.endTime),
        },
        title: formData.title,
        notes: formData.notes,
        tags: formData.tags,
        color: formData.color,
      }

      await createAppointment.mutateAsync(appointmentData)

      toast.success('¡Evento creado exitosamente!', {
        description: `${formData.title} el ${format(selectedDate, 'dd/MM/yyyy')}`,
        icon: <CheckCircle2 className="w-4 h-4" />,
      })

      resetForm()
      onClose()
    } catch (error) {
      console.error('Error creating appointment:', error)
      toast.error('Error al crear el evento', {
        description: 'Por favor, inténtalo de nuevo',
        icon: <AlertCircle className="w-4 h-4" />,
      })
    }
  }

  const handleClose = () => {
    if (!createAppointment.isPending) {
      resetForm()
      onClose()
    }
  }

  const isSubmitting = createAppointment.isPending

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-gradient-to-br from-clara-warm-gray to-white w-[95%] sm:max-w-[600px] h-[95%] overflow-y-auto rounded-3xl border border-clara-warm-gray/30 shadow-2xl">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-2xl font-bold text-clara-warm-gray-foreground flex items-center gap-3">
            <div className="bg-clara-sage p-2 rounded-2xl">
              <CalendarDays className="w-6 h-6 text-clara-sage-foreground" />
            </div>
            Crear Evento
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-semibold text-clara-warm-gray-foreground flex items-center gap-2">
              <Calendar1Icon className="w-4 h-4" />
              Fecha del evento
            </Label>
            <DatePickerWithPresets date={selectedDate} setDate={setSelectedDate} />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-semibold text-clara-warm-gray-foreground flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Título del evento
            </Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ej: Reunión con cliente, Sesión de fotos..."
              className={cn(
                "rounded-2xl border-2 h-12 text-base",
                errors.title
                  ? "border-clara-terracotta bg-clara-terracotta/5"
                  : "border-clara-sage/30 focus:border-clara-sage"
              )}
              required
            />
            {errors.title && (
              <p className="text-clara-terracotta text-sm font-medium flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Client Selection */}
          <div className="space-y-2">
            <Label htmlFor="clientId" className="text-sm font-semibold text-clara-warm-gray-foreground flex items-center gap-2">
              <User className="w-4 h-4" />
              Cliente
            </Label>
            <Select
              value={formData.clientId}
              onValueChange={handleClientChange}
              disabled={isLoadingClients}
            >
              <SelectTrigger
                id="clientId"
                className={cn(
                  "rounded-2xl border-2 h-12 text-base",
                  errors.clientId
                    ? "border-clara-terracotta bg-clara-terracotta/5"
                    : "border-clara-sage/30 focus:border-clara-sage"
                )}
              >
                <SelectValue placeholder={isLoadingClients ? "Cargando clientes..." : "Selecciona un cliente"} />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id} className="rounded-xl">
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.clientId && (
              <p className="text-clara-terracotta text-sm font-medium flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.clientId}
              </p>
            )}
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime" className="text-sm font-semibold text-clara-warm-gray-foreground flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Hora de inicio
              </Label>
              <Input
                id="startTime"
                name="startTime"
                type="time"
                value={formData.startTime}
                onChange={handleChange}
                className={cn(
                  "rounded-2xl border-2 h-12 text-base",
                  errors.timeRange
                    ? "border-clara-terracotta bg-clara-terracotta/5"
                    : "border-clara-sage/30 focus:border-clara-sage"
                )}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime" className="text-sm font-semibold text-clara-warm-gray-foreground">
                Hora de fin
              </Label>
              <Input
                id="endTime"
                name="endTime"
                type="time"
                value={formData.endTime}
                onChange={handleChange}
                className={cn(
                  "rounded-2xl border-2 h-12 text-base",
                  errors.timeRange
                    ? "border-clara-terracotta bg-clara-terracotta/5"
                    : "border-clara-sage/30 focus:border-clara-sage"
                )}
                required
              />
            </div>

            {errors.timeRange && (
              <div className="col-span-2">
                <p className="text-clara-terracotta text-sm font-medium flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.timeRange}
                </p>
              </div>
            )}
          </div>

          {/* Color Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-clara-warm-gray-foreground flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Color del evento
            </Label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => handleColorChange(color.value)}
                  className={cn(
                    "relative h-12 rounded-2xl border-3 transition-all duration-200 hover:scale-105",
                    color.bgClass,
                    formData.color === color.value
                      ? "border-clara-forest shadow-lg scale-105"
                      : "border-white/50 shadow-sm"
                  )}
                  title={color.label}
                >
                  {formData.color === color.value && (
                    <CheckCircle2 className="w-5 h-5 text-white absolute inset-0 m-auto drop-shadow-lg" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-semibold text-clara-warm-gray-foreground">
              Notas adicionales (opcional)
            </Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Agrega detalles adicionales sobre el evento..."
              rows={3}
              className="rounded-2xl border-2 border-clara-sage/30 focus:border-clara-sage resize-none"
            />
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-clara-warm-gray-foreground">
              Etiquetas (opcional)
            </Label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.name)}
                  className={cn(
                    "inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 hover:scale-105",
                    formData.tags.includes(tag.name)
                      ? "bg-clara-sage text-clara-sage-foreground shadow-md"
                      : "bg-clara-warm-gray/60 text-clara-warm-gray-foreground hover:bg-clara-warm-gray"
                  )}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>

          <DialogFooter className="gap-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="rounded-2xl border-2 border-clara-warm-gray hover:bg-clara-warm-gray/20 text-clara-warm-gray-foreground font-semibold h-12 px-6"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-clara-sage hover:bg-clara-sage/90 text-clara-sage-foreground rounded-2xl font-semibold h-12 px-8 shadow-lg transition-all duration-200"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-clara-sage-foreground/30 border-t-clara-sage-foreground rounded-full animate-spin" />
                  Creando...
                </div>
              ) : (
                'Crear Evento'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
