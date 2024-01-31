import { useState, useEffect, useRef } from "react";
import { useGetStudentRecommendationQuery } from "authentication/redux/api/authApi";

export const useOptionLoader = (fieldName: string) => {
  const [input, setInput] = useState('');
  const [options, setOptions] = useState<Option[]>([]);
  const [triggerFetch, setTriggerFetch] = useState(false);
  const resolveOptionsPromise = useRef<((options: Option[]) => void) | null>(null);

  const { data, isFetching, error } = useGetStudentRecommendationQuery(
    { fieldName, input: input },
    { skip: !triggerFetch }
  );

  useEffect(() => {
    if (data && !isFetching && !error) {
      const newOptions = data.map(item => ({
        value: item.name,
        label: item.name,
      }));
      setOptions(newOptions);
      // Resolve the promise with new options if there's a pending promise
      if (resolveOptionsPromise.current) {
        resolveOptionsPromise.current(newOptions);
        resolveOptionsPromise.current = null; // Reset the resolver
      }
      setTriggerFetch(false);
    }
  }, [data, isFetching, error]);

  const loadOptions = (inputValue: string = '') => {
    setInput(inputValue);
    setTriggerFetch(t => !t);

    // Return a promise that resolves with the new options once they're available
    return new Promise<Option[]>((resolve) => {
      resolveOptionsPromise.current = resolve;
    });
  };

  return { options, setOptions, loadOptions };
}; 