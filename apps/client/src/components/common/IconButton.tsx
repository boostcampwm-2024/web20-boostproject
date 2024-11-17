interface IconButtonProps {
  children: React.ReactNode;
  title?: string;
  ariaLabel?: string;
  onClick?: () => void;
  disabled?: boolean;
}

function IconButton({ children, title, ariaLabel, onClick, disabled }: IconButtonProps) {
  return (
    <button
      className={`w-10 h-10 flex items-center justify-center rounded hover:bg-surface-alt ${
        disabled ? 'text-text-weak cursor-not-allowed' : 'text-text-default hover:text-text-strong'
      }`}
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={ariaLabel}
    >
      <div className="w-6 h-6">{children}</div>
    </button>
  );
}

export default IconButton;
