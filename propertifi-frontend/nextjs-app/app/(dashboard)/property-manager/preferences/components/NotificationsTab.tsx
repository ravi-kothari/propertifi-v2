'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Loader2, Mail, MessageSquare, Bell } from 'lucide-react';
import type { PreferencesData } from '../page';

const notificationsSchema = z.object({
  email_notifications: z.boolean(),
  sms_notifications: z.boolean(),
});

type NotificationsFormData = z.infer<typeof notificationsSchema>;

interface NotificationsTabProps {
  data?: PreferencesData;
  onSave: (data: Partial<PreferencesData>) => void;
  isSaving: boolean;
}

export default function NotificationsTab({ data, onSave, isSaving }: NotificationsTabProps) {
  const {
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm<NotificationsFormData>({
    resolver: zodResolver(notificationsSchema),
    defaultValues: {
      email_notifications: data?.notifications.email_notifications ?? true,
      sms_notifications: data?.notifications.sms_notifications ?? false,
    },
  });

  const onSubmit = (formData: NotificationsFormData) => {
    onSave({ notifications: formData });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="h-5 w-5 text-indigo-600" />
          <div>
            <h3 className="font-semibold text-lg">Notification Preferences</h3>
            <p className="text-sm text-gray-600">
              Choose how you want to be notified about new leads and updates
            </p>
          </div>
        </div>

        {/* Email Notifications */}
        <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
          <div className="flex items-start space-x-4 flex-1">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Mail className="h-5 w-5 text-indigo-600" />
            </div>
            <div className="flex-1">
              <Label htmlFor="email_notifications" className="text-base font-medium cursor-pointer">
                Email Notifications
              </Label>
              <p className="text-sm text-gray-600 mt-1">
                Receive instant email alerts when new leads match your criteria
              </p>
              <ul className="text-xs text-gray-500 mt-2 space-y-1 list-disc list-inside">
                <li>New lead notifications</li>
                <li>Lead status updates</li>
                <li>Weekly performance summary</li>
              </ul>
            </div>
          </div>
          <Controller
            name="email_notifications"
            control={control}
            render={({ field }) => (
              <Switch
                id="email_notifications"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </div>

        {/* SMS Notifications */}
        <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
          <div className="flex items-start space-x-4 flex-1">
            <div className="p-2 bg-green-100 rounded-lg">
              <MessageSquare className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex-1">
              <Label htmlFor="sms_notifications" className="text-base font-medium cursor-pointer">
                SMS Notifications
              </Label>
              <p className="text-sm text-gray-600 mt-1">
                Get text messages for high-priority leads (additional charges may apply)
              </p>
              <ul className="text-xs text-gray-500 mt-2 space-y-1 list-disc list-inside">
                <li>High-value lead alerts</li>
                <li>Urgent lead responses needed</li>
                <li>Time-sensitive opportunities</li>
              </ul>
            </div>
          </div>
          <Controller
            name="sms_notifications"
            control={control}
            render={({ field }) => (
              <Switch
                id="sms_notifications"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Bell className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">Notification Tips</h4>
            <ul className="text-sm text-blue-800 mt-2 space-y-1">
              <li>• Enable email notifications for comprehensive updates</li>
              <li>• SMS is best for urgent, high-priority leads</li>
              <li>• You can adjust these settings anytime</li>
              <li>• Check your spam folder if you don't receive notifications</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t">
        <Button
          type="submit"
          disabled={!isDirty || isSaving}
          className="min-w-[120px]"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </div>
    </form>
  );
}
