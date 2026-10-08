import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import { Icon } from './Icon';
import styles from './ui.module.css';
export function Button({
  children,
  variant = 'primary',
  className = '',
  ...props
}: PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary' | 'quiet';
  }
>) {
  return (
    <button
      {...props}
      className={`${styles.button} ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
export function QuantitySelector({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (value: number) => void;
  label: string;
}) {
  return (
    <div
      className={styles.quantity}
      role="group"
      aria-label={`Quantity for ${label}`}
    >
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        aria-label={`Decrease quantity for ${label}`}
      >
        <Icon name="minus" size={16} />
      </button>
      <output aria-label="Quantity" aria-live="polite">
        {value}
      </output>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= 20}
        aria-label={`Increase quantity for ${label}`}
      >
        <Icon name="plus" size={16} />
      </button>
    </div>
  );
}
export function StateBlock({
  title,
  children,
  loading = false,
  action,
  headingLevel = 2,
}: PropsWithChildren<{
  title: string;
  loading?: boolean;
  action?: React.ReactNode;
  headingLevel?: 1 | 2;
}>) {
  const Heading = headingLevel === 1 ? 'h1' : 'h2';
  return (
    <div
      className={styles.state}
      aria-busy={loading}
      role={loading ? 'status' : undefined}
    >
      <span className={styles.stateIcon}>
        <Icon name={loading ? 'clock' : 'bag'} size={30} />
      </span>
      <Heading tabIndex={headingLevel === 1 ? -1 : undefined}>{title}</Heading>
      <p>{children}</p>
      {action}
    </div>
  );
}
export function FoodImage({
  src,
  alt,
  className = '',
  eager = false,
}: {
  src: string;
  alt: string;
  className?: string;
  eager?: boolean;
}) {
  return (
    <img
      src={src}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      className={className}
      onError={(event) => {
        const img = event.currentTarget;
        if (!img.src.endsWith('/food-placeholder.svg'))
          img.src = '/food-placeholder.svg';
      }}
    />
  );
}
