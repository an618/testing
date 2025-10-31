"use client";

import { useMutation } from "@tanstack/react-query";
import {
  TrusteeConfirmationRequest,
  TrusteeConfirmationResponse,
  TrusteeSignatureRequest,
  TrusteeSignatureResponse,
} from "./types";
import { trusteeApi } from "./api";

export const useTrusteeConfirmation = () => {
  return useMutation<
    TrusteeConfirmationResponse,
    Error,
    TrusteeConfirmationRequest
  >({
    mutationFn: trusteeApi.confirm,
    onError: (error) => {
      console.error("Error confirming trustee:", error);
    },
  });
};

export const useTrusteeSignature = () => {
  return useMutation<TrusteeSignatureResponse, Error, TrusteeSignatureRequest>({
    mutationFn: trusteeApi.sign,
    onError: (error) => {
      console.error("Error submitting trustee signature:", error);
    },
  });
};
