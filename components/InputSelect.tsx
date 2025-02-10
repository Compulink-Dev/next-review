import * as React from "react"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface InputSelectProps {
    placeholder: string
    children: React.ReactNode
}

export function InputSelect({ placeholder, children }: InputSelectProps) {
    return (
        <Select>
            <SelectTrigger className="w-full">
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="bg-color">
                <SelectGroup >
                    {children}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
