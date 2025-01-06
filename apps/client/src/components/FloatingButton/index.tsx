import { Button } from '@components/ui/button';
import { ThemeIcon } from '@components/Icons';
import { useTheme } from '@/hooks/useTheme';

function FloatingButton() {
  const { convertTheme } = useTheme();

  return (
    <div className="fixed bottom-3 right-5">
      <Button
        onClick={convertTheme}
        className="h-10 w-10 rounded rounded-circle p-0 bg-surface-brand-default hover:bg-surface-brand-alt"
      >
        <ThemeIcon size={48} />
      </Button>
    </div>
  );
}

export default FloatingButton;
