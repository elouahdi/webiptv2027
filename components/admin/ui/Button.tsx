import { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] whitespace-nowrap shrink-0',
  {
    variants: {
      variant: {
        primary: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-400 hover:to-orange-400 shadow-md shadow-amber-500/25 hover:shadow-lg hover:shadow-amber-500/30',
        secondary: 'bg-admin-muted text-admin-text hover:bg-admin-border border border-admin-border hover:border-admin-text/20',
        outline: 'border-2 border-admin-border bg-transparent text-admin-text hover:bg-admin-muted hover:border-amber-500/50',
        ghost: 'text-admin-text-secondary hover:bg-admin-muted hover:text-admin-text',
        danger: 'bg-red-500/15 text-red-400 hover:bg-red-500/25 border border-red-500/20 hover:border-red-500/40',
        success: 'bg-green-500/15 text-green-400 hover:bg-green-500/25 border border-green-500/20',
        brand: 'bg-gradient-to-r from-brand-from to-brand-to text-white hover:opacity-90 shadow-md',
      },
      size: {
        xs: 'h-7 px-2.5 text-xs rounded-lg',
        sm: 'h-9 px-3.5 text-xs',
        md: 'h-10 px-4 text-sm',
        lg: 'h-11 px-5 text-sm',
        xl: 'h-12 px-6 text-base',
        icon: 'h-9 w-9',
        'icon-sm': 'h-7 w-7',
        'icon-lg': 'h-11 w-11',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = 'Button';
