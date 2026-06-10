import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
  {
    variants: {
      variant: {
        default: 'bg-admin-muted text-admin-text-secondary',
        success: 'bg-green-500/10 text-green-400',
        warning: 'bg-yellow-500/10 text-yellow-400',
        danger: 'bg-red-500/10 text-red-400',
        info: 'bg-brand-from/10 text-brand-from',
        purple: 'bg-purple-500/10 text-purple-400',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

export function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
