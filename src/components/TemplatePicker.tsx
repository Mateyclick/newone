import { Template } from '../types';

interface TemplatePickerProps {
  templates: Template[];
  selectedTemplate: Template | null;
  onSelect: (template: Template) => void;
}

export function TemplatePicker({ templates, selectedTemplate, onSelect }: TemplatePickerProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {templates.map((template, index) => (
        <div
          key={index}
          className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
            selectedTemplate === template ? 'border-blue-500 shadow-lg' : 'border-transparent hover:border-blue-300'
          }`}
          onClick={() => onSelect(template)}
        >
          <img
            src={template.thumbnail}
            alt={template.name}
            className="w-full h-auto"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-opacity" />
        </div>
      ))}
    </div>
  );
}