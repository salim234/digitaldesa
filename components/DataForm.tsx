
import React, { useState, useEffect, useRef } from 'react';
import { FieldDefinition, GenericEntry } from '../types';

interface DataFormProps {
  fields: FieldDefinition[];
  onSubmit: (data: any) => void;
  initialData?: GenericEntry | null;
  onCancel?: () => void;
}

export const DataForm: React.FC<DataFormProps> = ({ fields, onSubmit, initialData, onCancel }) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    const newFormState: Record<string, any> = {};
    fields.forEach(field => {
      const initialValue = initialData ? initialData[field.name] : undefined;
      if (field.type === 'date' && initialValue) {
        try {
          newFormState[field.name] = new Date(initialValue).toISOString().split('T')[0];
        } catch (e) {
          newFormState[field.name] = ''; 
        }
      } else if (field.type === 'file') {
        newFormState[field.name] = initialValue || null; // Store base64 string or null
      }
      else {
        newFormState[field.name] = initialValue !== undefined ? initialValue : (field.type === 'number' ? '' : '');
      }
    });
    setFormData(newFormState);
  }, [initialData, fields]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    let processedValue: string | number | boolean = value;

    if (type === 'number') {
      processedValue = value === '' ? '' : parseFloat(value);
      if (isNaN(processedValue as number)) {
        processedValue = '';
      }
    } else if (type === 'checkbox') {
        processedValue = (e.target as HTMLInputElement).checked;
    }

    setFormData(prev => ({ ...prev, [name]: processedValue }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [fieldName]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = (fieldName: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: null }));
    if (fileInputRefs.current[fieldName]) {
      fileInputRefs.current[fieldName]!.value = '';
    }
  };


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const submissionData = { ...formData };
    if (initialData && initialData.id) {
      (submissionData as GenericEntry).id = initialData.id;
    }

    fields.forEach(field => {
      if (field.type === 'number' && (submissionData[field.name] === '' || submissionData[field.name] === null)) {
        submissionData[field.name] = undefined; 
      }
      // Ensure null is submitted if a file was removed for 'file' type
      if (field.type === 'file' && submissionData[field.name] === null) {
        submissionData[field.name] = null;
      }
    });

    onSubmit(submissionData);
    if (!initialData) { // Reset form only if it was for adding new, not editing
      const resetFormState: Record<string, any> = {};
      fields.forEach(field => {
        resetFormState[field.name] = field.type === 'number' ? '' : (field.type === 'file' ? null : '');
      });
      setFormData(resetFormState);
       // Also reset file input refs if any
       Object.keys(fileInputRefs.current).forEach(fieldName => {
        if (fileInputRefs.current[fieldName]) {
          fileInputRefs.current[fieldName]!.value = '';
        }
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
        {fields.map(field => (
          <div key={field.name} className={field.type === 'textarea' || field.type === 'file' ? 'md:col-span-2' : ''}>
            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                id={field.name}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleChange}
                placeholder={field.placeholder || `Masukkan ${field.label.toLowerCase()}`}
                required={field.required}
                rows={3}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 text-gray-900 placeholder-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
              />
            ) : field.type === 'select' ? (
                <select
                    id={field.name}
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    required={field.required}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                >
                    <option value="" disabled>{field.placeholder || `Pilih ${field.label.toLowerCase()}`}</option>
                    {field.options?.map(option => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
            ) : field.type === 'file' ? (
              <div className="mt-1">
                <input
                  type="file"
                  id={field.name}
                  name={field.name}
                  accept={field.accept}
                  onChange={(e) => handleFileChange(e, field.name)}
                  ref={el => { fileInputRefs.current[field.name] = el; }}
                  className="block w-full text-sm text-gray-500
                             file:mr-4 file:py-2 file:px-4
                             file:rounded-md file:border-0
                             file:text-sm file:font-semibold
                             file:bg-sky-50 file:text-sky-700
                             hover:file:bg-sky-100"
                />
                {formData[field.name] && (
                  <div className="mt-2 p-2 border border-gray-200 rounded-md inline-block">
                    <img src={formData[field.name]} alt="Pratinjau" className="h-24 w-auto object-contain rounded" />
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(field.name)}
                      className="mt-2 text-xs text-red-600 hover:text-red-800"
                    >
                      Hapus Gambar
                    </button>
                  </div>
                )}
                 {field.required && !formData[field.name] && <p className="text-xs text-red-500 mt-1">Logo wajib diunggah.</p>}
              </div>
            ) : (
              <input
                type={field.type === 'date' ? 'date' : field.type === 'number' ? 'number' : 'text'}
                id={field.name}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleChange}
                placeholder={field.placeholder || `Masukkan ${field.label.toLowerCase()}`}
                required={field.required}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 text-gray-900 placeholder-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                step={field.type === 'number' ? 'any' : undefined}
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
          >
            Batal
          </button>
        )}
        <button
          type="submit"
          className="px-6 py-2 bg-green-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          {initialData ? 'Simpan Perubahan' : 'Simpan Entri'}
        </button>
      </div>
    </form>
  );
};
