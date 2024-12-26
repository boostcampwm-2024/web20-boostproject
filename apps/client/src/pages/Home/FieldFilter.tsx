import { Button } from '@/components/ui/button';
import { Field } from '@/types/liveTypes';
import { useState } from 'react';

const fields: Field[] = ['WEB', 'AND', 'IOS'];

interface FieldFilterProps {
  onClickFilterButton: (field: Field) => void;
}

function FieldFilter({ onClickFilterButton }: FieldFilterProps) {
  const [selected, setSelected] = useState<Field>('');

  const handleClick = (field: Field) => {
    const newField = selected === field ? '' : field;
    setSelected(newField);
    onClickFilterButton(newField);
  };

  return (
    <div className="flex flex-row justify-between gap-4">
      {fields.map((field: Field) => (
        <Button
          key={field}
          onClick={() => handleClick(field)}
          className={`${
            selected === field
              ? 'bg-surface-brand-default hover:bg-surface-point-alt'
              : 'bg-transparent border border-border-default hover:bg-surface-alt text-text-strong'
          }`}
        >
          {field}
        </Button>
      ))}
    </div>
  );
}

export default FieldFilter;
