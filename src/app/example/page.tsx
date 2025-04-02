"use client";

import { useToast } from '@/context/toast-context';

export default function ExampleComponent() {
  const toast = useToast();

  const handleSubmit = () => {
    try {
      // Some operation
      toast.info('Operation successful!');
      toast.warning('Operation successful!');
      toast.error('Operation successful!');
      toast.success('Operation successful!');
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  return (
    <button onClick={handleSubmit}>
      Submit
    </button>
  );
}