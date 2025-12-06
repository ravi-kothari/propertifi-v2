'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, User, Building2, Phone, Mail } from 'lucide-react';
import type { PreferencesData } from '../page';

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  phone: z.string().max(20).optional(),
  company_name: z.string().max(255).optional(),
  bio: z.string().max(1000).optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileTabProps {
  data?: PreferencesData;
  onSave: (data: Partial<PreferencesData>) => void;
  isSaving: boolean;
}

export default function ProfileTab({ data, onSave, isSaving }: ProfileTabProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: data?.profile || {
      name: '',
      phone: '',
      company_name: '',
      bio: '',
    },
  });

  const onSubmit = (formData: ProfileFormData) => {
    onSave({
      profile: {
        name: formData.name,
        email: data?.profile.email || '',
        phone: formData.phone || '',
        company_name: formData.company_name || '',
        bio: formData.bio || '',
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Full Name *
            </Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="John Doe"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Email (read-only) */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </Label>
            <Input
              id="email"
              value={data?.profile.email || ''}
              disabled
              className="bg-gray-50"
            />
            <p className="text-xs text-gray-500">Email cannot be changed</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Phone Number
            </Label>
            <Input
              id="phone"
              {...register('phone')}
              placeholder="+1 (555) 123-4567"
              type="tel"
              className={errors.phone ? 'border-red-500' : ''}
            />
            {errors.phone && (
              <p className="text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>

          {/* Company Name */}
          <div className="space-y-2">
            <Label htmlFor="company_name" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Company Name
            </Label>
            <Input
              id="company_name"
              {...register('company_name')}
              placeholder="ABC Property Management"
              className={errors.company_name ? 'border-red-500' : ''}
            />
            {errors.company_name && (
              <p className="text-sm text-red-600">{errors.company_name.message}</p>
            )}
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <Label htmlFor="bio">Bio / About</Label>
          <Textarea
            id="bio"
            {...register('bio')}
            placeholder="Tell us about yourself and your property management experience..."
            rows={4}
            className={errors.bio ? 'border-red-500' : ''}
          />
          {errors.bio && (
            <p className="text-sm text-red-600">{errors.bio.message}</p>
          )}
          <p className="text-xs text-gray-500">
            Maximum 1000 characters. This will be displayed on your public profile.
          </p>
        </div>
      </div>

      <div className="flex justify-end">
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
