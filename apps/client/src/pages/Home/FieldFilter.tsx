import { Button } from '@/components/ui/button';
import { Field } from '@/types/liveTypes';

const fields: Field[] = ['WEB', 'AND', 'IOS'];

interface FieldFilterProps {
  selectedField: Field;
  onFieldSelect: (field: Field) => void;
}

function FieldFilter({ selectedField, onFieldSelect }: FieldFilterProps) {
  const handleClick = (field: Field) => {
    onFieldSelect(selectedField === field ? '' : field);
  };

  return (
    <div className="flex flex-row justify-between gap-4">
      {fields.map((field: Field) => (
        <Button
          key={field}
          onClick={() => handleClick(field)}
          className={`${
            selectedField === field
              ? 'bg-surface-brand-default hover:bg-surface-point-alt'
              : 'bg-transparent border border-border-default hover:bg-surface-alt'
          }`}
        >
          {field}
        </Button>
      ))}
    </div>
  );
}

export default FieldFilter;
