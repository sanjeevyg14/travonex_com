// This file implements a custom hook for showing "toast" notifications.
// It's built on top of Radix UI's Toast component and provides a simple, imperative API.
// This pattern is inspired by popular libraries like react-hot-toast and sonner.

// The key idea is to manage the toast state globally (or at least high up in the component tree)
// and provide a simple function (`toast`) that can be called from anywhere in the app
// to trigger a notification, without needing to manage component state for each toast.

'use client';

import * as React from "react"

// Import the specific types from the Radix UI toast component.
// These types will be used to define the state and props for our custom implementation.
import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

// Define a constant for the duration after which a toast should be automatically dismissed.
const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

// Define the shape of a single toast object.
type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
}

// Define the actions that can be dispatched to the toast state reducer.
const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const; // `as const` makes the object properties readonly.

// A counter to ensure unique IDs for each toast.
let count = 0;

// A helper function to generate a unique ID for each new toast.
function genId() {
  count = (count + 1) % Number.MAX_VALUE;
  return count.toString();
}

// The reducer function is a pure function that takes the current state and an action,
// and returns the new state. It's the heart of the state management for the toasts.
const reducer = (
  state: State,
  action: Action
): State => {
  switch (action.type) {
    // Add a new toast to the beginning of the array.
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    // Update an existing toast's properties (e.g., to show a loading state).
    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    // Change a toast's `open` prop to `false` to trigger its exit animation.
    case "DISMISS_TOAST":
      const { toastId } = action;
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      };
    
    // Remove a toast from the array completely, usually after its exit animation.
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
}

// An array to queue toasts that are created before the Toaster component has mounted.
const listeners: Array<(state: State) => void> = [];

// The initial state for the toast system.
let memoryState: State = { toasts: [] };

// A function to dispatch actions to the reducer and update all listeners.
function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

// The main `toast` function that components will call.
// It creates a toast object and dispatches the ADD_TOAST action.
function toast({ ...props }: Omit<ToasterToast, "id">) {
  const id = genId();

  // A helper function to update the toast, useful for showing success/error after a promise.
  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    });
  
  // A function to dismiss the toast programmatically.
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  return {
    id: id,
    dismiss,
    update,
  };
}

// The custom hook `useToast` which provides access to the toast state and the `toast` function.
function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  // Subscribe to state changes when the component mounts.
  React.useEffect(() => {
    listeners.push(setState);
    // Unsubscribe on cleanup.
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  };
}

// --- TYPE DEFINITIONS ---
// Define the types for the state and actions, ensuring type safety.

type State = {
  toasts: ToasterToast[]
}

type Action =
  | {
      type: "ADD_TOAST"
      toast: ToasterToast
    }
  | {
      type: "UPDATE_TOAST"
      toast: Partial<ToasterToast>
    }
  | {
      type: "DISMISS_TOAST"
      toastId?: ToasterToast["id"]
    }
  | {
      type: "REMOVE_TOAST"
      toastId?: ToasterToast["id"]
    }


// --- EXPORTS ---

export { useToast, toast };
