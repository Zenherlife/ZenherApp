import { UserState } from '@/modules/auth/store/useUserDataStore';

export const calculateProfileCompletion = (user: UserState): number => {
  let totalFields = 0;
  let filledFields = 0;

  const fieldsToCheck: (keyof UserState)[] = [
    'displayName',
    'email',
    'dateOfBirth',
    'lastPeriodDate',
    'averageCycle',
    'height',
    'weight'
  ];

  fieldsToCheck.forEach((field) => {
    totalFields++;
    const value = user[field];

    if (typeof value === 'string' && value.trim() !== '') filledFields++;
    else if (typeof value === 'number' && value > 0) filledFields++;
    
  });

  const reminderFields: (keyof UserState['reminder'])[] = ['time', 'schedule', 'title', 'body'];

  reminderFields.forEach((field) => {
    totalFields++;
    if (user.reminder[field].trim() !== '') filledFields++;
  });
  return (filledFields / totalFields);
};
