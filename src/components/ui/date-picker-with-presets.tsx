import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { addDays, format } from "date-fns"
import { es } from "date-fns/locale"

export function DatePickerWithPresets({
    date,
    setDate,
}: {
    date: Date
    setDate: (date: Date) => void
}) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    className="w-full justify-start text-left font-normal bg-transparent border border-clara-sage/20 rounded-xl py-4"
                >
                    {format(date, "PPP", { locale: es })}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                align="start"
                className="flex w-auto flex-col shadow-lg space-y-2 p-2 bg-gradient-to-br from-clara-warm-gray to-white rounded-2xl"
            >
                <Select
                    onValueChange={(value) =>
                        setDate(addDays(new Date(), parseInt(value)))
                    }
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona una fecha" />
                    </SelectTrigger>
                    <SelectContent
                        className="bg-gradient-to-br from-clara-warm-gray to-white rounded-2xl"
                        position="popper">
                        <SelectItem value="0">Hoy</SelectItem>
                        <SelectItem value="1">Mañana</SelectItem>
                        <SelectItem value="3">En 3 días</SelectItem>
                        <SelectItem value="7">En una semana</SelectItem>
                    </SelectContent>
                </Select>
                <div className="rounded-md border">
                    <Calendar mode="single" selected={date} onSelect={(day) => {
                        if (day) {
                            setDate(day)
                        }
                    }} locale={es} />
                </div>
            </PopoverContent>
        </Popover>
    )
}
