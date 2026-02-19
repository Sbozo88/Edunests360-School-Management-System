import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Check, ChevronRight, Upload, User, MapPin, FileText } from 'lucide-react';

interface AdmissionFormProps {
  onNavigate: (view: string) => void;
}

const steps = [
  { id: 1, title: 'Student Info', icon: User },
  { id: 2, title: 'Parent Details', icon: User },
  { id: 3, title: 'Academic Info', icon: FileText },
  { id: 4, title: 'Documents', icon: Upload },
];

export const AdmissionForm: React.FC<AdmissionFormProps> = ({ onNavigate }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', dob: '', gender: '',
    fatherName: '', motherName: '', email: '', phone: '',
    prevSchool: '', grade: '',
  });

  const handleNext = () => {
      if (currentStep === 4) {
          handleSubmit();
      } else {
          setCurrentStep(prev => Math.min(prev + 1, 4));
      }
  };

  const handlePrev = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = () => {
      setIsSubmitting(true);
      // Simulate API call
      setTimeout(() => {
          setIsSubmitting(false);
          alert("Application submitted successfully! Redirecting to student list...");
          onNavigate('student-list');
      }, 1500);
  };

  const handleChange = (field: string, value: string) => {
      setFormData(prev => ({ ...prev, [field]: value }));
  };

  const Input = ({ label, placeholder, type = "text", width = "w-full", field }: any) => (
    <div className={`mb-4 ${width}`}>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      <input 
        type={type} 
        placeholder={placeholder}
        value={(field && formData[field as keyof typeof formData]) || ''}
        onChange={(e) => field && handleChange(field, e.target.value)}
        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all bg-slate-50 focus:bg-white"
      />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-500">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-900">Online Admission</h1>
        <p className="text-slate-500 mt-2">Complete the form below to register a new student.</p>
      </div>

      {/* Stepper */}
      <div className="flex justify-between items-center mb-8 relative">
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-slate-200 -z-10 rounded-full"></div>
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-indigo-600 -z-10 rounded-full transition-all duration-500" style={{ width: `${((currentStep - 1) / 3) * 100}%` }}></div>
        
        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = currentStep >= step.id;
          const isComplete = currentStep > step.id;

          return (
            <div key={step.id} className="flex flex-col items-center gap-2 bg-transparent">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-4 ${isActive ? 'bg-indigo-600 border-indigo-100 text-white' : 'bg-white border-slate-200 text-slate-400'}`}>
                {isComplete ? <Check size={18} /> : <Icon size={18} />}
              </div>
              <span className={`text-xs font-semibold ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}>{step.title}</span>
            </div>
          );
        })}
      </div>

      <Card className="min-h-[400px]">
        {currentStep === 1 && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-800">Student Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="First Name" placeholder="John" field="firstName" />
              <Input label="Last Name" placeholder="Doe" field="lastName" />
              <Input label="Date of Birth" type="date" field="dob" />
              <div className="mb-4 w-full">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Gender</label>
                <select 
                    value={formData.gender}
                    onChange={(e) => handleChange('gender', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all bg-slate-50 focus:bg-white"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <Input label="Blood Group" placeholder="O+" />
              <Input label="Religion" placeholder="Select" />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
             <h3 className="text-xl font-bold text-slate-800">Guardian Details</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Father's Name" placeholder="Mr. Doe" field="fatherName" />
              <Input label="Mother's Name" placeholder="Mrs. Doe" field="motherName" />
              <Input label="Email Address" type="email" placeholder="parent@example.com" field="email" />
              <Input label="Phone Number" type="tel" placeholder="+1 (555) 000-0000" field="phone" />
              <div className="md:col-span-2">
                 <Input label="Residential Address" placeholder="123 Main St, Springfield" />
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-800">Academic History</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <Input label="Previous School" placeholder="School Name" field="prevSchool" />
               <Input label="Previous Grade/Class" placeholder="e.g. Grade 5" />
               <Input label="Reason for Leaving" placeholder="Relocation" />
               <Input label="Admission Seeking In Class" placeholder="Grade 6" field="grade" />
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-800">Document Upload</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-3">
                  <Upload size={24} />
                </div>
                <h4 className="font-semibold text-slate-700">Birth Certificate</h4>
                <p className="text-xs text-slate-400 mt-1">PNG, JPG or PDF up to 5MB</p>
              </div>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-3">
                  <Upload size={24} />
                </div>
                <h4 className="font-semibold text-slate-700">Transfer Certificate</h4>
                <p className="text-xs text-slate-400 mt-1">PNG, JPG or PDF up to 5MB</p>
              </div>
            </div>
          </div>
        )}
      </Card>

      <div className="flex justify-between mt-6">
        <button 
          onClick={handlePrev}
          disabled={currentStep === 1 || isSubmitting}
          className={`px-6 py-2.5 rounded-lg font-medium transition-all ${currentStep === 1 ? 'opacity-0 cursor-default' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'}`}
        >
          Back
        </button>
        <button 
          onClick={handleNext}
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-200 flex items-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Processing...' : currentStep === 4 ? 'Submit Application' : 'Next Step'}
          {!isSubmitting && currentStep !== 4 && <ChevronRight size={16} />}
        </button>
      </div>
    </div>
  );
};