import { Input } from "@/components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Label } from "@radix-ui/react-label";
import { useField } from "formik";

interface Props {
    label: string;
    name: string;
    type?: string;
    placeholder?: string;
    as?: "input" | "select";
    options?: string[];
}

export default function Custominput({
    label,
    as = "input",
    options = [],
    ...props
}: Props) {
    const [field, meta, helpers] = useField(props.name);

    const errorBorder = meta.touched && meta.error ? "border-red-500" : "border-gray-300";

    return (
        <div className="space-y-2">
            <div className="grid gap-1">
                <Label htmlFor={props.name}>
                    {label} <span className="text-red-500">*</span>
                </Label>

                {props.name === "Phone" ? (
                    <div className="flex gap-2">
                        <Select defaultValue="+91">
                            <SelectTrigger
                                className={`w-[100px] h-10 px-3 bg-white rounded-md focus:outline-none focus-visible:outline-none border ${errorBorder}`}
                            >
                                <SelectValue placeholder="+91" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="+91">🇮🇳 +91</SelectItem>
                                <SelectItem value="+1">🇺🇸 +1</SelectItem>
                                <SelectItem value="+44">🇬🇧 +44</SelectItem>
                                <SelectItem value="+61">🇦🇺 +61</SelectItem>
                            </SelectContent>
                        </Select>

                        <Input
                            {...field}
                            {...props}
                            id={props.name}
                            value={field.value ?? ""}
                            className={`w-full h-10 px-3 rounded-md focus:outline-none focus-visible:outline-none border ${errorBorder}`}
                            placeholder="Enter your phone number..."
                        />
                    </div>
                ) : as === "select" ? (
                    <Select
                        value={field.value}
                        onValueChange={(val) => { helpers.setValue(val) }}

                    >
                        <SelectTrigger
                            className={`w-full h-10 px-3 bg-white rounded-md focus:outline-none focus-visible:outline-none border ${errorBorder}`}
                        >
                            <SelectValue placeholder={`Select ${label}`} />
                        </SelectTrigger>
                        <SelectContent>
                            {options.map((option) => (
                                <SelectItem key={option} value={option}>
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                ) : (
                    <Input
                        {...field}
                        {...props}
                        id={props.name}
                        value={field.value ?? ""}

                        className={`w-full h-10 px-3 rounded-md focus:outline-none focus-visible:outline-none border ${errorBorder}`}
                    />
                )}

                {meta.touched && meta.error && (
                    <div className="text-sm text-red-500">{meta.error}</div>
                )}
            </div>
        </div>
    );
}
