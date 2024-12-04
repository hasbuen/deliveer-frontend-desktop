import React from "react";

interface PhoneInputProps {
    type: string;
    name: string;
    value: string;
    onChange: (newValue: string) => void;
}

const PhoneInput: React.FC<PhoneInputProps> = ({ type, name, value, onChange }) => {
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value.replace(/\D/g, ""); // Remove todos os caracteres não numéricos

        let formattedPhone = "";

        if (input.length > 10) {
            formattedPhone = `(${input.slice(0, 2)}) ${input.slice(2, 7)}-${input.slice(7, 11)}`;
        } else if (input.length > 6) {
            formattedPhone = `(${input.slice(0, 2)}) ${input.slice(2, 11)}`;
        } else if (input.length > 2) {
            formattedPhone = `(${input.slice(0, 2)}) ${input.slice(2)}`;
        } else if (input.length > 0) {
            formattedPhone = `(${input}`;
        }

        onChange(formattedPhone);
    };

    return (
        <div className="relative flex items-center bg-rose-200 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-rose-600">
        <div className="flex items-center pl-2 pr-5 bg-rose-200 rounded-l-lg">
            <img
                src="https://flagcdn.com/w40/br.png"
                alt="Brasil"
                className="h-4 w-4 me-1"
            />
            <span className="text-gray-700 text-sm">+55</span>
        </div>
        <input
            type={type}
            name={name}
            value={value}
            onChange={handlePhoneChange}
            placeholder="(XX)XXXXX-XXXX"
            maxLength={15}
            className="block w-full p-2 bg-rose-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 outline-none"
        />
    </div>
    
    );
};

export default PhoneInput;
