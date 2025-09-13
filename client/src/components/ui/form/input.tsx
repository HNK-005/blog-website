import { EyeIcon, EyeOffIcon } from 'lucide-react';
import * as React from 'react';
import { type UseFormRegisterReturn } from 'react-hook-form';

import { useDisclosure } from '@/hooks/use-disclosure';
import { cn } from '@/utils/cn';

import { FieldWrapper, FieldWrapperPassThroughProps } from './field-wrapper';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> &
  FieldWrapperPassThroughProps & {
    className?: string;
    registration: Partial<UseFormRegisterReturn>;
  };

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, registration, ...props }, ref) => {
    const { isOpen, open, close } = useDisclosure(false);
    return (
      <FieldWrapper label={label} error={error}>
        <input
          type={type == 'password' && isOpen ? 'text' : type}
          className={cn(
            'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
            type == 'password' ? 'pr-8' : '',
            className,
          )}
          ref={ref}
          {...registration}
          {...props}
        />
        {type == 'password' && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer">
            {isOpen ? (
              <EyeIcon size={20} onClick={close} />
            ) : (
              <EyeOffIcon size={20} onClick={open} />
            )}
          </div>
        )}
      </FieldWrapper>
    );
  },
);
Input.displayName = 'Input';

export { Input };
