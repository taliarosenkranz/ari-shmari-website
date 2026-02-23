import { useState, useMemo } from 'react';
import { Check } from "lucide-react";
import DashboardLayout from '@/components/DashboardLayout';
import StepBasicInfo from '@/components/create-event/StepBasicInfo';
import StepInvitation from '@/components/create-event/StepInvitationInfo';
import StepGuests from '@/components/create-event/StepGuests';
import StepScheduling from '@/components/create-event/StepScheduling';
import StepReview from '@/components/create-event/StepReview';

const STEPS_FULL = ['Basic Info', 'Invitation', 'Guests', 'Scheduling', 'Review'];
const STEPS_RSVP_ONLY = ['Basic Info', 'Guests', 'Scheduling', 'Review'];

interface FormData {
    // Basic Info
    name: string;
    date: string;
    venue: string;
    start_time: string;
    end_time: string;
    chuppah_start_time: string;
    dress_code: string;
    location_map: string;
    special_notes: string;
    // Invitation
    invitation_message: string;
    invitation_image_url: string;
    // Guests
    guests: any[];
    // Scheduling
    skip_invitations: boolean;  // RSVP-only mode
    invitation_send_date: string;
    rsvp_reminder_count: number;
    rsvp_reminder_date_1: string;
    rsvp_reminder_date_2: string;
    rsvp_reminder_date_3: string;
    rsvp_same_message_for_all: boolean;
    rsvp_reminder_message_default: string;
    rsvp_reminder_message_1: string;
    rsvp_reminder_message_2: string;
    rsvp_reminder_message_3: string;
}

export default function CreateEvent() {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState<FormData>({
        // Basic Info
        name: '',
        date: '',
        venue: '',
        start_time: '',
        end_time: '',
        chuppah_start_time: '',
        dress_code: '',
        location_map: '',
        special_notes: '',
        // Invitation
        invitation_message: "You're invited to celebrate with us!",
        invitation_image_url: '',
        // Guests
        guests: [],
        // Scheduling
        skip_invitations: false,  // RSVP-only mode default is off
        invitation_send_date: '',
        rsvp_reminder_count: 1,
        rsvp_reminder_date_1: '',
        rsvp_reminder_date_2: '',
        rsvp_reminder_date_3: '',
        rsvp_same_message_for_all: true,
        rsvp_reminder_message_default: "Hi! Just a friendly reminder to RSVP. Please reply:\n1️⃣ Coming\n2️⃣ Not Coming\n3️⃣ Ask Me Later",
        rsvp_reminder_message_1: '',
        rsvp_reminder_message_2: '',
        rsvp_reminder_message_3: '',
    });

    // Dynamically calculate steps based on RSVP-only mode
    const steps = useMemo(() => 
        formData.skip_invitations ? STEPS_RSVP_ONLY : STEPS_FULL
    , [formData.skip_invitations]);

    const updateFormData = (data: Partial<FormData>) => {
        setFormData(prev => ({ ...prev, ...data }));
    };

    const nextStep = () => {
        if (currentStep < steps.length - 1) setCurrentStep(prev => prev + 1);
    };

    const prevStep = () => {
        if (currentStep > 0) setCurrentStep(prev => prev - 1);
    };

    // Map visual step index to actual component
    // When RSVP-only: [BasicInfo, Guests, Scheduling, Review]
    // When full flow: [BasicInfo, Invitation, Guests, Scheduling, Review]
    const renderStep = () => {
        if (formData.skip_invitations) {
            // RSVP-only mode: skip invitation step
            switch (currentStep) {
                case 0:
                    return <StepBasicInfo data={formData} onUpdate={updateFormData} onNext={nextStep} />;
                case 1:
                    return <StepGuests data={formData} onUpdate={updateFormData} onNext={nextStep} onBack={prevStep} />;
                case 2:
                    return <StepScheduling data={formData} onUpdate={updateFormData} onNext={nextStep} onBack={prevStep} />;
                case 3:
                    return <StepReview data={formData} onBack={prevStep} />;
                default:
                    return null;
            }
        } else {
            // Full flow with invitation step
            switch (currentStep) {
                case 0:
                    return <StepBasicInfo data={formData} onUpdate={updateFormData} onNext={nextStep} />;
                case 1:
                    return <StepInvitation data={formData} onUpdate={updateFormData} onNext={nextStep} onBack={prevStep} />;
                case 2:
                    return <StepGuests data={formData} onUpdate={updateFormData} onNext={nextStep} onBack={prevStep} />;
                case 3:
                    return <StepScheduling data={formData} onUpdate={updateFormData} onNext={nextStep} onBack={prevStep} />;
                case 4:
                    return <StepReview data={formData} onBack={prevStep} />;
                default:
                    return null;
            }
        }
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-slate-50 pb-20">
            {/* Progress Bar */}
            <div className="bg-white border-b border-slate-200 sticky top-16 z-40">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between relative">
                        {steps.map((step, index) => (
                            <div key={step} className="flex flex-col items-center relative z-10">
                                <div 
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-300 ${
                                        index <= currentStep ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'
                                    }`}
                                >
                                    {index < currentStep ? <Check className="w-4 h-4" /> : index + 1}
                                </div>
                                <span className={`text-xs mt-2 font-medium ${index <= currentStep ? 'text-emerald-600' : 'text-slate-400'}`}>
                                    {step}
                                </span>
                            </div>
                        ))}
                        {/* Connecting Line */}
                        <div className="absolute top-4 left-0 w-full h-[2px] bg-slate-200 -z-0 transform -translate-y-1/2">
                            <div 
                                className="h-full bg-emerald-500 transition-all duration-300"
                                style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                {renderStep()}
            </div>
        </div>
        </DashboardLayout>
    );
}