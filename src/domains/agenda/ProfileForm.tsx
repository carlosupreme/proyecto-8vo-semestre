import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'; // Assuming full Form components
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'; // Make sure this path is correct
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScheduleService } from '@/domains/account/ProfileService';
import type { UpdateBusinessScheduleRequest, WeekDay, WorkDay } from '@/domains/account/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Edit, Plus, Save, Trash2 } from 'lucide-react'; // Added Trash2
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form'; // Using Controller for RHF integration
import { toast } from 'sonner';

const DEFAULT_START_TIME_MINUTES = 9 * 60; // 9:00 AM
const DEFAULT_END_TIME_MINUTES = 18 * 60; // 6:00 PM
const ORDERED_WEEK_DAYS: WeekDay[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

// Helper function to format day (already provided by you)
function formatDay(day: WeekDay): string {
    const dayMap: Record<WeekDay, string> = {
        MONDAY: 'Lunes',
        TUESDAY: 'Martes',
        WEDNESDAY: 'Miércoles',
        THURSDAY: 'Jueves',
        FRIDAY: 'Viernes',
        SATURDAY: 'Sábado',
        SUNDAY: 'Domingo',
    };
    return dayMap[day] || day;
}

interface NonWorkDateFormValues {
    date: string;
    reason: string;
    recurrent: boolean;
}

export default function ProfileScheduleEditor() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddingNonWorkDate, setIsAddingNonWorkDate] = useState(false);

    // Local state for edits within the modal
    const [editWorkDays, setEditWorkDays] = useState<Partial<Record<WeekDay, WorkDay>>>({});
    const [editNonWorkDates, setEditNonWorkDates] = useState<Array<{ date: string; reason: string; recurrent: boolean }>>([]);

    const queryClient = useQueryClient();

    // RHF for the "Add Non-Work Date" sub-form
    const nonWorkDateForm = useForm<NonWorkDateFormValues>({
        defaultValues: {
            date: '',
            reason: '',
            recurrent: false,
        },
        mode: 'onChange',
    });


    const { data: schedule, isLoading: isLoadingSchedule } = useQuery({
        queryKey: ['schedule'],
        queryFn: ScheduleService.getSchedule,
        refetchOnWindowFocus: isModalOpen,
    });

    const updateScheduleMutation = useMutation({
        mutationFn: ScheduleService.updateSchedule,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['schedule'] });
            toast.success('Horario actualizado correctamente');
            setIsModalOpen(false); // Close modal on success
        },
        onError: (error) => {
            toast.error(`Error al actualizar el horario: ${error.message}`);
        },
    });

    // Initialize edit states when modal opens or schedule data loads
    useEffect(() => {
        if (isModalOpen && schedule) {
            setEditWorkDays({ ...schedule.weeklyWorkDays });
            setEditNonWorkDates([...schedule.nonWorkDates.map(d => ({ ...d }))]); // Ensure deep copy for non-work dates
        }
    }, [isModalOpen, schedule]);


    const timeToMinutes = useCallback((hours: number, minutes: number): number => {
        return hours * 60 + minutes;
    }, []);

    const handleWorkDayChange = useCallback((day: WeekDay, field: 'startAt' | 'endAt', hours: number, minutes: number) => {
        const totalMinutes = timeToMinutes(hours, minutes);
        setEditWorkDays(prev => {
            const currentDayData = prev[day] || { startAt: DEFAULT_START_TIME_MINUTES, endAt: DEFAULT_END_TIME_MINUTES };
            const updatedDayData = { ...currentDayData, [field]: totalMinutes };

            // Basic validation: end time should be after start time
            if (field === 'startAt' && totalMinutes >= updatedDayData.endAt) {
                // Optionally adjust endAt or show a warning. For now, just set.
            } else if (field === 'endAt' && totalMinutes <= updatedDayData.startAt) {
                // Optionally adjust startAt or show a warning.
            }
            return { ...prev, [day]: updatedDayData };
        });
    }, [timeToMinutes]);

    const toggleWorkDay = useCallback((day: WeekDay, active: boolean) => {
        setEditWorkDays(prev => {
            const newWorkDays = { ...prev };
            if (active) {
                newWorkDays[day] = prev[day] || { startAt: DEFAULT_START_TIME_MINUTES, endAt: DEFAULT_END_TIME_MINUTES };
            } else {
                delete newWorkDays[day];
            }
            return newWorkDays;
        });
    }, []);

    const handleAddNonWorkDate = useCallback((data: NonWorkDateFormValues) => {
        if (data.date && data.reason) {
            setEditNonWorkDates(prev => [...prev, { ...data }]);
            nonWorkDateForm.reset();
            setIsAddingNonWorkDate(false);
        }
    }, [editNonWorkDates, nonWorkDateForm]);


    const removeNonWorkDate = useCallback((indexToRemove: number) => {
        setEditNonWorkDates(prev => prev.filter((_, i) => i !== indexToRemove));
    }, []);

    const handleSaveSchedule = useCallback(async () => {
        // Add any final validation here if needed
        const updateData: UpdateBusinessScheduleRequest = {
            weeklyWorkDays: editWorkDays,
            nonWorkDates: editNonWorkDates,
        };
        await updateScheduleMutation.mutateAsync(updateData);
    }, [editWorkDays, editNonWorkDates, updateScheduleMutation]);

    const handleCancel = () => {
        // Reset changes to original if modal is simply closed
        if (schedule) {
            setEditWorkDays({ ...schedule.weeklyWorkDays });
            setEditNonWorkDates([...schedule.nonWorkDates.map(d => ({ ...d }))]);
        }
        setIsModalOpen(false);
        setIsAddingNonWorkDate(false);
        nonWorkDateForm.reset();
    };

    // Values for time selectors
    const hourOptions = Array.from({ length: 24 }, (_, i) => ({ value: i.toString(), label: i.toString().padStart(2, '0') }));
    const minuteOptions = [0, 15, 30, 45].map(min => ({ value: min.toString(), label: min.toString().padStart(2, '0') }));

    if (isLoadingSchedule && !isModalOpen) { // Show a simple loader for the trigger button if needed
        return <Button variant="outline" disabled><Edit className="mr-2 h-4 w-4" /> Cargando horario...</Button>;
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={(open) => {
            if (!open) { // If closing modal
                handleCancel();
            } else {
                setIsModalOpen(true);
            }
        }}>
            <DialogTrigger asChild>
                <Button variant="outline" className='w-full'>
                    <Edit className="mr-2 h-4 w-4" /> Editar Horario
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl md:max-w-2xl lg:max-w-3xl flex flex-col max-h-[90vh] p-0">
                <DialogHeader className="p-6 pb-4 border-b">
                    <DialogTitle className="text-xl">Configurar Horario de Trabajo</DialogTitle>
                    <DialogDescription>
                        Define los días y horas laborables, y especifica los días no laborables.
                    </DialogDescription>
                </DialogHeader>

                <Form {...nonWorkDateForm}>
                    <ScrollArea className="flex-grow overflow-y-auto px-6 py-4"> {/* Added py-4 */}
                        <div className="space-y-8">
                            {/* Section: Días Laborables */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800">Días Laborables</h3>
                                <div className="space-y-3">
                                    {ORDERED_WEEK_DAYS.map((day) => {
                                        const isWorkDay = Boolean(editWorkDays[day]);
                                        const currentDayData = editWorkDays[day] || { startAt: DEFAULT_START_TIME_MINUTES, endAt: DEFAULT_END_TIME_MINUTES };
                                        const startHours = Math.floor(currentDayData.startAt / 60);
                                        const startMinutes = currentDayData.startAt % 60;
                                        const endHours = Math.floor(currentDayData.endAt / 60);
                                        const endMinutes = currentDayData.endAt % 60;

                                        return (
                                            <div key={day} className="p-4 border rounded-lg bg-gray-50/50">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center space-x-3">
                                                        <Checkbox
                                                            id={`workday-${day}`}
                                                            checked={isWorkDay}
                                                            onCheckedChange={(checked) => toggleWorkDay(day, checked as boolean)}
                                                        />
                                                        <label htmlFor={`workday-${day}`} className="font-medium text-gray-700 cursor-pointer">
                                                            {formatDay(day)}
                                                        </label>
                                                    </div>
                                                </div>
                                                {isWorkDay && (
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                                                        {/* Start Time */}
                                                        <div className="space-y-1">
                                                            <FormLabel className="text-sm">Hora de inicio</FormLabel>
                                                            <div className="flex items-center space-x-2">
                                                                <Select value={startHours.toString()} onValueChange={(val) => handleWorkDayChange(day, 'startAt', parseInt(val), startMinutes)}>
                                                                    <SelectTrigger className="w-full sm:w-auto flex-1"><SelectValue /></SelectTrigger>
                                                                    <SelectContent>
                                                                        {hourOptions.map(opt => <SelectItem key={`start-h-${opt.value}`} value={opt.value}>{opt.label}</SelectItem>)}
                                                                    </SelectContent>
                                                                </Select>
                                                                <span className="font-semibold">:</span>
                                                                <Select value={startMinutes.toString()} onValueChange={(val) => handleWorkDayChange(day, 'startAt', startHours, parseInt(val))}>
                                                                    <SelectTrigger className="w-full sm:w-auto flex-1"><SelectValue /></SelectTrigger>
                                                                    <SelectContent>
                                                                        {minuteOptions.map(opt => <SelectItem key={`start-m-${opt.value}`} value={opt.value}>{opt.label}</SelectItem>)}
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                        </div>
                                                        {/* End Time */}
                                                        <div className="space-y-1">
                                                            <FormLabel className="text-sm">Hora de fin</FormLabel>
                                                            <div className="flex items-center space-x-2">
                                                                <Select value={endHours.toString()} onValueChange={(val) => handleWorkDayChange(day, 'endAt', parseInt(val), endMinutes)}>
                                                                    <SelectTrigger className="w-full sm:w-auto flex-1"><SelectValue /></SelectTrigger>
                                                                    <SelectContent>
                                                                        {hourOptions.map(opt => <SelectItem key={`end-h-${opt.value}`} value={opt.value}>{opt.label}</SelectItem>)}
                                                                    </SelectContent>
                                                                </Select>
                                                                <span className="font-semibold">:</span>
                                                                <Select value={endMinutes.toString()} onValueChange={(val) => handleWorkDayChange(day, 'endAt', endHours, parseInt(val))}>
                                                                    <SelectTrigger className="w-full sm:w-auto flex-1"><SelectValue /></SelectTrigger>
                                                                    <SelectContent>
                                                                        {minuteOptions.map(opt => <SelectItem key={`end-m-${opt.value}`} value={opt.value}>{opt.label}</SelectItem>)}
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Section: Días No Laborables */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-semibold text-gray-800">Días No Laborables</h3>
                                    {!isAddingNonWorkDate && (
                                        <Button variant="outline" size="sm" onClick={() => setIsAddingNonWorkDate(true)}>
                                            <Plus className="mr-1 h-4 w-4" /> Agregar
                                        </Button>
                                    )}
                                </div>

                                {isAddingNonWorkDate && (
                                    <div className="p-4 border rounded-lg space-y-4 bg-gray-50/50">
                                        <h4 className="font-medium text-gray-700">Nuevo día no laborable</h4>
                                        <FormField
                                            control={nonWorkDateForm.control}
                                            name="date"
                                            rules={{ required: "La fecha es requerida" }}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Fecha</FormLabel>
                                                    <FormControl><Input type="date" {...field} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={nonWorkDateForm.control}
                                            name="reason"
                                            rules={{ required: "El motivo es requerido" }}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Motivo</FormLabel>
                                                    <FormControl><Input placeholder="Ej: Festivo nacional" {...field} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={nonWorkDateForm.control}
                                            name="recurrent"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                                    <FormControl>
                                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                    </FormControl>
                                                    <FormLabel className="font-normal cursor-pointer">Repetir cada año</FormLabel>
                                                </FormItem>
                                            )}
                                        />
                                        <div className="flex justify-end space-x-2">
                                            <Button variant="ghost" size="sm" onClick={() => { setIsAddingNonWorkDate(false); nonWorkDateForm.reset(); }}>
                                                Cancelar
                                            </Button>
                                            <Button size="sm" onClick={nonWorkDateForm.handleSubmit(handleAddNonWorkDate)}>
                                                Confirmar Agregado
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    {editNonWorkDates.length > 0 ? (
                                        editNonWorkDates.map((item, index) => (
                                            <div key={index} className="flex justify-between items-center p-3 border rounded-md hover:bg-gray-50 transition-colors">
                                                <div>
                                                    <p className="font-medium text-gray-700">{format(new Date(item.date), 'dd/MM/yyyy')}</p>
                                                    <p className="text-sm text-gray-500">{item.reason}</p>
                                                    {item.recurrent && <p className="text-xs text-blue-600">Recurrente anualmente</p>}
                                                </div>
                                                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={() => removeNonWorkDate(index)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))
                                    ) : (
                                        !isAddingNonWorkDate && <p className="text-sm text-gray-500 italic">No hay días no laborables configurados.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <ScrollBar orientation="vertical" />
                    </ScrollArea>
                </Form>

                <DialogFooter className="p-6 pt-4 border-t mt-auto"> {/* mt-auto for flex-col, sticky footer */}
                    <Button variant="outline" onClick={handleCancel}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSaveSchedule} disabled={updateScheduleMutation.isPending}>
                        {updateScheduleMutation.isPending ? (
                            <>
                                <Save className="animate-spin mr-2 h-4 w-4" /> Guardando...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" /> Guardar Cambios
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}