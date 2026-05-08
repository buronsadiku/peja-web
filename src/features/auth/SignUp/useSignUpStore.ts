"use client";

import { create } from "zustand";

type SignUpFormData = {
  email: string;
  password: string;
  agreedToTerms: boolean;
  otpCode: string;
  partner1Name: string;
  partner2Name: string;
  displayOrder: string;
  weddingDate: Date | null;
  dateUndecided: boolean;
  venue: string;
  coverType: string;
  coverFile: File | null;
  coverFilePreview: string | null;
  bookUrl: string;
  selectedPlan: string;
};

type SignUpStore = {
  step: number;
  totalSteps: number;
  formData: SignUpFormData;
  setStep: (step: number) => void;
  updateFormData: (data: Partial<SignUpFormData>) => void;
};

const initialFormData: SignUpFormData = {
  email: "",
  password: "",
  agreedToTerms: false,
  otpCode: "",
  partner1Name: "",
  partner2Name: "",
  displayOrder: "",
  weddingDate: null,
  dateUndecided: false,
  venue: "",
  coverType: "",
  coverFile: null,
  coverFilePreview: null,
  bookUrl: "",
  selectedPlan: "",
};

export const useSignUpStore = create<SignUpStore>((set) => ({
  step: 1,
  totalSteps: 7,
  formData: initialFormData,
  setStep: (step) => set({ step }),
  updateFormData: (data) =>
    set((state) => ({ formData: { ...state.formData, ...data } })),
}));
