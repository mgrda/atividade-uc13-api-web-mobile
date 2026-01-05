import { InputHTMLAttributes, forwardRef } from 'react';
import { FieldError } from 'react-hook-form';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: FieldError;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, className = '', ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={`
                        w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all
                        ${error
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                            : 'border-gray-300 focus:border-cyan-500 focus:ring-cyan-100'
                        }
                        ${className}
                    `}
                    {...props}
                />
                {error && (
                    <span className="text-xs text-red-500 mt-1">{error.message}</span>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
