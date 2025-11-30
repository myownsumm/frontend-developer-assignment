import { Input, Box, Text } from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import { SearchBarProps } from "../../../types/recipients";

export const SearchBar = ({ placeholder = "search", value, onChange }: SearchBarProps) => {
  const [localValue, setLocalValue] = useState(value);
  const [isPending, setIsPending] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync local value with external value when it changes externally
  useEffect(() => {
    setLocalValue(value);
    setIsPending(false);
  }, [value]);

  // Debounce the onChange callback
  useEffect(() => {
    // Check if local value differs from external value (pending state)
    const hasPendingChanges = localValue !== value;
    setIsPending(hasPendingChanges);

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Only set timeout if there are pending changes
    if (hasPendingChanges) {
      // Set new timeout to call onChange after 500ms
      timeoutRef.current = setTimeout(() => {
        onChange(localValue);
        setIsPending(false);
      }, 500);
    }

    // Cleanup timeout on unmount or when localValue changes
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [localValue, value, onChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
  };

  return (
    <Box position="relative">
      <Box
        as="style"
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes searchRotate {
              from {
                transform: translateY(-50%) rotate(0deg);
              }
              to {
                transform: translateY(-50%) rotate(360deg);
              }
            }
          `,
        }}
      />
      <Text
        position="absolute"
        left="12px"
        top="50%"
        transform="translateY(-50%)"
        color="gray.300"
        pointerEvents="none"
        zIndex={1}
        style={{
          animation: isPending ? "searchRotate 1s linear infinite" : undefined,
          transition: "animation 0.2s",
        }}
      >
        🔍
      </Text>
      <Input
        placeholder={placeholder}
        pl="40px"
        value={localValue}
        onChange={handleChange}
      />
    </Box>
  );
};

