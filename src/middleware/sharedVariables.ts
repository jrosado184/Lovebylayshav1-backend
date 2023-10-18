// Modify your module to include a callback function
let appointmentId: string;
let callback: ((id: string) => void) | undefined;

export const getAppointmentId = (): string => appointmentId;

export const setAppointmentId = (id: string): void => {
  appointmentId = id;
  if (callback) {
    callback(id); // Call the callback function when appointmentId is set
    callback = undefined; // Clear the callback
  }
};

export const waitForAppointmentId = (cb: (id: string) => void): void => {
  if (appointmentId) {
    cb(appointmentId); // If appointmentId is already set, call the callback immediately
  } else {
    callback = cb; // Set the callback to be called when appointmentId is available
  }
};

