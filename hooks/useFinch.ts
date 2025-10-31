'use client';

import { useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { finchApi, FinchUrlResponse, FinchCallbackRequest, FinchCallbackResponse } from '@/services/finch';

// Hook for managing Finch integration
export const useFinch = () => {
  // Mutation for getting Finch authorization URL
  const getFinchUrlMutation = useMutation({
    mutationFn: () => finchApi.getFinchUrl(),
    onSuccess: (data: FinchUrlResponse) => {
      console.log('✅ Finch URL received:', data.url);
      // Redirect to Finch authorization URL
      window.location.href = data.url;
    },
    onError: (error) => {
      console.error('❌ Failed to get Finch URL:', error);
      throw error;
    },
  });

  // Mutation for sending Finch callback
  const sendCallbackMutation = useMutation({
    mutationFn: (data: FinchCallbackRequest) => {
      console.log('🚀 Finch callback mutation started with code:', data.code ? '***' : 'no code');
      return finchApi.sendCallback(data);
    },
    onSuccess: (data: FinchCallbackResponse) => {
      console.log('✅ Finch callback mutation succeeded:', data);
    },
    onError: (error) => {
      console.error('❌ Finch callback mutation failed:', error);
      throw error;
    },
  });

  // Function to initiate Finch connection
  const connectFinch = useCallback(() => {
    console.log('🔗 Initiating Finch connection...');
    getFinchUrlMutation.mutate();
  }, [getFinchUrlMutation]);

  // Function to send callback code
  const sendCallback = useCallback((code: string) => {
    console.log('📤 Sending Finch callback code...');
    sendCallbackMutation.mutate({ code });
    return sendCallbackMutation.data;
  }, [sendCallbackMutation]);

  return {
    connectFinch,
    sendCallback,
    isLoading: getFinchUrlMutation.isPending || sendCallbackMutation.isPending,
    error: getFinchUrlMutation.error || sendCallbackMutation.error,
    isError: getFinchUrlMutation.isError || sendCallbackMutation.isError,
    callbackData: sendCallbackMutation.data,
  };
}; 