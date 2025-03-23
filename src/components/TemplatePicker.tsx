
import { Template } from '../types';

interface TemplatePickerProps {
  templates: Template[];
  selectedTemplate: Template | null;
  onSelect: (template: Template) => void;
}

export function TemplatePicker({ templates, selectedTemplate, onSelect }: TemplatePickerProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {templates.map((template, index) => (
        <div
          key={index}
          className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
            selectedTemplate === template ? 'border-blue-500 shadow-lg scale-105' : 'border-transparent hover:border-blue-300'
          }`}
          onClick={() => onSelect(template)}
        >
          <div className="aspect-[9/16] relative"> 
            <img
              src={template.thumbnail}
              alt={template.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-opacity" />
            {selectedTemplate === template && (
              <div className="absolute bottom-0 left-0 right-0 bg-blue-500 text-white text-xs py-1 px-2 text-center">
                Seleccionado
              </div>
            )}
          </div>
          <div className="p-1 text-center text-sm font-medium truncate">
            {template.name}
          </div>
        </div>
      ))}
    </div>
  );
}
