"use client";

import { create } from "zustand";

type SignInFormData = {
  email: string;
  password: string;
  keepSignedIn: boolean;
  otpCode: string;
};

type SignInStore = {
  step: number;
  totalSteps: number;
  formData: SignInFormData;
  setStep: (step: number) => void;
  updateFormData: (data: Partial<SignInFormData>) => void;
};

export const useSignInStore = create<SignInStore>((set) => ({
  step: 1,
  totalSteps: 3,
  formData: {
    email: "",
    password: "",
    keepSignedIn: true,
    otpCode: "",
  },
  setStep: (step) => set({ step }),
  updateFormData: (data) =>
    set((state) => ({ formData: { ...state.formData, ...data } })),
}));
